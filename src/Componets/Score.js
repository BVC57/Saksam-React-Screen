import React from 'react';

const CircleProgressBar = ({ score, total }) => {
  const percentage = (score / total) * 100;
  const radius = 50;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    
    <svg height={radius * 2} width={radius * 2}>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        stroke="#4CC43C"
        strokeWidth="0.2px"
        fill='#4CC43C'
        dy=".3em"
        fontSize="30px"
        fontWeight="bold"
      >
        {score}
        
      </text>
    </svg>
  );
};

export default CircleProgressBar;
