import { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.png';
import SearchBar from './Search';
import CreateJobModal from './CreateJobModal';

function App() {
  // Centralized state for all form data
  const [formData, setFormData] = useState({
    searchQuery: '',
    location: '',
    jobType: '',
    minSalary: 0,
    maxSalary: 2900000
  });

  // State to track if user has interacted with the form
  const [hasInteracted, setHasInteracted] = useState(false);
  const [totalJobs, settotalJobs] = useState(0);
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to store job listings
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to update form data from child components
  const updateFormData = (key, value) => {
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [key]: value
      };

      console.log(`Form data updated - ${key}: ${value}`);

      // Trigger immediate search with the updated form data
      fetchJobs(newData);

      return newData;
    });

    // Mark that user has interacted with the form
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  // Function to update multiple fields at once (for salary range)
  const updateSalaryRange = (min, max) => {
    setFormData(prevData => {
      const newData = {
        ...prevData,
        minSalary: min,
        maxSalary: max
      };

      console.log(`Salary range updated - Min: ${min}, Max: ${max}`);

      // Trigger immediate search with the updated salary range
      fetchJobs(newData);

      return newData;
    });

    // Mark that user has interacted with the form
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  // Function to fetch jobs from backend
  const fetchJobs = async (data) => {
    setIsLoading(true);
    setError(null);

    console.log('Fetching jobs with filters:', data);

    try {
      // Build query parameters from form data
      const queryParams = new URLSearchParams();

      if (data.searchQuery) queryParams.append('searchQuery', data.searchQuery);
      if (data.location) queryParams.append('location', data.location);
      if (data.jobType) queryParams.append('jobType', data.jobType);
      if (data.minSalary && data.minSalary > 0) queryParams.append('minSalary', data.minSalary);
      if (data.maxSalary && data.maxSalary > 0) queryParams.append('maxSalary', data.maxSalary);

      // Get API URL from environment variable
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const url = `${API_URL}/jobs?${queryParams.toString()}`;
      console.log('Fetching from URL:', url);

      // Make the actual API call
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Server responded with status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Jobs fetched successfully:', responseData);

      // Set jobs from the response
      setJobs(responseData.jobs || []);
      settotalJobs(responseData.totalJobs);

    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch jobs on component mount
  useEffect(() => {
    console.log('Component mounted - fetching initial jobs');
    fetchJobs(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form submission (for explicit submit button)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted manually');
    fetchJobs(formData);
  };

  // Handle filter clearing
  const clearFilters = () => {
    const clearedFormData = {
      searchQuery: '',
      location: '',
      jobType: '',
      minSalary: 0,
      maxSalary: 800000
    };

    setFormData(clearedFormData);
    setHasInteracted(true);
    fetchJobs(clearedFormData);
    console.log('Filters cleared');
  };

  // Get company logo based on company name
  const getCompanyLogo = (companyName) => {
    const logos = {
      // Tech Giants
      'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png',
      'Tesla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/600px-Tesla_logo.png',
      'Orange Inc': 'https://cdn-icons-png.flaticon.com/512/1179/1179120.png',
      'Google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png',
      'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
      'Apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png',
      'Meta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1280px-Meta_Platforms_Inc._logo.svg.png',
      'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png',

      // Indian Tech Companies
      'Infosys': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/2560px-Infosys_logo.svg.png',
      'TCS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/2560px-Tata_Consultancy_Services_Logo.svg.png',
      'Wipro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/2560px-Wipro_Primary_Logo_Color_RGB.svg.png',
      'Tech Mahindra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tech_Mahindra_Logo.svg/2560px-Tech_Mahindra_Logo.svg.png',
      'HCL Technologies': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/HCL_Technologies_logo.svg/2560px-HCL_Technologies_logo.svg.png',
      'Zomato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Zomato_logo.png/600px-Zomato_logo.png',
      'Swiggy': 'https://logos-world.net/wp-content/uploads/2020/11/Swiggy-Logo.png',
      'Flipkart': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flipkart_icon.png/640px-Flipkart_icon.png',

      // Global Corporations
      'IBM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png',
      'Oracle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/2560px-Oracle_logo.svg.png',
      'Intel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/2560px-Intel_logo_%282006-2020%29.svg.png',
      'Dell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dell_logo_2016.svg/2048px-Dell_logo_2016.svg.png',
      'HP': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/2048px-HP_logo_2012.svg.png',
      'Cisco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/2560px-Cisco_logo_blue_2016.svg.png',
      'Adobe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Adobe_Systems_logo_and_wordmark.svg/2560px-Adobe_Systems_logo_and_wordmark.svg.png',

      // Financial Services
      'JP Morgan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/JPMorgan_Chase_Logo_2008.svg/2560px-JPMorgan_Chase_Logo_2008.svg.png',
      'Goldman Sachs': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Goldman_Sachs.svg/1200px-Goldman_Sachs.svg.png',
      'Morgan Stanley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Morgan_Stanley_Logo.svg/2560px-Morgan_Stanley_Logo.svg.png',
      'HDFC Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/2560px-HDFC_Bank_Logo.svg.png',
      'ICICI Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/ICICI_Bank_Logo.svg/2560px-ICICI_Bank_Logo.svg.png',

      // Consulting
      'Deloitte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte.svg/2560px-Deloitte.svg.png',
      'PwC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/PricewaterhouseCoopers_Logo.svg/2560px-PricewaterhouseCoopers_Logo.svg.png',
      'KPMG': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/KPMG_logo.svg/2560px-KPMG_logo.svg.png',
      'EY': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/EY_logo_2019.svg/2560px-EY_logo_2019.svg.png',
      'Accenture': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/2560px-Accenture.svg.png',
      'McKinsey': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/McKinsey_Logo.svg/2560px-McKinsey_Logo.svg.png',
      'BCG': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Boston_Consulting_Group_logo.svg/2560px-Boston_Consulting_Group_logo.svg.png',

      // E-commerce and Retail
      'Walmart': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/2560px-Walmart_logo.svg.png',
      'Target': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Target_Corporation_logo.svg/2560px-Target_Corporation_logo.svg.png',
      'Myntra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Myntra_logo.png/2560px-Myntra_logo.png',
      'Shopify': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png',

      // Startups and Others
      'Razorpay': 'https://razorpay.com/assets/razorpay-logo.svg',
      'BYJU\'S': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Byjus_logo.svg/2560px-Byjus_logo.svg.png',
      'Ola': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/OLA_Cabs_logo.svg/2560px-OLA_Cabs_logo.svg.png',
      'Paytm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png',
      'Zerodha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Zerodha_Logo.svg/2560px-Zerodha_Logo.svg.png',
      'Cred': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Cred_logo.svg/2560px-Cred_logo.svg.png',
      'Upgrad': 'https://cdn.iconscout.com/icon/free/png-256/free-upgrad-3445383-2878458.png',
      'Naukri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Naukri_Logo.svg/2560px-Naukri_Logo.svg.png'
    };

    // Add more companies or use a default
    return logos[companyName] || `https://via.placeholder.com/30?text=${companyName?.[0]?.toUpperCase() || 'C'}`;
  };

  return (
    <div className='w-full'>
      <nav className="relative w-[890px] h-[80px] mx-auto mt-[21px] rounded-[122px] bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] flex items-center justify-between px-6">
        <div className="flex items-center gap-[11.14px] w-[146px] h-[48px] rounded-[12px] p-[5px]">
          <img src={logo} alt="Logo" className="h-[44px] w-[44px]" />
        </div>

        <ul className="w-[838px] h-[48px] flex items-center justify-center ml-[-50px] space-x-8 text-[
16px]"  style={{ fontFamily: "'Satoshi', sans-serif" }}>
          <li className="cursor-pointer text-[#303030] font-medium text-[
16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>Home</li>
          <li className="cursor-pointer text-[#303030] font-medium text-[
16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>Find Jobs</li>
          <li className="cursor-pointer text-[#303030] font-medium text-[
16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>Find Talents</li>
          <li className="cursor-pointer text-[#303030] font-medium text-[
16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>About Us</li>
          <li className="cursor-pointer text-[#303030] font-medium text-[
16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>Testimonials</li>
        </ul>

        <button
          style={{
            background: 'linear-gradient(180deg, #A128FF 0%, #6100AD 113.79%)',
          }}
          className="text-white px-5 py-2 rounded-2xl whitespace-nowrap text-center font-medium cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          Create Jobs
        </button>

      </nav>

      <form onSubmit={handleSubmit} className="w-full mt-6 mb-8">
        <SearchBar
          formData={formData}
          updateFormData={updateFormData}
          updateSalaryRange={updateSalaryRange}
        />
      </form>

      <div className="w-full p-10">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8618DD] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchJobs(formData)}
              className="mt-4 bg-[#8618DD] text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : totalJobs === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No jobs found in the database.</p>
          </div>
        ) : jobs.length === 0 && totalJobs > 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No jobs found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-[#8618DD] text-white px-4 py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Job Cards Grid - Responsive grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {jobs.map(job => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Time Ago Badge */}
                  <div className="flex justify-between items-start mb-4">
                    {/* Company Logo with Shadow */}
                    <div
                      className="w-[83.46px] h-[82px] rounded-[13.18px] border border-white bg-gradient-to-b from-[#FEFEFD] to-[#F1F1F1] shadow-[0px_0px_10.25px_0px_rgba(148,148,148,0.25)] flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={getCompanyLogo(job.companyName)}
                        alt={job.companyName}
                        className="object-contain rounded-full w-[65.89px] h-[65.89px]"
                      />
                    </div>


                    <span className="bg-[#B0D9FF] text-[#000000] text-[14px] font-medium px-2.5 py-1 rounded-xl h-[38px] pt-[7.5px]">
                      {job.timeAgo || '24h Ago'}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-left text-[20px]">{job.jobTitle}</h3>

                  {/* Job Details - Combined in one single line with flex-nowrap */}
                  <div className="flex items-center flex-wrap text-sm text-gray-600 mb-3">
                    <div className="flex items-center mr-2">
                      <svg width="17.1" height="13.5" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 flex-shrink-0">
                        <path d="M11.7 14.75C11.7 12.7618 9.28233 11.15 6.29999 11.15C3.31766 11.15 0.899994 12.7618 0.899994 14.75M15.3 12.05V9.35M15.3 9.35V6.65M15.3 9.35H12.6M15.3 9.35H18M6.29999 8.45C4.31177 8.45 2.69999 6.83822 2.69999 4.85C2.69999 2.86177 4.31177 1.25 6.29999 1.25C8.28822 1.25 9.89999 2.86177 9.89999 4.85C9.89999 6.83822 8.28822 8.45 6.29999 8.45Z" stroke="#5A5A5A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span className="whitespace-nowrap text-[16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>{job.experienceLevel || '1-3 yr Exp'}</span>
                    </div>

                    <div className="flex items-center">
                      <svg width="19" height="16.41" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 flex-shrink-0">
                        <path d="M1.76364 16.3408H3.49091M3.49091 16.3408H12.1273M3.49091 16.3408V4.42274C3.49091 3.45538 3.49091 2.97133 3.67918 2.60185C3.84478 2.27684 4.10882 2.0128 4.43383 1.8472C4.80331 1.65894 5.28736 1.65894 6.25472 1.65894H9.36381C10.3312 1.65894 10.8142 1.65894 11.1837 1.8472C11.5087 2.0128 11.7736 2.27684 11.9392 2.60185C12.1273 2.97097 12.1273 3.45443 12.1273 4.4199V9.43166M12.1273 16.3408H17.3091M12.1273 16.3408V9.43166M17.3091 16.3408H19.0364M17.3091 16.3408V9.43166C17.3091 8.62686 17.309 8.22465 17.1775 7.90723C17.0022 7.484 16.6663 7.14754 16.243 6.97223C15.9256 6.84075 15.5228 6.84075 14.718 6.84075C13.9132 6.84075 13.5108 6.84075 13.1933 6.97223C12.7701 7.14754 12.4341 7.484 12.2588 7.90723C12.1273 8.22465 12.1273 8.62685 12.1273 9.43166M6.08182 7.70439H9.53637M6.08182 5.11348H9.53637" stroke="#5A5A5A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span className="whitespace-nowrap text-[16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>{job.location}</span>
                    </div>

                    <div className="flex items-center ml-2">
                      <svg width="18" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 flex-shrink-0">
                        <path d="M18.1728 10.0001L9.99096 15.4546L1.80914 10.0001M18.1728 13.6365L9.99096 19.091L1.80914 13.6365M18.1728 6.36373L9.99096 11.8183L1.80914 6.36373L9.99096 0.90918L18.1728 6.36373Z" stroke="#5A5A5A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span className="whitespace-nowrap text-[16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>₹{(job.maxSalary / 100000).toFixed(0)} LPA</span>
                    </div>


                  </div>

                  {/* Job Description as Bulletin Points when periods are present - with flex-grow for equal height */}
                  <div className="text-[#555555] text-[14px] mb-4 flex-grow" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    {job.jobDescription && job.jobDescription.includes('.') ? (
                      <ul className="list-disc pl-4 space-y-1 text-justify">
                        {job.jobDescription
                          .split('.')
                          .filter(sentence => sentence.trim().length > 0)
                          .slice(0, 3)
                          .map((sentence, index) => (
                            <li key={index}>{sentence.trim()}</li>
                          ))}
                        {job.jobDescription.split('.').filter(s => s.trim().length > 0).length > 3 && (
                          <></>
                        )}
                      </ul>
                    ) : (
                      <p>
                        {job.jobDescription && job.jobDescription.length > 120
                          ? job.jobDescription.substring(0, 120) + '...'
                          : job.jobDescription}
                      </p>
                    )}
                  </div>

                  {/* Apply Button - at the bottom of the card due to flex-grow above */}
                  <button className=" text-[16px] w-full bg-[#00aaff] text-white py-2 rounded-md transition-colors mt-auto" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <CreateJobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onJobCreated={() => {
            fetchJobs(formData);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default App;