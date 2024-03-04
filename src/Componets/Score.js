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
      <circle
        stroke="silver"
        fill="white"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={score <= 350 ? 'red' : 'green'}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{
          strokeDashoffset,
          transform: `rotate(-90deg) translate(-${radius * 2}px)`,
        }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        stroke="#0075F3"
        strokeWidth="0.2px"
        dy=".3em"
        fontSize="16px"
        fontWeight="bold"
      >
        {score}
      </text>
    </svg>
  );
};

export default CircleProgressBar;
