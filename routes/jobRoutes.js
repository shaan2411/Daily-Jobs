const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/', jobController.postJob);
router.get('/', jobController.getJobs);
router.post('/:id/apply', jobController.applyJob);

// Employer specific routes
router.get('/employer', jobController.getEmployerJobs);
router.get('/:id/applications', jobController.getJobApplications);

// Seeker specific routes
router.get('/applications', jobController.getSeekerApplications);

module.exports = router;
