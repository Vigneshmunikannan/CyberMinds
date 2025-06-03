const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    trim: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance']
  },
  minSalary: {
    type: Number,
    required: [true, 'Minimum salary is required']
  },
  maxSalary: {
    type: Number,
    required: [true, 'Maximum salary is required']
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for searching
jobSchema.index({ 
  jobTitle: 'text', 
  companyName: 'text', 
  jobDescription: 'text',
  location: 'text'
});

module.exports = mongoose.model('Job', jobSchema);