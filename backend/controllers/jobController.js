const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Public
exports.createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      jobTitle,
      companyName,
      location,
      jobType,
      minSalary,
      maxSalary,
      applicationDeadline,
      jobDescription
    } = req.body;

    // Validate salary range
    if (Number(minSalary) > Number(maxSalary)) {
      return res.status(400).json({
        message: 'Minimum salary cannot be greater than maximum salary'
      });
    }

    const job = new Job({
      jobTitle,
      companyName,
      location,
      jobType,
      minSalary,
      maxSalary,
      applicationDeadline,
      jobDescription
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all job postings with filtering
// @route   GET /api/jobs
// @access  Public


exports.getJobs = async (req, res) => {
  try {
    const {
      searchQuery,
      location,
      jobType,
      minSalary,
      maxSalary
    } = req.query;

    const queryObject = {};

    // Enhanced search functionality with safe regex
    if (searchQuery && searchQuery.trim() !== '') {
      try {
        // Escape regex special characters to prevent ReDoS attacks
        const escapedQuery = searchQuery.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const searchRegex = new RegExp(escapedQuery, 'i');

        // Use $or for multiple field search
        queryObject.$or = [
          { jobTitle: searchRegex },
          { companyName: searchRegex },
          { jobDescription: searchRegex }
        ];
      } catch (error) {
        console.error('Regex error:', error);
        // Fallback to partial string matching if regex fails
        const searchTerm = searchQuery.trim();
        queryObject.$or = [
          { jobTitle: { $regex: searchTerm, $options: 'i' } },
          { companyName: { $regex: searchTerm, $options: 'i' } },
          { jobDescription: { $regex: searchTerm, $options: 'i' } }
        ];
      }
    }

    // Filter by location - safe regex
    if (location && location !== '') {
      try {
        const escapedLocation = location.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        queryObject.location = new RegExp(escapedLocation, 'i');
      } catch (error) {
        console.error('Location regex error:', error);
        queryObject.location = { $regex: location, $options: 'i' };
      }
    }

    // Filter by job type
    if (jobType && jobType !== '') {
      queryObject.jobType = jobType; // Use exact match for enumerated values
    }

    // Salary range filtering
    if (minSalary || maxSalary) {
      const min = !isNaN(Number(minSalary)) && Number(minSalary) > 0 ? Number(minSalary) : 0;
      const max = !isNaN(Number(maxSalary)) && Number(maxSalary) > 0 ? Number(maxSalary) : 2900000;

      queryObject.maxSalary = {
        $gte: min,
        $lte: max
      };
    }

    console.log('Query filters:', JSON.stringify(queryObject, null, 2));

    // Get total count from database
    const totalJobs = await Job.countDocuments(queryObject);

    // Fetch the actual jobs
    const jobs = await Job.find(queryObject)
      .sort({ createdAt: -1 });

    // Current time for calculating time differences
    const now = new Date();

    // Enhance jobs with additional fields if they don't exist
    const enhancedJobs = jobs.map(job => {
      const jobObj = job.toObject ? job.toObject() : { ...job };

      // Add default experience level if not present
      if (!jobObj.experienceLevel) {
        jobObj.experienceLevel = '1-3 years';
      }

      // Add default work location if not present
      if (!jobObj.workLocation) {
        jobObj.workLocation = jobObj.location === 'Remote' ? 'remote' : 'onsite';
      }

      // Add time ago information based on createdAt
      const createdAt = new Date(jobObj.createdAt || jobObj.created || now);
      const diffInMilliseconds = now - createdAt;
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      // Create human-readable timeAgo
      let timeAgo;
      if (diffInMinutes < 1) {
        timeAgo = 'Just now';
      } else if (diffInMinutes < 60) {
        timeAgo = `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} Ago`;
      } else if (diffInHours < 24) {
        timeAgo = `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} Ago`;
      } else if (diffInDays < 7) {
        timeAgo = `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} Ago`;
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        timeAgo = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} Ago`;
      } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        timeAgo = `${months} ${months === 1 ? 'month' : 'months'} Ago`;
      } else {
        const years = Math.floor(diffInDays / 365);
        timeAgo = `${years} ${years === 1 ? 'year' : 'years'} Ago`;
      }

      jobObj.timeAgo = timeAgo;

      return jobObj;
    });
    console.log(enhancedJobs)

    res.json({
      jobs: enhancedJobs,
      totalJobs
    });
  } catch (error) {
    console.error('Error in getJobs:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


