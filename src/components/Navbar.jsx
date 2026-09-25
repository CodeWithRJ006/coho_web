import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Scroll direction hook (8px threshold)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80) {
        if (!mobileOpen) {
          setIsVisible(false);
        }
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) >= 8) {
        if (delta < 0) {
          setIsVisible(true);
        } else if (!mobileOpen) {
          // Do not auto-hide header if mobile menu is actively open
          setIsVisible(false);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (location.pathname === '/' && (location.hash === '#about' || location.state?.scrollToAbout)) {
      const timer = setTimeout(() => {
        const el = document.getElementById('about');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleAboutClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollToAbout: true } });
    }
  };

  const isAboutActive = location.pathname === '/';
  const isTeamActive = location.pathname === '/team';
  const isEventsActive = location.pathname === '/events';

  return (
    <motion.header
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isVisible || mobileOpen ? 0 : -100,
        opacity: isVisible || mobileOpen ? 1 : 0,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-[1440px] ${
        isVisible || mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <nav className="w-full h-[72px] bg-white/[0.03] backdrop-blur-md border border-[rgba(80,130,255,0.28)] rounded-xl px-6 md:px-8 flex items-center justify-between shadow-[0_0_20px_rgba(61,155,255,0.15)] relative">
        {/* Left: Logo without any box/background/border */}
        <div className="flex items-center shrink-0">
          <Logo size="nav" />
        </div>

        {/* Right: Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/team"
            className={`relative text-[12px] tracking-[0.22em] font-medium uppercase transition-colors ${
              isTeamActive ? 'text-white' : 'text-[#B8BDC9] hover:text-white'
            }`}
          >
            <span>OUR TEAM</span>
            {isTeamActive && (
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[30px] h-[2px] bg-[#3D9BFF] shadow-[0_0_8px_#3D9BFF]" />
            )}
          </Link>

          <Link
            to="/events"
            className={`relative text-[12px] tracking-[0.22em] font-medium uppercase transition-colors ${
              isEventsActive ? 'text-white' : 'text-[#B8BDC9] hover:text-white'
            }`}
          >
            <span>EVENTS</span>
            {isEventsActive && (
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[30px] h-[2px] bg-[#3D9BFF] shadow-[0_0_8px_#3D9BFF]" />
            )}
          </Link>

          <a
            href="/#about"
            onClick={handleAboutClick}
            className={`relative text-[12px] tracking-[0.22em] font-medium uppercase transition-colors ${
              isAboutActive ? 'text-white' : 'text-[#B8BDC9] hover:text-white'
            }`}
          >
            <span>ABOUT</span>
            {isAboutActive && (
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[30px] h-[2px] bg-[#3D9BFF] shadow-[0_0_8px_#3D9BFF]" />
            )}
          </a>

          {/* 44px Circular Arrow Button */}
          <Link
            to="/events"
            className="w-[44px] h-[44px] rounded-full border border-[rgba(80,130,255,0.7)] flex items-center justify-center text-[#3D9BFF] hover:bg-[#3D9BFF] hover:text-white transition-all duration-300 ml-2 shrink-0 shadow-[0_0_12px_rgba(61,155,255,0.2)]"
            aria-label="Events"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-[#B8BDC9] hover:text-white focus:outline-none shrink-0"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="md:hidden absolute top-[80px] left-0 right-0 bg-[#04060C]/95 backdrop-blur-xl border border-[rgba(80,130,255,0.28)] rounded-xl p-6 flex flex-col gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden z-50 pointer-events-auto"
            >
              <Link
                to="/team"
                onClick={() => setMobileOpen(false)}
                className={`relative text-[12px] tracking-[0.22em] font-medium uppercase transition-colors flex items-center justify-between ${
                  isTeamActive ? 'text-white font-semibold' : 'text-[#B8BDC9] hover:text-white'
                }`}
              >
                <span>OUR TEAM</span>
                {isTeamActive && (
                  <span className="w-[6px] h-[6px] rounded-full bg-[#3D9BFF] shadow-[0_0_8px_#3D9BFF]" />
                )}
              </Link>
              <Link
                to="/events"
                onClick={() => setMobileOpen(false)}
                className={`relative text-[12px] tracking-[0.22em] font-medium uppercase transition-colors flex items-center justify-between ${
                  isEventsActive ? 'text-white font-semibold' : 'text-[#B8BDC9] hover:text-white'
                }`}
              >
                <span>EVENTS</span>
                {isEventsActive && (
                  <span className="w-[6px] h-[6px] rounded-full bg-[#3D9BFF] shadow-[0_0_8px_#3D9BFF]" />
                )}
              </Link>
              <a
                href="/#about"
                onClick={handleAboutClick}
                className={`relative text-[12px] tracking-[0.22em] font-medium uppercase transition-colors flex items-center justify-between ${
                  isAboutActive ? 'text-white font-semibold' : 'text-[#B8BDC9] hover:text-white'
                }`}
              >
                <span>ABOUT</span>
                {isAboutActive && (
                  <span className="w-[6px] h-[6px] rounded-full bg-[#3D9BFF] shadow-[0_0_8px_#3D9BFF]" />
                )}
              </a>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] text-[#8A90A0] uppercase font-medium">VIEW EVENTS</span>
                <Link
                  to="/events"
                  onClick={() => setMobileOpen(false)}
                  className="w-[44px] h-[44px] rounded-full border border-[rgba(80,130,255,0.7)] flex items-center justify-center text-[#3D9BFF] hover:bg-[#3D9BFF] hover:text-white transition-all duration-300 shadow-[0_0_12px_rgba(61,155,255,0.2)]"
                  aria-label="Events"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navbar;
