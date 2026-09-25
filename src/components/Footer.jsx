import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import SharedContainer from './SharedContainer';

const Footer = () => (
  <footer className="relative w-full z-10 pt-12 sm:pt-14 pb-8 bg-gradient-to-b from-transparent via-[#04060C]/80 to-[#04060C]">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[1px] bg-gradient-to-r from-transparent via-[#FF5A4F]/70 to-[#3D9BFF]/70" />

    <SharedContainer className="w-full relative z-20">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 md:gap-0">

        {/* Left Side: Logo & Info */}
        <div className="flex flex-col">
          <Logo size="footer" />
          <div className="mt-4 sm:mt-5 font-sans font-light text-[13.5px] sm:text-[14px] leading-[22px] text-[#B8BDC9]">
            Step in as a learner.<br />Step out as a leader.
          </div>
          <div className="mt-5 sm:mt-6 flex flex-col">
            <div className="w-[16px] h-[2px] bg-[#FF5A4F] mb-[10px]" />
            <div className="font-sans font-medium text-[9.5px] tracking-[0.25em] text-[#8A90A0] leading-[15px] uppercase">
              St. Martin's<br />Engineering College
            </div>
          </div>
        </div>

        {/* Right Side: NAVIGATE & CONNECT */}
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 md:gap-24">

          {/* NAVIGATE Column */}
          <div className="flex flex-col">
            <h4 className="text-[10px] tracking-[0.3em] font-medium text-[#3D9BFF] uppercase mb-3.5 sm:mb-4">
              NAVIGATE
            </h4>
            <nav className="flex flex-col gap-3 text-[13.5px] sm:text-[14px] font-light text-[#D5DAE6]">
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition-colors"
              >
                Home
              </Link>
              <a href="/#about" className="hover:text-white transition-colors">
                About
              </a>
              <Link to="/team" className="hover:text-white transition-colors">
                Team
              </Link>
              <Link to="/events" className="hover:text-white transition-colors">
                Events
              </Link>
            </nav>
          </div>

          {/* CONNECT Column */}
          <div className="flex flex-col">
            <h4 className="text-[10px] tracking-[0.3em] font-medium text-[#3D9BFF] uppercase mb-3.5 sm:mb-4">
              CONNECT
            </h4>
            <div className="flex flex-col gap-3 text-[13.5px] sm:text-[14px] font-light text-[#D5DAE6]">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/coho.smec/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8FB6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF6B5E] transition-colors shrink-0">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.3" cy="6.7" r=".6" />
                </svg>
                <span>Instagram</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/code-hoppers/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8FB6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF6B5E] transition-colors shrink-0">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M8 10.5V16M8 7.8v.1M12 16v-5.5M12 12.5c0-1.4 1-2.2 2.3-2.2 1.4 0 2.2.9 2.2 2.4V16" />
                </svg>
                <span>LinkedIn</span>
              </a>

              {/* Email */}
              <a
                href="mailto:codehopperssmec@gmail.com"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8FB6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF6B5E] transition-colors shrink-0">
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="M3.5 7l8.5 6 8.5-6" />
                </svg>
                <span className="break-all">codehopperssmec@gmail.com</span>
              </a>

              {/* College website */}
              <a
                href="https://www.smec.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8FB6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF6B5E] transition-colors shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>smec.ac.in</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full h-[1px] bg-white/10 mb-6 mt-10 sm:mt-12" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 text-[11px] tracking-[0.06em] text-[#8A90A0]">
        <span>© 2026 CoHo, SMEC. All rights reserved.</span>
        <span className="text-[10px] tracking-[0.25em] uppercase">CODE HOPPERS · TECHNICAL CLUB</span>
      </div>
    </SharedContainer>
  </footer>
);

export default Footer;
