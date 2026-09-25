import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Footer = () => (
  <footer className="relative w-full z-10 pt-20">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#04060C]/70 to-[#04060C] pointer-events-none" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[1px] bg-gradient-to-r from-transparent via-[#FF5A50]/70 to-[#3D9BFF]/70" />

    <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-24 pt-14 pb-8 h-[400px]">

      <div className="flex flex-col md:flex-row justify-between w-full">

        {/* Left side */}
        <div className="flex flex-col">
            <Link
              to="/"
              aria-label="CoHo – CodeHoppers"
              className="inline-flex items-center shrink-0"
            >
              <Logo size="footer" />
            </Link>
          <div className="mt-5 font-light text-[14px] leading-[22px] text-[#C9CED8] tracking-[0.03em]">
            Step in as a learner.<br/>Step out as a leader.
          </div>
          <div className="mt-8 font-medium text-[9.5px] tracking-[0.25em] text-[#3D9BFF] leading-[15px] uppercase relative">
            <div className="w-[16px] h-[2px] bg-[#FF4D4D] mb-[10px]" />
            St. Martin's<br/>Engineering College
          </div>
        </div>

        {/* Nav & Socials */}
        <div className="flex gap-20 mt-12 md:mt-0">

          <div className="flex flex-col">
            <div className="text-[10px] tracking-[0.3em] text-[#3D9BFF] uppercase mb-4">Navigate</div>
            <nav className="flex flex-col gap-4">
              <a href="/#" className="text-[14px] text-[#D5DAE6] hover:text-white hover:translate-x-1 transition-all  card-hover">Home</a>
              <a href="/#about" className="text-[14px] text-[#D5DAE6] hover:text-white hover:translate-x-1 transition-all  card-hover">About</a>
              <Link to="/team" className="text-[14px] text-[#D5DAE6] hover:text-white hover:translate-x-1 transition-all  card-hover">Team</Link>
              <Link to="/events" className="text-[14px] text-[#D5DAE6] hover:text-white hover:translate-x-1 transition-all  card-hover">Events</Link>
            </nav>
          </div>

          <div className="flex flex-col">
            <div className="text-[10px] tracking-[0.3em] text-[#3D9BFF] uppercase mb-4">Connect</div>
            <div className="flex flex-col gap-4">
              <a href="#" className="flex items-center gap-3 text-[14px] text-[#D5DAE6] hover:text-white transition-colors group  card-hover">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8FB6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF6B5E] transition-colors"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg>
                Instagram
                </a>
              <a href="#" className="flex items-center gap-3 text-[14px] text-[#D5DAE6] hover:text-white transition-colors group  card-hover">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8FB6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF6B5E] transition-colors"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V16M8 7.8v.1M12 16v-5.5M12 12.5c0-1.4 1-2.2 2.3-2.2 1.400 0 2.200.9 2.200 2.400V16"/></svg>
                LinkedIn
              </a>
              <a href="#" className="flex items-center gap-3 text-[14px] text-[#D5DAE6] hover:text-white transition-colors group  card-hover">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8FB6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF6B5E] transition-colors"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.500 6 8.500-6"/></svg>
                Email Us
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-10 left-6 md:left-[87px] right-6 md:right-[87px]">
        <div className="w-full h-[1px] bg-white/10 mb-4" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[11px] tracking-[0.06em] text-[#8A90A0]">
          <span>© 2026 CoHo, SMEC. All rights reserved.</span>
          <span className="text-[10px] tracking-[0.25em] uppercase">Code Hoppers · Technical Club</span>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
