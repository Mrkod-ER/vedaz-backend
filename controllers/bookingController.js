const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const socket = require('../utils/socket');

// @desc    Create a booking
// @route   POST /bookings
exports.createBooking = async (req, res) => {
    const { expertId, date, timeSlot, notes } = req.body;

    try {
        // Basic validation
        if (!expertId || !date || !timeSlot) {
            return res.status(400).json({ message: 'All booking fields are required' });
        }

        // Verify if expert exists & slot is valid
        const expert = await Expert.findById(expertId);
        if (!expert) return res.status(404).json({ message: 'Expert not found' });

        // Validate if the date/time slot actually exists on the expert's availability
        const availableDate = expert.availability.find(d => d.date === date);
        if (!availableDate || !availableDate.slots.includes(timeSlot)) {
            return res.status(400).json({ message: 'Invalid date or time slot' });
        }

        // Attempt to create booking
        const booking = new Booking({
            expertId,
            name: req.user.name,
            email: req.user.email,
            phone: req.body.phone || 'N/A', // Assuming phone was added to booking form but not User model
            date,
            timeSlot,
            notes,
            status: 'Pending',
        });

        const createdBooking = await booking.save();

        // Emit Real-Time Socket.io event that a slot was booked
        try {
            const io = socket.getIO();
            if (io) {
                io.emit('slotBooked', { expertId, date, timeSlot, bookedByEmail: req.user.email });
            }
        } catch (e) {
            console.error('Socket error on emit', e);
        }

        res.status(201).json(createdBooking);
    } catch (error) {
        // 11000 is MongoDB duplicate key error (triggered by index on expertId, date, timeSlot)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'This slot has just been booked by someone else. Please select another slot.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get bookings by email
// @route   GET /bookings
exports.getBookings = async (req, res) => {
    try {
        const email = req.user.email;
        if (!email) {
            return res.status(400).json({ message: 'Not authenticated correctly' });
        }

        const bookings = await Booking.find({ email })
            .populate('expertId', 'name category rating')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update booking status
// @route   PATCH /bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = status;
        const updatedBooking = await booking.save();

        // Optionally emit status changed event
        try {
            const io = socket.getIO();
            if (io) {
                io.emit('bookingStatusUpdated', updatedBooking);
            }
        } catch (e) { }

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
