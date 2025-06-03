import React, { useState, useEffect } from 'react';

function RangeSlider({ minValue, maxValue, updateSalaryRange }) {
  const MIN = 0;
  const MAX = 3000000;
  const PRICE_GAP = 10000;

  // Local states to hold temporary slider values
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  // Debounce update to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      updateSalaryRange(localMin, localMax);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(handler);
  }, [localMin, localMax]);

  const handleMinRangeChange = (e) => {
    let newMin = parseInt(e.target.value);
    let diff = localMax - newMin;

    if (diff < PRICE_GAP) {
      newMin = localMax - PRICE_GAP;
    }

    setLocalMin(newMin);
  };

  const handleMaxRangeChange = (e) => {
    let newMax = parseInt(e.target.value);
    let diff = newMax - localMin;

    if (diff < PRICE_GAP) {
      newMax = localMin + PRICE_GAP;
    }

    setLocalMax(newMax);
  };

  const minPercent = (localMin / MAX) * 100;
  const maxPercent = (localMax / MAX) * 100;

  const formatCurrency = (value) => {
    if (value >= 100000) {
      const inLakhs = value / 100000;
      return `₹${inLakhs.toFixed(inLakhs % 1 === 0 ? 0 : 1)}L`;
    } else if (value >= 1000) {
      const inThousands = value / 1000;
      return `₹${inThousands.toFixed(inThousands % 1 === 0 ? 0 : 1)}K`;
    } else {
      return `₹${value}`;
    }
  };

  return (
    <div className="slider-container" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <div className="flex justify-between items-center w-full mb-3 text-[16px]">
        <div className="font-semibold text-gray-800">Salary Per Month</div>
        <div className="font-semibold">
          <span>{formatCurrency(localMin)}</span> - <span>{formatCurrency(localMax)}</span>
        </div>
      </div>

      <div className="slider">
        <div
          className="price-slider"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        ></div>
      </div>

      <div className="range-input mt-4">
        <input
          type="range"
          className="min-range"
          min={MIN}
          max={MAX}
          value={localMin}
          onChange={handleMinRangeChange}
          step="10000"
        />
        <input
          type="range"
          className="max-range"
          min={MIN}
          max={MAX}
          value={localMax}
          onChange={handleMaxRangeChange}
          step="10000"
        />
      </div>

      <style jsx="true">{`
        .slider-container {
          width: 100%;
          padding: 20px 0;
          margin-top: 30px;
        }

        .slider {
          width: 100%;
          height: 2px;
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

        input[type='range']::-webkit-slider-thumb {
          height: 15px;
          width: 15px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 5.5px #000 inset;
          pointer-events: auto;
          -webkit-appearance: none;
          margin-top: -18px;
        }

        input[type='range']::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 5.5px #000 inset;
          pointer-events: auto;
          border: none;
        }

        input[type='range']::-webkit-slider-runnable-track {
          height: 6px;
          background: transparent;
          border: none;
        }

        input[type='range']::-moz-range-track {
          height: 6px;
          background: transparent;
          border: none;
        }

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
