const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

// @desc    Fetch all experts with pagination and filter
// @route   GET /experts
exports.getExperts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const category = req.query.category || '';

        const query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const total = await Expert.countDocuments(query);
        const experts = await Expert.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            experts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single expert
// @route   GET /experts/:id
exports.getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) return res.status(404).json({ message: 'Expert not found' });

        // In a real app we might only return available slots, but we can return all
        // and let frontend disable booked slots, or we can check bookings here.
        // Let's find pending/confirmed bookings for this expert to remove them from slots or mark them.
        const bookings = await Booking.find({ expertId: expert._id, status: { $ne: 'Completed' } });

        // We can package the response so frontend knows exactly which slots are available
        let availableDates = JSON.parse(JSON.stringify(expert.availability));
        bookings.forEach(booking => {
            const dateObj = availableDates.find(d => d.date === booking.date);
            if (dateObj) {
                // filter out booked slots
                dateObj.slots = dateObj.slots.filter(s => s !== booking.timeSlot);
            }
        });

        res.json({ expert, availableDates });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
