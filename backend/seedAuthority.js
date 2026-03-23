require('dotenv').config();
const mongoose = require('mongoose');
const Authority = require('./models/Authority');

const seedAuthorities = [
  {
    name: "Water Department Head",
    email: "water@civicsense.com",
    department: "water",
    passwordHash: "authority123", // Will be hashed by pre-save hook
    role: "officer"
  },
  {
    name: "Road Department Head",
    email: "road@civicsense.com",
    department: "road",
    passwordHash: "authority123",
    role: "officer"
  },
  {
    name: "Electrical Dept Head",
    email: "electrical@civicsense.com",
    department: "electrical",
    passwordHash: "authority123",
    role: "officer"
  },
  {
    name: "Sanitation Dept Head",
    email: "sanitation@civicsense.com",
    department: "sanitation",
    passwordHash: "authority123",
    role: "officer"
  },
  {
    name: "General Admin",
    email: "admin@civicsense.com",
    department: "administration",
    passwordHash: "authority123",
    role: "admin"
  }
];


async function seedDB() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civicsense';
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    for (const auth of seedAuthorities) {
      const exists = await Authority.findOne({ email: auth.email });
      if (!exists) {
        await Authority.create(auth);
        console.log(`Created authority: ${auth.email}`);
      } else {
        console.log(`Authority already exists: ${auth.email}`);
      }
    }

    console.log("Seeding complete. Use 'authority123' as password.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedDB();
