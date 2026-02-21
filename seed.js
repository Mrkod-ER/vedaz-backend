require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./models/Expert');
const connectDB = require('./config/db');

const experts = [
    {
        name: 'Alice Johnson',
        category: 'Software Engineering',
        experience: 8,
        rating: 4.8,
        availability: [
            { date: '2026-02-23', slots: ['09:00 AM', '10:00 AM', '02:00 PM'] },
            { date: '2026-02-24', slots: ['11:00 AM', '01:00 PM'] },
        ],
    },
    {
        name: 'Bob Smith',
        category: 'Product Management',
        experience: 5,
        rating: 4.5,
        availability: [
            { date: '2026-02-23', slots: ['10:00 AM', '11:00 AM'] },
            { date: '2026-02-25', slots: ['09:00 AM', '03:00 PM', '04:00 PM'] },
        ],
    },
    {
        name: 'Charlie Davis',
        category: 'Data Science',
        experience: 10,
        rating: 5.0,
        availability: [
            { date: '2026-02-24', slots: ['09:00 AM', '10:00 AM'] },
            { date: '2026-02-26', slots: ['01:00 PM', '02:00 PM'] },
        ],
    },
    {
        name: 'Diana Evans',
        category: 'Software Engineering',
        experience: 3,
        rating: 4.1,
        availability: [
            { date: '2026-02-23', slots: ['02:00 PM', '03:00 PM'] },
            { date: '2026-02-27', slots: ['10:00 AM'] },
        ],
    },
    {
        name: 'Ethan Foster',
        category: 'UX Design',
        experience: 6,
        rating: 4.7,
        availability: [
            { date: '2026-02-23', slots: ['11:00 AM', '12:00 PM'] },
            { date: '2026-02-24', slots: ['02:00 PM', '04:00 PM'] },
        ],
    },
];

const seedData = async () => {
    try {
        await connectDB();
        await Expert.deleteMany({});
        await Expert.insertMany(experts);
        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
