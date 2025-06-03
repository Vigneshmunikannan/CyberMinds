const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Validation rules
const jobValidation = [
  body('jobTitle').notEmpty().withMessage('Job title is required'),
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('jobType').notEmpty().withMessage('Job type is required')
    .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance'])
    .withMessage('Invalid job type'),
  body('minSalary').notEmpty().withMessage('Minimum salary is required')
    .isNumeric().withMessage('Minimum salary must be a number'),
  body('maxSalary').notEmpty().withMessage('Maximum salary is required')
    .isNumeric().withMessage('Maximum salary must be a number'),
  body('applicationDeadline').notEmpty().withMessage('Application deadline is required')
    .isISO8601().withMessage('Invalid date format'),
  body('jobDescription').notEmpty().withMessage('Job description is required')
];

// Create a new job
router.post('/', jobValidation, jobController.createJob);

// Get all jobs with filtering
router.get('/', jobController.getJobs);


module.exports = router;