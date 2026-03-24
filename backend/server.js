import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/workshop-hub';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const workshopSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  date: String,
  time: String,
  duration: String,
  category: String,
  description: String,
  price: Number,
  totalSeats: Number,
  availableSeats: Number,
  image: String,
  skills: [String],
  tutorials: [String],
  learningContent: {
    mcqTests: [{
      id: String,
      question: String,
      options: [String],
      answer: String,
      explanation: String,
    }],
    pdfResources: [{ id: String, title: String, url: String }],
    videoResources: [{ id: String, title: String, url: String }],
  },
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
  bookingDate: Date,
  paymentId: String,
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  amount: Number,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Workshop = mongoose.model('Workshop', workshopSchema);
const Booking = mongoose.model('Booking', bookingSchema);

app.get('/api/status', (req, res) => res.json({ ok: true, serverTime: new Date() }));

app.get('/api/workshops', async (req, res) => {
  const workshops = await Workshop.find().lean();
  res.json(workshops);
});

app.get('/api/workshops/:id', async (req, res) => {
  const workshop = await Workshop.findById(req.params.id).lean();
  if (!workshop) return res.status(404).json({ error: 'Workshop not found' });
  res.json(workshop);
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'User already exists' });

  const user = await User.create({ name, email, password, role: 'user' });
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@workshophub.com' && password === 'admin123') {
    return res.json({ id: 'admin-1', name: 'Admin', email, role: 'admin' });
  }

  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

app.get('/api/bookings', async (req, res) => {
  const { userId } = req.query;
  const filter = userId ? { userId } : {};
  const bookings = await Booking.find(filter).populate('workshopId').populate('userId').lean();
  res.json(bookings);
});

app.post('/api/bookings', async (req, res) => {
  const { userId, workshopId, amount } = req.body;
  if (!userId || !workshopId || !amount) return res.status(400).json({ error: 'Missing booking fields' });

  const workshop = await Workshop.findById(workshopId);
  if (!workshop) return res.status(404).json({ error: 'Workshop not found' });
  if (workshop.availableSeats <= 0) return res.status(400).json({ error: 'No seats available' });

  workshop.availableSeats -= 1;
  await workshop.save();

  const booking = await Booking.create({
    userId,
    workshopId,
    bookingDate: new Date(),
    paymentId: `PAY-${Date.now()}`,
    status: 'confirmed',
    amount,
  });

  res.json({ ...booking.toObject(), workshop });
});

app.get('/api/users', async (req, res) => {
  const users = await User.find().select('-password').lean();
  res.json(users);
});

app.post('/api/seed', async (req, res) => {
  const existing = await Workshop.countDocuments();
  if (existing === 0) {
    await Workshop.insertMany(require('./seed-workshops.json'));
  }
  const adminExists = await User.findOne({ email: 'admin@workshophub.com' });
  if (!adminExists) {
    await User.create({ name: 'Admin', email: 'admin@workshophub.com', password: 'admin123', role: 'admin' });
  }
  res.json({ seeded: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
