import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/workshop-hub';

// Define schemas
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

const Workshop = mongoose.model('Workshop', workshopSchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Read seed data
    const seedFilePath = path.join(__dirname, 'seed-workshops.json');
    const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));
    console.log(`✓ Loaded ${seedData.length} workshops from seed file`);

    // Clear existing workshops
    const deleteResult = await Workshop.deleteMany({});
    console.log(`✓ Deleted ${deleteResult.deletedCount} existing workshops`);

    // Insert seed data
    const insertResult = await Workshop.insertMany(seedData);
    console.log(`✓ Successfully inserted ${insertResult.length} workshops`);

    // Verify data
    const count = await Workshop.countDocuments();
    console.log(`✓ Database now contains ${count} workshops`);

    // Display workshop titles
    console.log('\nSeeded workshops:');
    const workshops = await Workshop.find({}, { title: 1, category: 1, price: 1 }).lean();
    workshops.forEach((w, idx) => {
      console.log(`  ${idx + 1}. ${w.title} (${w.category}) - $${w.price}`);
    });

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
