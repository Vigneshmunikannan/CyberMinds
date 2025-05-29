import React, { useState } from 'react';

function RangeSlider({ minValue, maxValue, updateSalaryRange }) {
     // Constants
  const MIN = 0;
  const MAX = 3000000;
  const PRICE_GAP = 10000;

  // Handle min range change
  const handleMinRangeChange = (e) => {
    let newMinValue = parseInt(e.target.value);
    let diff = maxValue - newMinValue;

    // Check if the price gap is maintained
    if (diff < PRICE_GAP) {
      newMinValue = maxValue - PRICE_GAP;
    }

    updateSalaryRange(newMinValue, maxValue);
  };

  // Handle max range change
  const handleMaxRangeChange = (e) => {
    let newMaxValue = parseInt(e.target.value);
    let diff = newMaxValue - minValue;

    // Check if the price gap is maintained
    if (diff < PRICE_GAP) {
      newMaxValue = minValue + PRICE_GAP;
    }

    updateSalaryRange(minValue, newMaxValue);
  };

  // Calculate percentages for slider positioning
  const minPercent = (minValue / MAX) * 100;
  const maxPercent = (maxValue / MAX) * 100;

  // Format the values as currency
  const formatCurrency = (value) => {
    // For values 1 lakh and above
    if (value >= 100000) {
      const inLakhs = value / 100000;
      return `₹${inLakhs.toFixed(inLakhs % 1 === 0 ? 0 : 1)}L`;
    }
    // For values 1 thousand and above
    else if (value >= 1000) {
      const inThousands = value / 1000;
      return `₹${inThousands.toFixed(inThousands % 1 === 0 ? 0 : 1)}K`;
    }
    // For values less than 1 thousand
    else {
      return `₹${value}`;
    }
  };


    return (
        <div className="slider-container">
            <div className='flex justify-between items-center w-full mb-3'>
                <div className='font-bold text-gray-800'>
                    Salary Per Month
                </div>
                <div className='font-bold'>
                    <span>{formatCurrency(minValue)}</span> - <span>{formatCurrency(maxValue)}</span>
                </div>
            </div>

            {/* Slider */}
            <div className="slider">
                {/* This is the color track between the two sliders */}
                <div
                    className="price-slider"
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`
                    }}
                ></div>
            </div>

            {/* Range Input */}
            <div className="range-input mt-4">
                <input
                    type="range"
                    className="min-range"
                    min={MIN}
                    max={MAX}
                    value={minValue}
                    onChange={handleMinRangeChange}
                    step="10000"
                />
                <input
                    type="range"
                    className="max-range"
                    min={MIN}
                    max={MAX}
                    value={maxValue}
                    onChange={handleMaxRangeChange}
                    step="10000"
                />
            </div>

            <style jsx="true">{`
        .slider-container {
          width: 100%;
          padding: 20px 0;
        }
        
        .range-values {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
          color: #333;
        }
        
        .slider {
          width: 100%;
          height: 6px;
          position: relative;
          background: #e4e4e4;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        
        .slider .price-slider {
          height: 100%;
          position: absolute;
          border-radius: 5px;
          background: rgb(0, 16, 1);
        }
        
        .range-input {
          position: relative;
          height: 30px;
        }
        
        .range-input input {
          position: absolute;
          width: 100%;
          height: 6px;
          top: -6px;
          background: transparent;
          pointer-events: none;
          -webkit-appearance: none;
          cursor: pointer;
        }
        
        /* Styles for the range thumb in WebKit browsers */
        input[type="range"]::-webkit-slider-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #fff;
          margin-left:-175px;
          box-shadow: 0 0 0 5.5px #000 inset;
          pointer-events: auto;
          -webkit-appearance: none;
          margin-top: -6px;
        }
        
        /* Styles for Firefox */
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 5.5px #000 inset;
          pointer-events: auto;
          border: none;
        }
        
        /* Range track styles */
        input[type="range"]::-webkit-slider-runnable-track {
          height: 6px;
          background: transparent;
          border: none;
        }
        
        input[type="range"]::-moz-range-track {
          height: 6px;
          background: transparent;
          border: none;
        }
        
        /* Fix z-index for min and max range inputs */
        input.min-range {
          z-index: 5;
        }
        
        input.max-range {
          z-index: 4;
        }
        
        input.min-range::-webkit-slider-thumb {
          z-index: 6;
        }
        
        input.max-range::-webkit-slider-thumb {
          z-index: 5;
        }
      `}</style>
        </div>
    );
}

export default RangeSlider;