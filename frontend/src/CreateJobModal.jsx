import React, { useState, useEffect, useRef } from 'react';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];

const locationOptions = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Gurgaon',
  'Noida',
  'Kochi',
  'Coimbatore',
];

function CreateJobModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    jobType: '',
    minSalary: '',
    maxSalary: '',
    applicationDeadline: '',
    jobDescription: ''
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState(null); // 'success' or 'error'
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [jobTypeDropdownOpen, setJobTypeDropdownOpen] = useState(false);
  const locationDropdownRef = useRef(null);
  const jobTypeDropdownRef = useRef(null);
  const dateInputRef = useRef(null);

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };
  const handleDropdownSelection = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));

    // Explicitly close the corresponding dropdown
    if (field === 'location') {
      setLocationDropdownOpen(false);
    } else if (field === 'jobType') {
      setJobTypeDropdownOpen(false);
    }
  };
  // Load draft from localStorage on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      const draft = localStorage.getItem('jobDraft');
      if (draft) {
        setFormData(JSON.parse(draft));
      } else {
        // Reset form data if no draft
        setFormData({
          jobTitle: '',
          companyName: '',
          location: '',
          jobType: '',
          minSalary: '',
          maxSalary: '',
          applicationDeadline: '',
          jobDescription: ''
        });
      }
      setResponseMessage(null);
      setResponseType(null);
    }
  }, [isOpen]);

  // Auto-close modal after successful submission
  useEffect(() => {
    if (responseType === 'success' && responseMessage === 'Job published successfully!') {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [responseType, responseMessage, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFormData = () => {
    const {
      jobTitle,
      companyName,
      location,
      jobType,
      minSalary,
      maxSalary,
      applicationDeadline,
      jobDescription
    } = formData;

    // Check if any required field is empty
    if (
      !jobTitle?.trim() ||
      !companyName?.trim() ||
      !location?.trim() ||
      !jobType ||
      !minSalary ||
      !maxSalary ||
      !applicationDeadline ||
      !jobDescription?.trim()
    ) {
      return {
        valid: false,
        message: 'All fields are required.'
      };
    }

    // Check if min salary is less than max salary
    if (Number(minSalary) > Number(maxSalary)) {
      return {
        valid: false,
        message: 'Minimum salary cannot be greater than maximum salary.'
      };
    }

    // Check if salaries are valid numbers
    if (isNaN(Number(minSalary)) || isNaN(Number(maxSalary))) {
      return {
        valid: false,
        message: 'Salary values must be valid numbers.'
      };
    }

    // Check if salaries are positive
    if (Number(minSalary) < 0 || Number(maxSalary) < 0) {
      return {
        valid: false,
        message: 'Salary values cannot be negative.'
      };
    }

    // Validate application deadline date
    try {
      const deadlineDate = new Date(applicationDeadline);
      const currentDate = new Date();

      // Check if date is valid
      if (isNaN(deadlineDate.getTime())) {
        return {
          valid: false,
          message: 'Please enter a valid application deadline date.'
        };
      }

      // Check if date is in the past
      if (deadlineDate < currentDate) {
        return {
          valid: false,
          message: 'Application deadline cannot be in the past.'
        };
      }

      // Check if date is too far in the future (optional, e.g., 2 years max)
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);

      if (deadlineDate > twoYearsFromNow) {
        return {
          valid: false,
          message: 'Application deadline cannot be more than 2 years in the future.'
        };
      }
    } catch (error) {
      return {
        valid: false,
        message: 'Please enter a valid application deadline date.'
      };
    }

    // Check job description length (optional)
    if (jobDescription.trim().length < 50) {
      return {
        valid: false,
        message: 'Job description should be at least 50 characters long.'
      };
    }

    // All validations passed
    return {
      valid: true,
      message: ''
    };
  };

  const saveDraft = () => {
    // Only save draft if there's at least some data
    const hasAnyData = Object.values(formData).some(value => value.toString().trim() !== '');

    if (!hasAnyData) {
      setResponseMessage('Cannot save empty form as draft.');
      setResponseType('error');
      return;
    }

    localStorage.setItem('jobDraft', JSON.stringify(formData));
    setResponseMessage('Draft saved successfully!');
    setResponseType('success');

    // Clear message after 3 seconds
    setTimeout(() => {
      setResponseMessage(null);
      setResponseType(null);
      onClose();
    }, 3000);
  };

  const publishJob = async () => {
    const validation = validateFormData();

    if (!validation.valid) {
      setResponseMessage(validation.message);
      setResponseType('error');
      return;
    }

    try {
      // Get API URL from environment variables
      const API_URL = import.meta.env.VITE_API_URL;

      // Add work location and experience level to form data if not present
      const jobData = {
        ...formData
      };

      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(jobData),
        // Add credentials if your API requires authentication
        // credentials: 'include',
      });

      if (!response.ok) {
        // Try to parse error message from response
        const errorData = await response.json().catch(() => null);

        if (errorData && errorData.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();

      // If successful
      setResponseMessage('Job published successfully!');
      setResponseType('success');

      // Clear the draft from local storage
      localStorage.removeItem('jobDraft');

      // Optionally, log the created job ID for reference
      console.log('Created job with ID:', data._id);

      // Modal will auto-close after a delay
      setTimeout(() => {
        // If you have an onClose prop or similar
        if (typeof onClose === 'function') {
          onClose();
        }

        // Or if you're using a state to control modal visibility
        // setIsModalOpen(false);
      }, 2000);

    } catch (error) {
      console.error('Error publishing job:', error);
      setResponseMessage('Error publishing job: ' + error.message);
      setResponseType('error');
    }
  };


  // This function handles the overlay click properly
  const handleOverlayClick = (e) => {
    // Only close if the clicked element is the overlay itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto flex"
      style={{ backgroundColor: 'rgba(126, 126, 126, 0.75)' }}
      onClick={handleOverlayClick}
    >
      <div
        className="relative bg-white w-full max-w-3xl m-auto rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing modal
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Response message */}
        {responseMessage && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded shadow-md z-50 ${responseType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
          >
            {responseMessage}
          </div>
        )}

        <h2 className="font-semibold mb-4 text-[24px] text-center" style={{ fontFamily: "'Satoshi', sans-serif" }}>Create Job Opening</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            publishJob();
          }}
          className="space-y-4"
        >
          <div className="flex gap-x-6">

            {/* Job Title */}
            <div className="flex-1">
              <label htmlFor="jobTitle" className="block font-medium mb-1 text-left ml-1 text-[20px] text-[#222222]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Full stack, software engineer, etc."
                className="w-full border border-gray-300 rounded px-3 py-2 text-[18px] placeholder:text-[16px]"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
                required
              />

            </div>

            {/* Company Name */}
            <div className="flex-1">
              <label htmlFor="companyName" className="block font-medium mb-1 text-left ml-1 text-[20px] text-[#222222]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder='Amazon, Microsoft, Swiggy '
                className="w-full border border-gray-300 rounded px-3 py-2 text-[18px] placeholder:text-[16px]"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
                required
              />
            </div>

          </div>

          <div className="flex gap-x-6">
            {/* Location */}
            <div className="flex-1">
              <label htmlFor="location" className="block font-medium mb-1 text-left ml-1 text-[20px] text-[#222222]">
                Location
              </label>
              <div
                ref={locationDropdownRef}
                className="relative flex items-center min-w-[180px] border border-gray-300 rounded px-3 py-2"
              >
                <div
                  className="flex items-center justify-between w-full cursor-pointer"
                  onClick={() => setLocationDropdownOpen(prev => !prev)} // Toggle dropdown
                >
                  <span className={`font-medium leading-none text-[16px] ${!formData.location ? 'text-gray-500' : 'text-gray-900'}`} style={{ fontFamily: "'Satoshi', sans-serif" }} >
                    {formData.location || 'Choose Preferred Location'}
                  </span>
                  <svg
                    className="w-[24px] h-[24px] text-gray-500 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>

                {locationDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10 py-2 max-h-60 overflow-y-auto text-left">
                    {locationOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium" style={{ fontFamily: "'Satoshi', sans-serif" }}
                        onClick={() => handleDropdownSelection('location', option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Job Type Dropdown */}
            <div className="flex-1">
              <label htmlFor="jobType" className="block font-medium mb-1 text-left ml-1 text-[20px] text-[#222222]">
                Job Type
              </label>
              <div
                ref={jobTypeDropdownRef}
                className="relative flex items-center min-w-[180px] border border-gray-300 rounded px-3 py-2"
              >
                <div
                  className="flex items-center justify-between w-full cursor-pointer"
                  onClick={() => setJobTypeDropdownOpen(prev => !prev)} // Toggle dropdown
                >
                  <span className={`font-medium text-base leading-none text-[18px] ${!formData.jobType ? 'text-gray-500' : 'text-gray-900'}`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    {formData.jobType || 'Choose job type'}
                  </span>
                  <svg
                    className="w-[24px] h-[24px] text-gray-500 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>

                {jobTypeDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10 py-2 text-left">
                    {jobTypes.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium"
                        style={{ fontFamily: "'Satoshi', sans-serif" }}
                        onClick={() => handleDropdownSelection('jobType', option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-x-6">
            {/* Salary Range - Takes up half the width */}
            <div className="flex gap-x-4 w-1/2">
              <div className="flex-1">
                <label htmlFor="minSalary" className="block font-medium mb-1 text-left ml-1 text-[20px] text-[#222222]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  Salary Range
                </label>
                <div className="relative">

                  <input
                    type="number"
                    id="minSalary"
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleChange}
                    placeholder="₹0"
                    className="w-full border border-gray-300 rounded px-8 py-2 appearance-none text-[18px] placeholder:text-[16px]"
                    min="0"

                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                    required
                  />

                  <div className="pointer-events-none absolute inset-y-0 ml-2 flex items-center text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 12L4 15M4 15L1 12M4 15V1M9 4L12 1M12 1L15 4M12 1V15" stroke="#BCBCBC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                  </div>
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="maxSalary" className="block font-medium mb-1 text-white text-[20px]">
                  .
                </label>
                <div className="relative flex items-center border border-gray-300 rounded">
                  {/* SVG icon container - fixed at the left */}
                  <div className="pointer-events-none pl-3 pr-1 flex items-center text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 12L4 15M4 15L1 12M4 15V1M9 4L12 1M12 1L15 4M12 1V15" stroke="#BCBCBC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Input field - takes remaining space */}
                  <input
                    type="number"
                    id="maxSalary"
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                    placeholder="₹12,00,000"
                    className="w-full py-2 pl-1 pr-3 appearance-none text-left outline-none border-0 text-[18px] placeholder:text-[16px]"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Application Deadline - Takes up half the width */}
            <div className="w-1/2">
              <label
                htmlFor="applicationDeadline"
                className="block font-medium mb-1 text-left text-[20px] text-[#222222]"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Application Deadline
              </label>
              <div className="relative">
                {/* Transparent real input */}
                <input
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className={`w-full border border-gray-300 rounded px-3 py-2 pr-10 appearance-none text-[18px] placeholder:text-[16px] 
        ${!formData.applicationDeadline ? 'text-transparent' : 'text-black'}`}
                  required
                  ref={dateInputRef}
                />

                {/* Custom placeholder overlay */}
                {!formData.applicationDeadline && (
                  <span
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1a1] text-[16px] pointer-events-none"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    
                  </span>
                )}

                {/* Calendar icon */}
                <div
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
                  onClick={openDatePicker}
                >
                  <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 7H17M1 7V15.8002C1 16.9203 1 17.4801 1.21799 17.9079C1.40973 18.2842 1.71547 18.5905 2.0918 18.7822C2.5192 19 3.07899 19 4.19691 19H13.8031C14.921 19 15.48 19 15.9074 18.7822C16.2837 18.5905 16.5905 18.2842 16.7822 17.9079C17 17.4805 17 16.9215 17 15.8036V7M1 7V6.2002C1 5.08009 1 4.51962 1.21799 4.0918C1.40973 3.71547 1.71547 3.40973 2.0918 3.21799C2.51962 3 3.08009 3 4.2002 3H5M17 7V6.19691C17 5.07899 17 4.5192 16.7822 4.0918C16.5905 3.71547 16.2837 3.40973 15.9074 3.21799C15.4796 3 14.9203 3 13.8002 3H13M13 1V3M13 3H5M5 1V3"
                      stroke="#BCBCBC"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Hide default date UI styles */}
              <style jsx>{`
    input[type='date']::-webkit-calendar-picker-indicator {
      opacity: 0;
      display: none;
    }

    input[type='date']::-webkit-inner-spin-button,
    input[type='date']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type='date'] {
      -moz-appearance: textfield;
    }
  `}</style>
            </div>

          </div>

          {/* Job Description */}
          <div className="mt-4">
            <label htmlFor="jobDescription" className="block font-medium mb-1 text-left ml-1 text-[20px] text-[#222222]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              Job Description
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-[18px] placeholder:text-[16px]"
              placeholder='Please share a description to let the candidate know more about the job role'
              rows={4}
              required
              style={{ fontFamily: "'Satoshi', sans-serif" }}

            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={saveDraft}
              className="flex items-center space-x-2 text-black-700 font-semibold transition-colors border-2 px-6 py-[16px] rounded-[10px]"
            >
              <span>Save Draft</span>
              <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 7.5L5 11.5L1 7.5M9 1.5L5 5.5L1 1.5" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </button>

            <button
              type="submit"
              className="flex items-center space-x-2 bg-[#00AAFF] text-white font-semibold px-6 py-[16px] rounded-[16px]"
            >
              <span>Publish</span>
              <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1.5L11 5.5L7 9.5M1 1.5L5 5.5L1 9.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobModal;