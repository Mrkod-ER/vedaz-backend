const mongoose = require('mongoose');
const Expert = require('../models/Expert');

const expertsData = [
  {
    name: 'Alice Johnson', category: 'Software Engineering', experience: 8, rating: 4.8,
    availability: [{ date: '2026-02-23', slots: ['09:00 AM', '10:00 AM', '02:00 PM'] }]
  },
  {
    name: 'Bob Smith', category: 'Product Management', experience: 5, rating: 4.5,
    availability: [{ date: '2026-02-23', slots: ['10:00 AM', '11:00 AM'] }]
  }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed automatically if db is empty
    const count = await Expert.countDocuments();
    if (count === 0) {
      await Expert.insertMany(expertsData);
      console.log('MongoDB Seeded successfully');
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
