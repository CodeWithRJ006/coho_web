import React from 'react';

const SharedContainer = ({ children, className = "" }) => (
  <div className={`max-w-[1440px] mx-auto px-6 md:px-24 ${className}`}>
    {children}
  </div>
);

export default SharedContainer;
