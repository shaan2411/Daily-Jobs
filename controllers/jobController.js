const Job = require('../models/Job');
const Application = require('../models/Application');

exports.postJob = async (req, res) => {
    try {
        if (req.session.role !== 'employer') {
            return res.status(403).json({ error: 'Only employers can post jobs' });
        }

        const { title, description, location, wage } = req.body;
        const newJob = new Job({
            title, description, location, wage, employerId: req.session.userId
        });

        await newJob.save();
        res.status(201).json({ message: 'Job posted successfully', job: newJob });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const query = { status: 'open' };
        if (req.query.location) {
            // Case-insensitive regex for location search
            query.location = { $regex: new RegExp(req.query.location, 'i') };
        }

        const jobs = await Job.find(query).populate('employerId', 'name phone').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.applyJob = async (req, res) => {
    try {
        if (req.session.role !== 'seeker') {
            return res.status(403).json({ error: 'Only job seekers can apply' });
        }

        const jobId = req.params.id;
        const existingApplication = await Application.findOne({ jobId, seekerId: req.session.userId });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        const application = new Application({
            jobId, seekerId: req.session.userId
        });

        await application.save();
        res.status(201).json({ message: 'Applied successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getEmployerJobs = async (req, res) => {
    try {
        if (req.session.role !== 'employer') return res.status(403).json({ error: 'Unauthorized' });
        const jobs = await Job.find({ employerId: req.session.userId }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getJobApplications = async (req, res) => {
    try {
        if (req.session.role !== 'employer') return res.status(403).json({ error: 'Unauthorized' });
        const jobId = req.params.id;
        const job = await Job.findOne({ _id: jobId, employerId: req.session.userId });
        if (!job) return res.status(404).json({ error: 'Job not found' })

        const applications = await Application.find({ jobId }).populate('seekerId', 'name phone email address');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getSeekerApplications = async (req, res) => {
    try {
        if (req.session.role !== 'seeker') return res.status(403).json({ error: 'Unauthorized' });
        const applications = await Application.find({ seekerId: req.session.userId }).populate('jobId');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
