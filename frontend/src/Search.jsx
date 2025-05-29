import { useState } from 'react';
import { FiSearch, FiMapPin, FiChevronDown } from 'react-icons/fi';
import RangeSlider from './Ranger';

function SearchBar({ formData, updateFormData, updateSalaryRange }) {
    // States for dropdowns
    const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
    const [jobTypeDropdownOpen, setJobTypeDropdownOpen] = useState(false);

    // Sample options for dropdowns
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
    const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];

    return (
        <div>
            <div className="bg-white rounded-2xl p-6 flex flex-wrap items-center">
                {/* Search Input */}
                <div className="flex items-center flex-1 min-w-[200px] px-4">
                    <FiSearch className="w-[18px] h-[18px] stroke-[1.5px] text-gray-500 mr-3" />
                    <input
                        type="text"
                        placeholder="Search By Job Title, Role"
                        value={formData.searchQuery}
                        onChange={(e) => updateFormData('searchQuery', e.target.value)}
                        className="w-full outline-none font-['Satoshi_Variable'] font-medium text-base leading-none"
                    />
                </div>

                {/* Vertical Divider */}
                <div className="h-10 w-px bg-gray-300 hidden md:block"></div>

                {/* Location Dropdown */}
                <div className="relative flex items-center min-w-[180px] px-4">
                    <FiMapPin className="w-[18px] h-[18px] stroke-[1.5px] text-gray-500 mr-3" />
                    <div
                        className="flex items-center justify-between w-full cursor-pointer"
                        onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    >
                        <span className={`font-['Satoshi_Variable'] font-medium text-base leading-none ${!formData.location && 'text-gray-500'}`}>
                            {formData.location || 'Preferred Location'}
                        </span>
                        <FiChevronDown className="w-[24px] h-[24px] text-gray-500 ml-2" />
                    </div>

                    {locationDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10 py-2">
                            {locationOptions.map((option) => (
                                <div
                                    key={option}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-['Satoshi_Variable']"
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

                {/* Vertical Divider */}
                <div className="h-10 w-px bg-gray-300 hidden md:block"></div>

                {/* Job Type Dropdown */}
                <div className="relative flex items-center min-w-[180px] px-4">
                    <span className="w-[18px] h-[18px] stroke-[1.5px] text-gray-500 mr-3">
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 17C13 14.7909 10.3137 13 7 13C3.68629 13 1 14.7909 1 17M14.8281 3.17188C15.1996 3.54331 15.4942 3.98427 15.6952 4.46957C15.8962 4.95487 15.9999 5.47533 15.9999 6.00062C15.9999 6.52591 15.8963 7.04497 15.6953 7.53027C15.4943 8.01558 15.1996 8.45705 14.8281 8.82848M17 1C17.6566 1.65661 18.1775 2.43612 18.5328 3.29402C18.8882 4.15192 19.0718 5.07127 19.0718 5.99985C19.0718 6.92844 18.8886 7.84815 18.5332 8.70605C18.1778 9.56396 17.6566 10.3435 17 11.0001M7 10C4.79086 10 3 8.20914 3 6C3 3.79086 4.79086 2 7 2C9.20914 2 11 3.79086 11 6C11 8.20914 9.20914 10 7 10Z" stroke="#686868" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>

                    <div
                        className="flex items-center justify-between w-full cursor-pointer"
                        onClick={() => setJobTypeDropdownOpen(!jobTypeDropdownOpen)}
                    >
                        <span className={`font-['Satoshi_Variable'] font-medium text-base leading-none ${!formData.jobType && 'text-gray-500'}`}>
                            {formData.jobType || 'Job Type'}
                        </span>
                        <FiChevronDown className="w-[24px] h-[24px] text-gray-500 ml-2" />
                    </div>

                    {jobTypeDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10 py-2">
                            {jobTypeOptions.map((option) => (
                                <div
                                    key={option}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-['Satoshi_Variable']"
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

                {/* Vertical Divider */}
                <div className="h-10 w-px bg-gray-300 hidden md:block"></div>

                {/* Salary Range Slider */}
                <div className="flex flex-col w-full md:w-auto flex-1 min-w-[250px] px-4">
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