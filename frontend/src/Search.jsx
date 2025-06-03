import { useState } from 'react';
import { FiSearch, FiMapPin, FiChevronDown } from 'react-icons/fi';
import RangeSlider from './Ranger';

function SearchBar({ formData, updateFormData, updateSalaryRange }) {
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [jobTypeDropdownOpen, setJobTypeDropdownOpen] = useState(false);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Pune', 'Gurgaon', 'Noida', 'Kochi', 'Coimbatore',
  ];

  const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl h-[80px] p-6 flex items-center font-['Satoshi_Variable'] font-medium text-base leading-none text-[16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>

        {/* Search Input */}
        <div className="flex items-center gap-3 flex-1 px-4 min-w-[200px]">
          <FiSearch className="w-[18px] h-[18px] stroke-[1.5px] text-gray-500" />
          <input
            type="text"
            placeholder="Search By Job Title, Role"
            value={formData.searchQuery}
            onChange={(e) => updateFormData('searchQuery', e.target.value)}
            className="w-full outline-none font-['Satoshi_Variable'] font-medium text-base leading-none text-[16px]"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          />
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-gray-300" />

        {/* Location Dropdown */}
        <div className="relative flex items-center gap-3 flex-1 px-4 min-w-[200px] text-[16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          <FiMapPin className="w-[16px] h-[21.01px] stroke-[1.5px] text-gray-500" />
          <div
            className="flex items-center justify-between w-full cursor-pointer text-[16px]" style={{ fontFamily: "'Satoshi', sans-serif" }}
            onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
          >
            <span className={`font-['Satoshi_Variable'] font-medium text-base text-[16px] leading-none ${!formData.location && 'text-gray-500'}`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {formData.location || 'Preferred Location'}
            </span>
            <FiChevronDown className="w-[24px] h-[24px] text-gray-500 ml-2 text-[16px]" style={{ fontFamily: "'Satoshi', sans-serif" }} />
          </div>

          {locationDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10 py-2 text-[16px]">
              {locationOptions.map((option) => (
                <div
                  key={option}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-['Satoshi_Variable']" style={{ fontFamily: "'Satoshi', sans-serif" }}
                  onClick={() => {
                    updateFormData('location', option);
                    setLocationDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Divider */}
        <div className="h-10 w-px bg-gray-300" />

        {/* Job Type Dropdown */}
        <div className="relative flex items-center gap-3 flex-1 px-4 min-w-[200px]">
          <span className="w-[18.07px] h-[16px] stroke-[1.5px] text-gray-500">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 17C13 14.7909 10.3137 13 7 13C3.68629 13 1 14.7909 1 17M14.8281 3.17188C15.1996 3.54331 15.4942 3.98427 15.6952 4.46957C15.8962 4.95487 15.9999 5.47533 15.9999 6.00062C15.9999 6.52591 15.8963 7.04497 15.6953 7.53027C15.4943 8.01558 15.1996 8.45705 14.8281 8.82848M17 1C17.6566 1.65661 18.1775 2.43612 18.5328 3.29402C18.8882 4.15192 19.0718 5.07127 19.0718 5.99985C19.0718 6.92844 18.8886 7.84815 18.5332 8.70605C18.1778 9.56396 17.6566 10.3435 17 11.0001M7 10C4.79086 10 3 8.20914 3 6C3 3.79086 4.79086 2 7 2C9.20914 2 11 3.79086 11 6C11 8.20914 9.20914 10 7 10Z" stroke="#686868" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <div
            className="flex items-center justify-between w-full cursor-pointer text-[16px]"
            onClick={() => setJobTypeDropdownOpen(!jobTypeDropdownOpen)}
          >
            <span className={`font-['Satoshi_Variable'] font-medium text-base text-[16px] leading-none ${!formData.jobType && 'text-gray-500'}`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {formData.jobType || 'Job Type'}
            </span>
            <FiChevronDown className="w-[24px] h-[24px] text-gray-500 ml-2" />
          </div>

          {jobTypeDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10 py-2">
              {jobTypeOptions.map((option) => (
                <div
                  key={option}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] font-['Satoshi_Variable']" style={{ fontFamily: "'Satoshi', sans-serif" }}
                  onClick={() => {
                    updateFormData('jobType', option);
                    setJobTypeDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-gray-300" />

        {/* Salary Range Slider */}
        <div className="flex flex-col flex-1 px-4 min-w-[200px]">
          <RangeSlider
            minValue={formData.minSalary}
            maxValue={formData.maxSalary}
            updateSalaryRange={updateSalaryRange}
          />
        </div>

      </div>
    </div>
  );
}

export default SearchBar;
