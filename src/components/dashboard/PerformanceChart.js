import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
const PerformanceChart = ({ value, text }) => (
    <div className="chart-container">
        <CircularProgressbar
            value={value} text={text}
            styles={buildStyles({ pathColor: `#50DC46`, textColor: '#333', trailColor: '#e2e6ea' })}
        />
    </div>
);
export default PerformanceChart;