const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dailyjobs";

// Middleware
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const authMiddleware = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');
const jobController = require('./controllers/jobController');
const notificationController = require('./controllers/notificationController');

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// HTML Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/index", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/jobs", (req, res) => res.sendFile(path.join(__dirname, "public", "jobs.html")));
app.get("/find-jobs", (req, res) => res.sendFile(path.join(__dirname, "public", "jobs.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));
app.get("/employer", (req, res) => res.sendFile(path.join(__dirname, "public", "employer.html")));
app.get("/profile", (req, res) => res.sendFile(path.join(__dirname, "public", "profile.html")));
app.get("/notifications", (req, res) => res.sendFile(path.join(__dirname, "public", "notifications.html")));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get("/api/notification/:userId", async (req, res) => {
  const Notification = require('./models/Notification');
  const notifs = await Notification.find({ recipient: req.params.userId }).sort({ createdAt: -1 });
  res.json(notifs);
});
// API Routes are handled by app.use routers below

app.post("/api/apply", async (req, res) => {
  const Application = require('./models/Application');
  const Job = require('./models/Job');
  const { jobId, userId } = req.body;

  try {
    const User = require('./models/User');
    const user = await User.findById(userId);
    
    if (user && user.role !== 'seeker') {
      return res.status(403).json({ error: "Only job seekers can apply for jobs." });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID" });
    }

    const application = new Application({ 
      jobId, 
      userId: userId, // Keep string for compatibility
      seekerId: mongoose.Types.ObjectId.isValid(userId) ? userId : null 
    });
    
    await application.save();

    // Notify Employer
    try {
      const Notification = require('./models/Notification');
      const job = await Job.findById(jobId);
      if (job) {
        const User = require('./models/User');
        const seeker = await User.findById(userId);
        const seekerName = seeker ? seeker.name : "A seeker";
        const seekerPhone = seeker ? seeker.phone : "N/A";
        const seekerEmail = seeker ? seeker.email : "N/A";
        
        const notification = new Notification({
          recipient: job.employerId,
          sender: mongoose.Types.ObjectId.isValid(userId) ? userId : job.employerId,
          job: jobId,
          message: `New Application: ${seekerName} (Phone: ${seekerPhone}, Email: ${seekerEmail}) applied for "${job.title}"`
        });
        await notification.save();
      }
    } catch (notifErr) { console.error("Notification failed", notifErr); }

    res.json({ message: "Applied successfully" });
  } catch (err) { 
    console.error("Apply Error:", err);
    res.status(500).json({ error: "Apply failed" }); 
  }
});

app.post("/api/accept", async (req, res) => {
  const Application = require('./models/Application');
  const Notification = require('./models/Notification');
  const Job = require('./models/Job');
  const { appId, userId } = req.body; // userId is employer ID
  
  try {
    const application = await Application.findByIdAndUpdate(appId, { status: 'approved' }, { new: true }).populate('jobId');
    if (!application) return res.status(404).json({ error: "Application not found" });
    
    // Notify seeker
    const notification = new Notification({
      recipient: application.seekerId || application.userId, // fallback to userId if seekerId missing
      sender: userId,
      job: application.jobId._id,
      message: `Congratulations! Your application for "${application.jobId.title}" has been ACCEPTED. Contact the employer for next steps.`
    });
    await notification.save();
    
    res.json({ message: "Application accepted and seeker notified" });
  } catch (err) { 
    console.error("Accept Error:", err);
    res.status(500).json({ error: "Accept failed" }); 
  }
});

app.get("/api/dashboard/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const Application = require('./models/Application');
    const Job = require('./models/Job');
    const Notification = require('./models/Notification');
    
    // Total jobs in system
    const jobsCount = await Job.countDocuments();
    
    // User-specific stats
    let appliedCount = 0;
    let notifCount = 0;
    
    if (mongoose.Types.ObjectId.isValid(userId)) {
      appliedCount = await Application.countDocuments({ $or: [{ userId: userId }, { seekerId: userId }] });
      notifCount = await Notification.countDocuments({ recipient: userId, isRead: false });
    } else {
      // If simple string ID (from previous turn)
      appliedCount = await Application.countDocuments({ userId: userId });
    }

    res.json({
      applied: appliedCount,
      jobs: jobsCount,
      notifications: notifCount
    });
  } catch (err) { 
    console.error('Dashboard Error:', err);
    res.status(500).json({ error: "Error" }); 
  }
});

app.get("/api/notification/:userId", async (req, res) => {
  const Notification = require('./models/Notification');
  const notifs = await Notification.find({ recipient: req.params.userId }).sort({ createdAt: -1 });
  res.json(notifs);
});

app.patch("/api/notification/:id/read", async (req, res) => {
  const Notification = require('./models/Notification');
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

app.get("/api/user/:id", authMiddleware.verifyToken, authController.getUserById);
app.get("/api/applications/:userId", async (req, res) => {
  const Application = require('./models/Application');
  const apps = await Application.find({ userId: req.params.userId })
    .populate({
        path: 'jobId',
        populate: { path: 'employerId', select: 'name phone email' }
    });
  res.json(apps);
});

// Use legacy routers
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

// Handle local development
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
