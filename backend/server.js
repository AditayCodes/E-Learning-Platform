import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';      // ✅ Auth routes
import courseRoutes from './routes/courses.js'; // ✅ Course routes
import enrollmentRoutes from './routes/enrollments.js'; // ✅ Enrollment routes

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);          // Auth endpoints (signup, login, me)
app.use('/api/courses', courseRoutes);    // Course endpoints (CRUD operations)
app.use('/api/enrollments', enrollmentRoutes); // Enrollment endpoints (enroll, progress, list)

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
