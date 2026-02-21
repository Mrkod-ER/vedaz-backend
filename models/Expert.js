const mongoose = require('mongoose');

const expertSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        experience: { type: Number, required: true }, // years of experience
        rating: { type: Number, required: true }, // 1 to 5
        // Example: [{ date: '2026-02-23', slots: ['10:00 AM', '11:00 AM'] }]
        availability: [
            {
                date: { type: String, required: true },
                slots: [{ type: String, required: true }],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Expert = mongoose.model('Expert', expertSchema);

module.exports = Expert;
