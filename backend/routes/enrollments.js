import express from 'express';
import Enrollment from '../models/Enrollment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/enroll → enroll user in a course (logged-in only)
router.post('/', protect, async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id;

        // Check if already enrolled
        const existing = await Enrollment.findOne({ userId, courseId });
        if (existing) return res.status(400).json({ message: 'Already enrolled' });

        const enrollment = new Enrollment({ userId, courseId });
        await enrollment.save();
        res.status(201).json(enrollment);
    } catch (err) {
        console.error('Error enrolling user:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/enrollments/me → get current user's enrollments
router.get('/me', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const enrollments = await Enrollment.find({ userId }).populate('courseId');
        res.json(enrollments);
    } catch (err) {
        console.error('Error fetching enrollments:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/enrollments/:id/progress → update lesson progress (logged-in only)
router.put('/:id/progress', protect, async (req, res) => {
    try {
        const enrollmentId = req.params.id;
        const { lessonId, completed } = req.body;

        // Validate request
        if (!lessonId) return res.status(400).json({ message: 'lessonId is required' });
        if (completed === undefined) return res.status(400).json({ message: 'completed must be true or false' });

        // Find enrollment
        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

        // Ensure only the owner can update progress
        if (!enrollment.userId.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not allowed' });
        }

        // Update progress map
        enrollment.progress.set(lessonId, completed);
        await enrollment.save();

        // Optionally populate course info
        await enrollment.populate('courseId');

        res.json({
            message: 'Progress updated successfully ✅',
            enrollment
        });
    } catch (err) {
        console.error('Error updating progress:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;
