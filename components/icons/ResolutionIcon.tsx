import React from 'react';

export const ResolutionIcon: React.FC<React.SVGProps<SVGSVGElement> & {portrait?: boolean; landscape?: boolean}> = ({ portrait, landscape, ...props }) => {
  if (portrait) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="6" y="3" width="12" height="18" rx="2" ry="2"></rect>
        </svg>
    )
  }
  if (landscape) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="6" width="18" height="12" rx="2" ry="2"></rect>
        </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    </svg>
  );
};