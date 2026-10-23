import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import { getQuiz } from "./quizzes.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB ?? "workshophub";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment. Please add it to .env.");
  throw new Error("Missing MONGODB_URI");
}

if (!JWT_SECRET || JWT_SECRET === "your-secret-key-change-in-production") {
  console.error("Missing or default JWT_SECRET in environment. Please set a secure JWT_SECRET in .env.");
  throw new Error("Missing JWT_SECRET");
}

const app = express();

// Vercel (and most hosts) sit behind a proxy; trust it so rate limiting keys on the real client IP.
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later."
});

app.use(limiter);
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

let db;
let client;

const connectDb = async () => {
  if (db) return db;
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);

  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("workshops").createIndex({ id: 1 }, { unique: true }),
    db.collection("bookings").createIndex({ id: 1 }, { unique: true }),
    db.collection("payments").createIndex({ id: 1 }, { unique: true }),
    db.collection("events").createIndex({ timestamp: -1 }),
  ]);

  await ensureAdminUser();

  return db;
};

const ensureAdminUser = async () => {
  const users = await getCollection('users');
  const existingAdmin = await users.findOne({ role: 'admin' });
  if (existingAdmin) return;
  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    console.warn('No admin user exists; set DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD to create one.');
    return;
  }

  const adminUser = {
    id: `admin-${Date.now()}`,
    name: 'Admin',
    email: DEFAULT_ADMIN_EMAIL,
    password: await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10),
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  await users.insertOne(adminUser);
  console.log(`Created default admin user: ${DEFAULT_ADMIN_EMAIL}`);
};

const getCollection = async (name) => {
  const database = await connectDb();
  return database.collection(name);
};

const logEvent = async (event) => {
  const col = await getCollection("events");
  await col.insertOne({ ...event, timestamp: new Date() });
};

const adjustWorkshopSeats = async (workshopId, delta) => {
  if (!workshopId) return;
  const col = await getCollection("workshops");
  const result = await col.findOneAndUpdate(
    { id: workshopId },
    { $inc: { availableSeats: delta } },
    { returnDocument: "after" }
  );

  if (result.value && result.value.availableSeats < 0) {
    await col.updateOne({ id: workshopId }, { $set: { availableSeats: 0 } });
  }
};

// Clients echo back Mongo's _id as a string; $set-ing it would try to change the immutable field.
const withoutMongoId = ({ _id, ...rest }) => rest;

const upsertDocument = async (collectionName, query, value) => {
  const collection = await getCollection(collectionName);
  await collection.updateOne(query, { $set: withoutMongoId(value) }, { upsert: true });
};

const appLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Authorization middleware for admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Input validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'admin').required()
});

const registerSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student').default('student')
});

const emailParamSchema = Joi.object({
  email: Joi.string().email().required()
});

app.use(appLogger);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/users", authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const users = await (await getCollection("users")).find({}).toArray();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/login", authLimiter, async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const { email, password, role } = value;
    const users = await getCollection("users");
    let user = await users.findOne({ email, role });
    if (!user) {
      user = await users.findOne({ email });
    }
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    let isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword && user.password === password) {
      // Legacy plaintext password support: migrate to a hashed password on first successful login.
      isValidPassword = true;
      const hashedPassword = await bcrypt.hash(password, 10);
      await users.updateOne({ email: user.email }, { $set: { password: hashedPassword } });
    }

    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    await logEvent({ type: "login", userId: user.id, email: user.email, role: user.role });

    const { password: _password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const users = await getCollection("users");
    // Public sign-up only ever creates students; admins are promoted from the admin console.
    const user = { ...value, role: 'student' };
    const existingUser = await users.findOne({ email: user.email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: "Email already exists" });
    }
    user.password = await bcrypt.hash(user.password, 10);

    await users.insertOne(user);
    await logEvent({ type: "register", userId: user.id, email: user.email, role: user.role });

    const { password: _password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.put("/api/users/:email", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error } = emailParamSchema.validate({ email: req.params.email });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const email = req.params.email;
    const updates = req.body;
    const users = await getCollection("users");
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const updatedUser = withoutMongoId({ ...existingUser, ...updates, email });
    if (updates.password) {
      updatedUser.password = await bcrypt.hash(updates.password, 10);
    }
    await users.updateOne({ email }, { $set: updatedUser });
    const { password: _password, ...userWithoutPassword } = updatedUser;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.delete("/api/users/:email", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error } = emailParamSchema.validate({ email: req.params.email });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    await (await getCollection("users")).deleteOne({ email: req.params.email });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

// The public catalog keeps material titles so the locked Materials tab can list them,
// but links are only served by /api/workshops/:id/content to paid attendees.
// Quiz cards show the real size of each question set, not the number stored with the workshop.
const withQuizCounts = (workshopId, mcqs = []) =>
  mcqs.map((mcq, index) => ({ ...mcq, questions: getQuiz(workshopId, index)?.length ?? mcq.questions }));

const withoutContentLinks = ({ learningContent, ...workshop }) => ({
  ...workshop,
  learningContent: {
    pdfs: (learningContent?.pdfs ?? []).map(({ title }) => ({ title })),
    videos: (learningContent?.videos ?? []).map(({ title, duration }) => ({ title, duration })),
    mcqs: withQuizCounts(workshop.id, learningContent?.mcqs),
  },
});

// Shuffled per request so the right answer isn't always in the same position.
const shuffleOptions = ({ options, correctAnswer, ...question }) => {
  const order = options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { ...question, options: order.map((i) => options[i]), correctAnswer: order.indexOf(correctAnswer) };
};

const hasPaidAccess = async (user, workshopId) => {
  if (user.role === "admin") return true;
  const paidBooking = await (await getCollection("bookings")).findOne({
    workshopId,
    userId: user.id,
    status: "confirmed",
    paymentId: { $exists: true, $ne: "" },
  });
  return !!paidBooking;
};

app.get("/api/workshops", async (_req, res) => {
  try {
    const workshops = await (await getCollection("workshops")).find({}).toArray();
    res.json(workshops.map(withoutContentLinks));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/workshops", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const workshop = req.body;
    await upsertDocument("workshops", { id: workshop.id }, workshop);
    res.json({ success: true, workshop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.put("/api/workshops/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const workshops = await getCollection("workshops");
    const existingWorkshop = await workshops.findOne({ id });
    if (!existingWorkshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }
    const updatedWorkshop = withoutMongoId({ ...existingWorkshop, ...updates, id });
    await workshops.updateOne({ id }, { $set: updatedWorkshop });
    res.json({ success: true, workshop: updatedWorkshop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.delete("/api/workshops/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await (await getCollection("workshops")).deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/workshops/init", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const workshops = req.body.workshops ?? [];
    const existing = await (await getCollection("workshops")).find({}).limit(1).toArray();
    if (existing.length > 0) {
      return res.json({ success: true, message: "Workshops already initialized" });
    }
    if (workshops.length > 0) {
      await (await getCollection("workshops")).insertMany(workshops.map((workshop) => ({ ...workshop })));
    }
    res.json({ success: true, count: workshops.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

// Full materials, links included: admins, or students with a confirmed, paid booking for this workshop.
app.get("/api/workshops/:id/content", authenticateToken, async (req, res) => {
  try {
    const workshop = await (await getCollection("workshops")).findOne({ id: req.params.id });
    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    if (!(await hasPaidAccess(req.user, req.params.id))) {
      return res.status(403).json({ error: "Pay for this workshop to unlock its materials" });
    }

    const content = workshop.learningContent ?? { pdfs: [], videos: [], mcqs: [] };
    res.json({ ...content, mcqs: withQuizCounts(workshop.id, content.mcqs) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

// One quiz's questions (answers included), under the same paid-booking rule as the other materials.
app.get("/api/workshops/:id/quizzes/:index", authenticateToken, async (req, res) => {
  try {
    const workshop = await (await getCollection("workshops")).findOne({ id: req.params.id });
    const index = Number(req.params.index);
    const mcq = workshop?.learningContent?.mcqs?.[index];
    if (!mcq) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (!(await hasPaidAccess(req.user, req.params.id))) {
      return res.status(403).json({ error: "Pay for this workshop to unlock its quizzes" });
    }

    const questions = getQuiz(req.params.id, index);
    if (!questions) {
      return res.status(404).json({ error: "This quiz has no questions yet" });
    }
    res.json({ title: mcq.title, questions: questions.map((question, i) => ({ id: i + 1, ...shuffleOptions(question) })) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

// Public attendee list for a workshop page: names only, no emails or payment details.
app.get("/api/workshops/:id/attendees", async (req, res) => {
  try {
    const bookings = await (await getCollection("bookings"))
      .find({ workshopId: req.params.id, status: "confirmed" }, { projection: { userId: 1, userName: 1 } })
      .toArray();
    res.json(bookings.map((booking) => ({ id: booking.userId, name: booking.userName || "Anonymous attendee" })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

// Admins see every booking; students only their own.
app.get("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { userId: req.user.id };
    const bookings = await (await getCollection("bookings")).find(query).toArray();
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const booking = isAdmin ? req.body : { ...req.body, userId: req.user.id };
    const bookings = await getCollection("bookings");
    const existingBooking = await bookings.findOne({ id: booking.id });

    if (existingBooking && !isAdmin && existingBooking.userId !== req.user.id) {
      return res.status(403).json({ error: "You can only change your own bookings" });
    }

    if (existingBooking) {
      if (existingBooking.status === "cancelled" && booking.status === "confirmed") {
        await adjustWorkshopSeats(booking.workshopId, -1);
      } else if (existingBooking.status === "confirmed" && booking.status === "cancelled") {
        await adjustWorkshopSeats(booking.workshopId, 1);
      }
    } else if (booking.status === "confirmed") {
      await adjustWorkshopSeats(booking.workshopId, -1);
    }

    await upsertDocument("bookings", { id: booking.id }, booking);
    await logEvent({ type: "booking", userId: booking.userId, workshopId: booking.workshopId, amount: booking.amount });
    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.delete("/api/bookings/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await (await getCollection("bookings")).deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.get("/api/payments", authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const payments = await (await getCollection("payments")).find({}).toArray();
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/payments", authenticateToken, async (req, res) => {
  try {
    const payment = req.user.role === "admin" ? req.body : { ...req.body, userId: req.user.id };
    await upsertDocument("payments", { id: payment.id }, payment);
    await logEvent({ type: "payment", paymentId: payment.id, userId: payment.userId, amount: payment.amount });
    res.json({ success: true, payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.get("/api/admin/stats", authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const users = await (await getCollection("users")).find({}).toArray();
    const workshops = await (await getCollection("workshops")).find({}).toArray();
    const bookings = await (await getCollection("bookings")).find({}).toArray();

    const totalRevenue = bookings
      .filter((booking) => booking.status !== "cancelled")
      .reduce((sum, booking) => sum + (booking.amount || 0), 0);
    const adminUsers = users.filter((user) => user.role === "admin");
    const studentUsers = users.filter((user) => user.role !== "admin");

    res.json({
      totalUsers: users.length,
      totalAdmins: adminUsers.length,
      totalStudents: studentUsers.length,
      totalWorkshops: workshops.length,
      totalBookings: bookings.length,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.get("/api/events", authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const events = await (await getCollection("events")).find({}).sort({ timestamp: -1 }).toArray();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

export { app, connectDb };
export default app;
