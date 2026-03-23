const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

const { verifyToken } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

// Protected endpoints
router.use(verifyToken);
router.post('/', jobController.postJob);
router.post('/:id/apply', jobController.applyJob);

// Employer specific routes
router.get('/employer', jobController.getEmployerJobs);
router.get('/:id/applications', jobController.getJobApplications);

// Seeker specific routes
router.get('/applications', jobController.getSeekerApplications);

// Application management
router.get('/applications/employer', jobController.getEmployerApplications);
router.patch('/applications/:id/status', jobController.updateApplicationStatus);

// Job management
router.delete('/:id', jobController.deleteJob);

module.exports = router;
