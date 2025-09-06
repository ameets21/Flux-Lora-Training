
import React from 'react';

export const FluxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2l-4 4h8l-4 -4z" />
    <path d="M12 22l4 -4h-8l4 4z" />
    <path d="M2 12l4 -4v8l-4 -4z" />
    <path d="M22 12l-4 -4v8l4 -4z" />
  </svg>
);
