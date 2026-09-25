import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'nav' }) => {
  return (
    <Link
      to="/"
      onClick={() => {
        if (window.scrollY > 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      aria-label="CoHo – CodeHoppers"
    >
      <img
        src="/assets/coho-logo.png"
        alt="CoHo – CodeHoppers"
        draggable={false}
        style={size === 'nav' ? { height: 60, width: 'auto', maxWidth: 'none' } : { height: 96, width: 'auto', maxWidth: 'none' }}
      />
    </Link>
  );
};

export default Logo;
