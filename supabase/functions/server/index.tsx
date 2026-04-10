import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize default admin user
const initializeAdmin = async () => {
  try {
    const users = await kv.getByPrefix("user:");
    const adminExists = users.some((u: any) => u.role === 'admin');
    
    if (!adminExists) {
      const defaultAdmin = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@workshophub.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      await kv.set(`user:${defaultAdmin.email}`, defaultAdmin);
      console.log('✅ Default admin user created');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

// Initialize on startup
initializeAdmin();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
  })
);

// Explicit OPTIONS handler for preflight requests
app.options('*', (c) => c.text('', 204));

// Health check endpoint
app.get("/make-server-008fe078/health", (c) => {
  return c.json({ status: "ok" });
});

// Users
app.get("/make-server-008fe078/users", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    return c.json(users);
  } catch (error) {
    console.error("GET /users error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-008fe078/users", async (c) => {
  try {
    const user = await c.req.json();
    await kv.set(`user:${user.email}`, user);
    return c.json({ success: true, user });
  } catch (error) {
    console.error("POST /users error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

app.put("/make-server-008fe078/users/:email", async (c) => {
  try {
    const email = c.req.param("email");
    const updates = await c.req.json();
    
    const existingUser = await kv.get(`user:${email}`);
    if (!existingUser) {
      return c.json({ error: "User not found" }, 404);
    }
    
    const updatedUser = { ...existingUser, ...updates };
    await kv.set(`user:${email}`, updatedUser);
    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("PUT /users/:email error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

app.delete("/make-server-008fe078/users/:email", async (c) => {
  try {
    const email = c.req.param("email");
    await kv.del(`user:${email}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("DELETE /users/:email error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Workshops
app.get("/make-server-008fe078/workshops", async (c) => {
  try {
    const workshops = await kv.getByPrefix("workshop:");
    return c.json(workshops);
  } catch (error) {
    console.error("GET /workshops error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-008fe078/workshops", async (c) => {
  try {
    const workshop = await c.req.json();
    await kv.set(`workshop:${workshop.id}`, workshop);
    return c.json({ success: true, workshop });
  } catch (error) {
    console.error("POST /workshops error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

app.put("/make-server-008fe078/workshops/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const existingWorkshop = await kv.get(`workshop:${id}`);
    if (!existingWorkshop) {
      return c.json({ error: "Workshop not found" }, 404);
    }
    
    const updatedWorkshop = { ...existingWorkshop, ...updates };
    await kv.set(`workshop:${id}`, updatedWorkshop);
    return c.json({ success: true, workshop: updatedWorkshop });
  } catch (error) {
    console.error("PUT /workshops/:id error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

app.delete("/make-server-008fe078/workshops/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`workshop:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("DELETE /workshops/:id error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Multiple Workshops initialization
app.post("/make-server-008fe078/workshops/init", async (c) => {
  try {
    const { workshops } = await c.req.json();
    
    // Check if workshops already exist
    const existingWorkshops = await kv.getByPrefix("workshop:");
    if (existingWorkshops.length > 0) {
      return c.json({ success: true, message: "Workshops already initialized" });
    }
    
    // Store each workshop
    for (const workshop of workshops) {
      await kv.set(`workshop:${workshop.id}`, workshop);
    }
    
    return c.json({ success: true, count: workshops.length });
  } catch (error) {
    console.error("POST /workshops/init error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Bookings
app.get("/make-server-008fe078/bookings", async (c) => {
  try {
    const bookings = await kv.getByPrefix("booking:");
    return c.json(bookings);
  } catch (error) {
    console.error("GET /bookings error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-008fe078/bookings", async (c) => {
  try {
    const booking = await c.req.json();
    await kv.set(`booking:${booking.id}`, booking);
    
    // Update workshop enrolled count
    if (booking.workshopId) {
      const workshop = await kv.get(`workshop:${booking.workshopId}`);
      if (workshop) {
        workshop.enrolled = (workshop.enrolled || 0) + 1;
        workshop.availableSeats = (workshop.availableSeats || workshop.totalSeats) - 1;
        await kv.set(`workshop:${booking.workshopId}`, workshop);
      }
    }
    
    return c.json({ success: true, booking });
  } catch (error) {
    console.error("POST /bookings error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

app.delete("/make-server-008fe078/bookings/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`booking:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("DELETE /bookings/:id error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Admin statistics
app.get("/make-server-008fe078/admin/stats", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    const workshops = await kv.getByPrefix("workshop:");
    const bookings = await kv.getByPrefix("booking:");
    
    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
    const adminUsers = users.filter((u: any) => u.role === 'admin');
    const studentUsers = users.filter((u: any) => u.role !== 'admin');
    
    return c.json({
      totalUsers: users.length,
      totalAdmins: adminUsers.length,
      totalStudents: studentUsers.length,
      totalWorkshops: workshops.length,
      totalBookings: bookings.length,
      totalRevenue,
    });
  } catch (error) {
    console.error("GET /admin/stats error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
