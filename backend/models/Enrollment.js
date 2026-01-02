import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Map, of: Boolean, default: {} }, // lessonId → completed true/false
    enrolledAt: { type: Date, default: Date.now }
});

export default mongoose.model('Enrollment', enrollmentSchema);
