const Job = require('../models/Job');
const Application = require('../models/Application');
const mongoose = require('mongoose');

exports.postJob = async (req, res) => {
    try {
        if (req.user?.role !== 'employer') return res.status(403).json({ error: 'Only employers can post jobs' });
        
        const { title, description, wage, address, city, state, pincode, lat, lng } = req.body;
        
        const job = new Job({
            title,
            description,
            wage,
            address,
            city,
            state,
            pincode,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0]
            },
            employerId: req.user.userId
        });

        await job.save();
        res.status(201).json({ message: 'Job posted successfully', job });
    } catch (error) {
        console.error("PostJob Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getJobs = async (req, res) => {
    const { lat, lng, radius = 10, category } = req.query;
    try {
        let query = { status: 'open' };
        if (category) query.category = category;

        if (lat && lng) {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            const radiusInMeters = parseFloat(radius) * 1000;

            if (!isNaN(latitude) && !isNaN(longitude)) {

            const jobs = await Job.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [longitude, latitude] },
                        distanceField: "distance_m",
                        maxDistance: radiusInMeters,
                        query: query,
                        spherical: true
                    }
                },
                {
                    $addFields: {
                        distance_km: { $round: [{ $divide: ["$distance_m", 1000] }, 1] }
                    }
                },
                { $sort: { distance_m: 1 } }
            ]);
            return res.json({ jobs, total: jobs.length });
          }
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json({ jobs, total: jobs.length });
    } catch (error) {
        console.error("GetJobs Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employerId', 'name phone');
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.applyJob = async (req, res) => {
    try {
        if (req.user?.role !== 'seeker') {
            return res.status(403).json({ error: 'Only job seekers can apply' });
        }

        const jobId = req.params.id;
        const existingApplication = await Application.findOne({ jobId, seekerId: req.user?.userId });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }
        const application = new Application({ jobId, seekerId: req.user?.userId });
        await application.save();

        // Create Notification for the employer
        try {
            const Notification = require('../models/Notification');
            const job = await Job.findById(jobId);
            if (job) {
                const seeker = await mongoose.model('User').findById(req.user?.userId);
                const notification = new Notification({
                    recipient: job.employerId,
                    sender: req.user?.userId,
                    job: jobId,
                    message: `${seeker.name} has applied for your job: ${job.title}`
                });
                await notification.save();
            }
        } catch (notifErr) {
            console.error('Failed to create notification:', notifErr);
            // Don't fail the application if notification fails
        }

        res.status(201).json({ message: 'Applied successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getEmployerJobs = async (req, res) => {
    try {
        if (req.user?.role !== 'employer') return res.status(403).json({ error: 'Unauthorized' });
        const jobs = await Job.find({ employerId: req.user?.userId }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getJobApplications = async (req, res) => {
    try {
        if (req.user?.role !== 'employer') return res.status(403).json({ error: 'Unauthorized' });
        const jobId = req.params.id;
        const job = await Job.findOne({ _id: jobId, employerId: req.user?.userId });
        if (!job) return res.status(404).json({ error: 'Job not found' })

        const applications = await Application.find({ jobId }).populate('seekerId', 'name phone email address');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getSeekerApplications = async (req, res) => {
    try {
        if (req.user?.role !== 'seeker') return res.status(403).json({ error: 'Unauthorized' });
        const applications = await Application.find({ seekerId: req.user?.userId })
            .populate({
                path: 'jobId',
                populate: { path: 'employerId', select: 'name phone email' }
            });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.updateApplicationStatus = async (req, res) => {
    try {
        if (req.user?.role !== 'employer') return res.status(403).json({ error: 'Unauthorized' });
        const { status } = req.body; // 'approved' or 'rejected'
        const application = await Application.findById(req.params.id).populate('jobId');
        
        if (!application || application.jobId.employerId.toString() !== req.user?.userId) {
            return res.status(404).json({ error: 'Application not found' });
        }

        application.status = status;
        await application.save();

        // Notify seeker
        try {
            const Notification = require('../models/Notification');
            const notification = new Notification({
                recipient: application.seekerId,
                sender: req.user?.userId,
                job: application.jobId._id,
                message: `Your application for "${application.jobId.title}" has been ${status}.`
            });
            await notification.save();
        } catch (nErr) {}

        res.json({ message: `Application ${status}`, application });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.deleteJob = async (req, res) => {
    try {
        if (req.user?.role !== 'employer') return res.status(403).json({ error: 'Unauthorized' });
        const result = await Job.findOneAndDelete({ _id: req.params.id, employerId: req.user?.userId });
        if (!result) return res.status(404).json({ error: 'Job not found' });
        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getEmployerApplications = async (req, res) => {
    try {
        if (req.user?.role !== 'employer') return res.status(403).json({ error: 'Unauthorized' });
        const employerJobs = await Job.find({ employerId: req.user?.userId }).select('_id');
        const jobIds = employerJobs.map(j => j._id);
        
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('jobId', 'title')
            .populate('seekerId', 'name email phone')
            .sort({ appliedAt: -1 });
            
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getApplicationsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const applications = await Application.find({ seekerId: userId }).populate('jobId');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
