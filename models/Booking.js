const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        expertId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Expert',
        },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        date: { type: String, required: true },
        timeSlot: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Confirmed', 'Completed'],
            default: 'Pending',
        },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

// CRITICAL: Prevent double booking at the database level using a compound unique index!
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
