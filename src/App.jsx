import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import { TEAM_DOMAINS } from './teamData';
import { EVENTS_DATA } from './eventsData';
import { EventsPage } from './EventsPage';

import SharedContainer from './components/SharedContainer';
import Footer from './components/Footer';

const AnimatedText = ({ text, className = "" }) => {
  return (
    <div className={`overflow-hidden flex ${className}`}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

const Astronaut = () => (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.2 }} className="w-full h-full relative animate-float">
      <img src="/astronaut_final.png" alt="Astronaut" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(255,90,79,0.15)] relative z-10" />
    </motion.div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'w-[calc(100%-3rem)] md:w-[800px]' : 'w-[calc(100%-3rem)] max-w-[1440px]'}`}>
      <nav className="w-full bg-[#04060C]/90 backdrop-blur-md border border-white/5 rounded-full px-8 md:px-10 py-4 md:py-5 flex items-center justify-between shadow-2xl">
        <Link to="/" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="font-display font-black text-xl tracking-wider card-hover flex items-center">
          <span className="text-[#FF5A4F]">CO</span>
          <span className="text-[#3D9BFF]">HO</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-[10px] tracking-[0.25em] font-medium uppercase text-[#8A8F98]">
            <a href="/#about" className="relative group card-hover hover:text-white transition-colors">
              <span>About</span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#3D9BFF] shadow-[0_0_8px_#3D9BFF] group-hover:w-8 transition-all duration-300" />
            </a>
            <Link to="/team" className="relative group card-hover hover:text-white transition-colors">
              <span>Our Team</span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#3D9BFF] shadow-[0_0_8px_#3D9BFF] group-hover:w-8 transition-all duration-300" />
            </Link>
            <Link to="/events" className="relative group card-hover hover:text-white transition-colors">
              <span>Events</span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#3D9BFF] shadow-[0_0_8px_#3D9BFF] group-hover:w-8 transition-all duration-300" />
            </Link>
            <button className="w-[40px] h-[40px] rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 card-hover ml-6">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </nav>
    </div>
  );
};

const SciFiCard = ({ delay, title, desc, icon, accent }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.8, delay }} className="relative group w-[263px] h-[187px] mx-auto card-hover">
      <div className="absolute inset-0 bg-[#0a0e1c] overflow-hidden" style={{ clipPath: 'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)' }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(61,155,255,0.15) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 p-[30px] flex flex-col items-center text-center z-10">
          <div className="mb-6 transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500">{icon}</div>
          <h3 className="font-display font-black text-xl tracking-wider uppercase mb-4 text-[#D5DAE6] group-hover:text-white transition-colors">{title}</h3>
          <p className="text-[#8A90A0] text-[13px] leading-relaxed tracking-wide font-light" dangerouslySetInnerHTML={{__html: desc}} />
        </div>
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 263 187" fill="none">
        <path d="M14 .5H262.5V173L249 186.5H.5V14Z" stroke="rgba(255,255,255,.12)" className="group-hover:stroke-white/30 transition-colors duration-500" />
        {accent}
      </svg>
    </motion.div>
  );
};

const EventCard = ({ e, index }) => (
  <a href="#" className="relative flex-none w-[300px] block text-white transition-transform duration-300 hover:-translate-y-2 group  mb-4">
    {/* Image Container with Clip Path */}
    <div className="relative w-[300px] h-[330px] overflow-hidden bg-[#0b0f1e] mb-5 border border-white/5 shadow-lg group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-shadow duration-500" style={{ clipPath: 'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)' }}>
      {/* Background Gradient fallback */}
      <div className="absolute inset-0 bg-[#0a0e1c] z-0" style={{ background: `radial-gradient(120% 90% at 20% 0%, ${e.colorStart}, transparent 60%), radial-gradient(100% 80% at 100% 100%, ${e.colorEnd}, transparent 60%), #0a0e1c` }} />

      {/* Event Poster */}
      <img src={e.image} alt={e.name} className="absolute inset-0 w-full h-full object-cover z-10 opacity-90 transition-all duration-700 group-hover:opacity-100" onError={(err) => err.target.style.display='none'} />

      {/* Event Index Badge */}
      <div className="absolute top-[18px] left-[18px] bg-[#10162A]/90 px-3 py-1.5 rounded-md z-20 border border-white/10 shadow-lg">
        <span className="text-[8px] tracking-[0.3em] text-white/90 font-bold uppercase">EVENT 0{index + 1}</span>
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#04060C]/60 z-20 pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] z-20 pointer-events-none group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] transition-shadow duration-500" />
    </div>

    {/* Text Content Below the Image */}
    <div className="flex flex-col relative z-20 px-2">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A4F] shadow-[0_0_8px_#FF5A4F]" />
        <span className="text-[10px] tracking-[0.2em] font-medium text-[#FF5A4F] uppercase">{e.dateLabel}</span>
      </div>
      <b className="font-display font-black text-2xl uppercase tracking-tight text-white mb-1 group-hover:text-[#3D9BFF] transition-colors line-clamp-1">{e.name}</b>
      <em className="not-italic text-[11px] tracking-[0.1em] text-[#8A90A0] uppercase font-medium line-clamp-1">{e.tag}</em>
    </div>

    {/* Arrow Icon Button */}
    <div className="absolute bottom-[-10px] right-2 w-[40px] h-[40px] bg-[#1a2035] flex items-center justify-center transition-colors group-hover:bg-[#FF5A4F] border border-white/10 shadow-xl" style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 8px)' }}>
      <ArrowRight className="w-4 h-4 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
    </div>
  </a>
);


const EventCarousel = ({ events }) => {
  const scrollRef = React.useRef(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeftState, setScrollLeftState] = React.useState(0);

  const isInView = useInView(scrollRef, { margin: "200px" });
  React.useEffect(() => {
    let animationId;
    const scroll = () => {
      if (scrollRef.current && !isHovered && !isDragging && isInView) {
        scrollRef.current.scrollLeft += 1.5;
        const totalWidth = 324 * events.length;
        if (scrollRef.current.scrollLeft >= totalWidth) {
           scrollRef.current.scrollLeft -= totalWidth;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, isDragging, events.length, isInView]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="relative w-[100vw] left-1/2 -translate-x-1/2 h-[480px] overflow-hidden mask-edges film-holes">
      <div
        ref={scrollRef}
        className="absolute left-0 top-0 w-full h-full flex gap-[24px] pt-[30px] pb-[10px] overflow-x-auto event-scrollbar touch-pan-x cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
        onMouseDown={(e) => {
          setIsDragging(true);
          setStartX(e.pageX - scrollRef.current.offsetLeft);
          setScrollLeftState(scrollRef.current.scrollLeft);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={(e) => {
          if (!isDragging) return;
          e.preventDefault();
          const x = e.pageX - scrollRef.current.offsetLeft;
          const walk = (x - startX) * 2;
          scrollRef.current.scrollLeft = scrollLeftState - walk;
        }}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {[...events, ...events, ...events, ...events, ...events].map((e, index) => (
          <EventCard key={index} e={e} index={index % events.length} />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <section className="relative w-full h-screen min-h-[750px] flex flex-col z-10 pt-28 md:pt-32">
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060C]/90 via-[#04060C]/40 to-transparent w-[95%] md:w-[65%] z-10 pointer-events-none" />
        <SharedContainer className="flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center w-full">
            <div className="w-full max-w-[650px] pb-8 relative z-30">
              <h1 className="font-display font-black leading-[0.85] tracking-tighter text-[4rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[8.5rem] mb-6 flex flex-col whitespace-nowrap drop-shadow-2xl">
                <AnimatedText text="CODE" className="text-white pb-1 md:pb-2" />
                <AnimatedText text="HOPPERS" className="text-gradient-coral" />
              </h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-base md:text-xl font-medium tracking-wide mb-5 md:mb-6 text-white/90">
                Step in as a learner. Step out as a leader.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[#C9CED8] text-sm md:text-[15px] leading-relaxed max-w-[480px] mb-8 md:mb-10 font-light">
                A community of like-minded innovators fueled by the power of code.<br className="hidden md:block"/>
                From your first line of code to your first big idea — CoHo<br className="hidden md:block"/>
                welcomes every student, from every department, to learn, build,<br className="hidden md:block"/>
                and grow together.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
                <Link to="/events" className="group relative inline-flex items-center gap-4 px-6 py-3 md:px-8 md:py-4 rounded-full border border-[#FF5A4F] text-[10px] md:text-[11px] tracking-[0.15em] font-medium uppercase overflow-hidden transition-all duration-300 bg-[#04060C]/50 backdrop-blur-md">
                  <span className="relative z-10 text-white">CATCH US IN ACTION</span>
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1 text-white" />
                  <div className="absolute inset-0 bg-[#FF5A4F] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Link>
              </motion.div>
            </div>

            <div className="hidden lg:block absolute left-[45%] top-[50%] -translate-y-1/2 w-[480px] xl:w-[580px] pointer-events-none z-20">
              <Astronaut />
            </div>
          </div>

          <div className="w-full flex justify-between items-end pb-12 md:pb-16 pointer-events-none">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex items-start gap-4 hidden md:flex w-1/3">
              <Compass className="w-5 h-5 text-[#8A8F98] mt-0.5" />
              <div className="flex flex-col text-[9px] tracking-[0.2em] text-[#8A8F98] leading-[1.6]">
                <span>EXPLORE</span>
                <span>INNOVATE</span>
                <span>BUILD</span>
                <span>TOGETHER</span>
              </div>
            </motion.div>
            <div className="flex flex-col items-center gap-4  pointer-events-auto w-full md:w-1/3" onClick={scrollToNext}>
              <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-[#8A8F98] uppercase hidden md:block">Scroll to explore</span>
              <motion.button animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#FF5A4F] flex items-center justify-center text-[#FF5A4F] hover:bg-[#FF5A4F] hover:text-white transition-colors group  card-hover">
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
              </motion.button>
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1 }} className="flex items-center gap-4 md:gap-6 text-right justify-end hidden md:flex w-1/3">
              <div className="w-[1px] h-6 md:h-8 bg-white/20" />
              <div className="flex flex-col items-start text-left">
                <div className="w-3 md:w-4 h-[2px] bg-[#FF5A4F] mb-2" />
                <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-medium uppercase text-white/80">St. Martin's</span>
                <span className="text-[8px] md:text-[9px] tracking-[0.2em] text-[#8A8F98] uppercase">Engineering College</span>
              </div>
              <div className="flex flex-col text-[9px] md:text-[10px] tracking-[0.2em] text-[#8A8F98] ml-2">
                <span>20</span>
                <span>26</span>
              </div>
            </motion.div>
          </div>
        </SharedContainer>

        <div className="relative z-20 flex-1 w-full max-w-[1920px] mx-auto flex flex-col justify-between px-6 md:px-24">
          <div className="flex-1 flex flex-col justify-center w-full">
            <div className="w-full max-w-[650px] pb-8 relative z-30">
              <h1 className="font-display font-black leading-[0.85] tracking-tighter text-[4rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[8.5rem] mb-6 flex flex-col whitespace-nowrap drop-shadow-2xl">
                <AnimatedText text="CODE" className="text-white pb-1 md:pb-2" />
                <AnimatedText text="HOPPERS" className="text-gradient-coral" />
              </h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-base md:text-xl font-medium tracking-wide mb-5 md:mb-6 text-white/90">
                Step in as a learner. Step out as a leader.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[#C9CED8] text-sm md:text-[15px] leading-relaxed max-w-[480px] mb-8 md:mb-10 font-light">
                A community of like-minded innovators fueled by the power of code.<br className="hidden md:block"/>
                From your first line of code to your first big idea — CoHo<br className="hidden md:block"/>
                welcomes every student, from every department, to learn, build,<br className="hidden md:block"/>
                and grow together.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
                <Link to="/events" className="group relative inline-flex items-center gap-4 px-6 py-3 md:px-8 md:py-4 rounded-full border border-[#FF5A4F] text-[10px] md:text-[11px] tracking-[0.15em] font-medium uppercase overflow-hidden transition-all duration-300 bg-[#04060C]/50 backdrop-blur-md">
                  <span className="relative z-10 text-white">CATCH US IN ACTION</span>
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1 text-white" />
                  <div className="absolute inset-0 bg-[#FF5A4F] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Link>
              </motion.div>
            </div>

            <div className="hidden lg:block absolute left-[45%] top-[50%] -translate-y-1/2 w-[480px] xl:w-[580px] pointer-events-none z-20">
              <Astronaut />
            </div>
          </div>

          <div className="w-full flex justify-between items-end pb-12 md:pb-16 pointer-events-none">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex items-start gap-4 hidden md:flex w-1/3">
              <Compass className="w-5 h-5 text-[#8A8F98] mt-0.5" />
              <div className="flex flex-col text-[9px] tracking-[0.2em] text-[#8A8F98] leading-[1.6]">
                <span>EXPLORE</span>
                <span>INNOVATE</span>
                <span>BUILD</span>
                <span>TOGETHER</span>
              </div>
            </motion.div>
            <div className="flex flex-col items-center gap-4  pointer-events-auto w-full md:w-1/3" onClick={scrollToNext}>
              <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-[#8A8F98] uppercase hidden md:block">Scroll to explore</span>
              <motion.button animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#FF5A4F] flex items-center justify-center text-[#FF5A4F] hover:bg-[#FF5A4F] hover:text-white transition-colors group  card-hover">
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
              </motion.button>
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1 }} className="flex items-center gap-4 md:gap-6 text-right justify-end hidden md:flex w-1/3">
              <div className="w-[1px] h-6 md:h-8 bg-white/20" />
              <div className="flex flex-col items-start text-left">
                <div className="w-3 md:w-4 h-[2px] bg-[#FF5A4F] mb-2" />
                <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-medium uppercase text-white/80">St. Martin's</span>
                <span className="text-[8px] md:text-[9px] tracking-[0.2em] text-[#8A8F98] uppercase">Engineering College</span>
              </div>
              <div className="flex flex-col text-[9px] md:text-[10px] tracking-[0.2em] text-[#8A8F98] ml-2">
                <span>20</span>
                <span>26</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="about" className="relative w-full min-h-[720px] max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-16 flex flex-col justify-center z-10 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative w-full mb-16">
          <div className="w-full md:w-[60%] z-20">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center text-[11px] tracking-[0.25em] mb-6 whitespace-nowrap">
              <span className="text-[#3D9BFF] font-medium">02</span>
              <span className="text-[#C9CED8] mx-[20px] md:mx-[22px]">/</span>
              <span className="text-[#E4E8F0] uppercase font-medium">About CoHo</span>
              <div className="hidden sm:block w-[100px] md:w-[182px] h-[1px] bg-white/75 ml-[22px]" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display font-black leading-[0.9] tracking-tighter text-[3.5rem] sm:text-[4.5rem] md:text-[4.75rem] mb-8 whitespace-nowrap">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#8EC4FF] to-[#3D8BFF]">CODE. CREATE.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FF9A8A] via-[#FF5148] to-[#FF3838]">CONQUER.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-[#D5DAE6] text-[17px] font-light tracking-[0.04em] leading-[21px] whitespace-nowrap">
              A community of innovators powered by code.<br/>Learn. Build. Grow. Together.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-[180px] md:w-[225px] absolute right-0 md:right-4 top-0 md:top-[20%] opacity-20 md:opacity-100 z-10 pointer-events-none">
            <div className="w-full h-full relative animate-float" style={{ animationDelay: '1s' }}>
              <img src="/astronaut.webp" alt="Astronaut" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(61,155,255,0.2)]" />
            </div>
          </motion.div>
        </div>
        <div className="flex flex-nowrap overflow-x-auto pb-8 snap-x snap-mandatory md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-8 lg:gap-x-[40px] gap-y-8 w-full event-scrollbar">
          <div className="snap-center"><SciFiCard delay={0.1} title="WORKSHOPS" desc="Hands-on sessions to learn<br/>new tech, tools, and<br/>languages." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="36" height="26" rx="3"/><path d="M2 34h44l-3 5H5z"/><path d="M19 12l-5 6 5 6" stroke="#3D9BFF"/><path d="M29 12l5 6-5 6" stroke="#FF5A4F"/></svg>} accent={<path d="M.5 52V14L14 .5H52M262.5 135v38L249 186.5H211" stroke="#3D9BFF" strokeWidth="1.6" className="group-hover:stroke-[#FF5A4F] transition-colors duration-500" />}/></div>
          <div className="snap-center"><SciFiCard delay={0.2} title="HACKATHONS" desc="Build real projects under<br/>pressure, as a team." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="12" r="6"/><path d="M12 38c0-8 5-13 12-13s12 5 12 13z"/><circle cx="10" cy="17" r="4.5" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500"/><path d="M2 36c0-6 3-10 8-10" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500"/><circle cx="38" cy="17" r="4.5" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500"/><path d="M46 36c0-6-3-10-8-10" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500"/></svg>} accent={<><path d="M.5 52V14L14 .5H52" stroke="#FF5A4F" strokeWidth="1.6" className="group-hover:stroke-[#B48CFF] transition-colors duration-500" /><path d="M262.5 135v38L249 186.5H211" stroke="#B48CFF" strokeWidth="1.6" className="group-hover:stroke-[#FF5A4F] transition-colors duration-500" /></>}/></div>
          <div className="snap-center"><SciFiCard delay={0.3} title="TALK SHOWS" desc="Learn from voices in tech,<br/>on your campus." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="2" width="12" height="22" rx="6" stroke="#3D9BFF" className="group-hover:stroke-white transition-colors duration-500"/><path d="M12 20c0 7 5 11 12 11s12-4 12-11M24 31v9M17 40h14"/></svg>} accent={<path d="M.5 52V14L14 .5H52M262.5 135v38L249 186.5H211" stroke="#3D9BFF" strokeWidth="1.6" className="group-hover:stroke-[#FF5A4F] transition-colors duration-500" />}/></div>
          <div className="snap-center"><SciFiCard delay={0.4} title="CODE FEST" desc="Compete, showcase, and<br/>celebrate code." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3h20v12a10 10 0 0 1-20 0z"/><path d="M14 7H6c0 7 3 10 8 10M34 7h8c0 7-3 10-8 10M24 25v8M16 40h16M18 33h12v7"/><path d="M24 8l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4-2.5-2.4 3.4-.5z" stroke="#FF5A4F" strokeWidth="1" className="group-hover:stroke-white transition-colors duration-500"/></svg>} accent={<path d="M.5 52V14L14 .5H52M262.5 135v38L249 186.5H211" stroke="#FF5A4F" strokeWidth="1.6" className="group-hover:stroke-[#3D9BFF] transition-colors duration-500" />}/></div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="mt-12">
          <button className="group relative inline-flex items-center justify-center gap-4 w-[256px] h-[44px] rounded-full border border-transparent text-[11px] tracking-[0.2em] font-medium text-white uppercase overflow-hidden  card-hover transition-transform duration-300 hover:scale-105" style={{ background: 'linear-gradient(#04060C, #04060C) padding-box, linear-gradient(90deg, #FF6B5E, #3D9BFF) border-box' }}>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">CATCH US IN ACTION</span>
            <svg width="16" height="10" viewBox="0 0 18 12" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"><path d="M1 6h15M11 1l5 5-5 5"/></svg>

            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B5E] to-[#3D9BFF] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </button>
        </motion.div>
      </section>

      <section id="team" className="relative w-full min-h-[720px] max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-16 flex flex-col justify-center z-10 overflow-hidden">
        <div className="flex justify-between items-center w-full mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center text-[11px] tracking-[0.25em] whitespace-nowrap">
            <span className="text-[#3D9BFF] font-medium">03</span>
            <span className="text-[#C9CED8] mx-[20px] md:mx-[22px]">/</span>
            <span className="text-[#E4E8F0] uppercase font-medium">Our Team</span>
            <div className="hidden sm:block w-[100px] md:w-[182px] h-[1px] bg-white/75 ml-[22px]" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[12px] tracking-[0.1em] text-[#8A8F98]">//03</motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative w-full h-[300px] md:h-[468px] mt-4 group transition-all duration-500 hover:scale-[1.02] hover:drop-shadow-[0_0_30px_rgba(61,155,255,0.4)] cursor-pointer">
          <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#10162A] to-[#080B16]" style={{ clipPath: 'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 18px)' }}>
             <div id="team-fallback-ui" className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-[#8A90A0] text-[11px] tracking-[0.25em] uppercase z-0">
                <svg width="46" height="40" viewBox="0 0 48 44" fill="none" stroke="#6B7286" strokeWidth="1.4" strokeLinecap="round"><circle cx="24" cy="12" r="6"/><path d="M12 38c0-8 5-13 12-13s12 5 12 13z"/><circle cx="10" cy="17" r="4.5"/><path d="M2 36c0-6 3-10 8-10"/><circle cx="38" cy="17" r="4.5"/><path d="M46 36c0-6-3-10-8-10"/></svg>
                <span>Team group photo</span>
                <span className="normal-case text-[10px] tracking-[0.18em] text-[#5E6474]">team_photo_v1.jpeg</span>
             </div>
             <img src="/assets/team_photo.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-[center_30%] z-10 opacity-75 mix-blend-lighten transition-all duration-700 ease-out group-hover:opacity-100" onLoad={() => { const el = document.getElementById('team-fallback-ui'); if(el) el.style.display='none'; }} onError={(e) => e.target.style.display='none'} />
          </div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1118 468" fill="none" preserveAspectRatio="none">
            <path d="M18 .5H1117.5V450L1100 467.5H.5V18Z" stroke="rgba(255,255,255,.14)" className="group-hover:stroke-white/30 transition-colors duration-500" />
            <path d="M.5 90V18L18 .5H90M1117.5 378v72L1100 467.5H1028" stroke="url(#team-g)" strokeWidth="1.8" />
            <defs>
              <linearGradient id="team-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3D9BFF" />
                <stop offset="1" stopColor="#FF5A4F" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-12">
          <Link to="/team" className="group relative inline-flex items-center justify-center gap-4 w-[216px] h-[44px] rounded-full border border-transparent text-[11px] tracking-[0.2em] font-medium text-white uppercase overflow-hidden  card-hover transition-transform duration-300 hover:scale-105" style={{ background: 'linear-gradient(#04060C, #04060C) padding-box, linear-gradient(90deg, #FF6B5E, #3D9BFF) border-box' }}>
            <span className="relative z-10">MEET THE CREW</span>
            <svg width="16" height="10" viewBox="0 0 18 12" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"><path d="M1 6h15M11 1l5 5-5 5"/></svg>

            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B5E] to-[#3D9BFF] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </Link>
        </motion.div>
      </section>

      <section id="events" className="relative w-full min-h-[720px] max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-16 flex flex-col justify-center z-10 overflow-hidden">
        <div className="flex justify-between items-center w-full mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center text-[11px] tracking-[0.25em] whitespace-nowrap">
            <span className="text-[#3D9BFF] font-medium">04</span>
            <span className="text-[#C9CED8] mx-[20px] md:mx-[22px]">/</span>
            <span className="text-[#E4E8F0] uppercase font-medium">Events</span>
            <div className="hidden sm:block w-[100px] md:w-[182px] h-[1px] bg-white/75 ml-[22px]" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[12px] tracking-[0.1em] text-[#8A8F98]">//04</motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative w-[100vw] left-1/2 -translate-x-1/2 mask-edges">
            <EventCarousel events={EVENTS_DATA} />
            <div className="mt-8 text-center text-[#8A90A0] text-[10px] md:text-[11px] tracking-[0.3em] font-medium uppercase flex items-center justify-center gap-2">
              DRAG TO SPIN <span className="mx-2 text-[#5E6474]">•</span> SCROLL TO EXPLORE
            </div>
          </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-12">
          <Link to="/events" className="group relative inline-flex items-center justify-center gap-4 w-[216px] h-[44px] rounded-full border border-transparent text-[11px] tracking-[0.2em] font-medium text-white uppercase overflow-hidden  card-hover transition-transform duration-300 hover:scale-105" style={{ background: 'linear-gradient(#04060C, #04060C) padding-box, linear-gradient(90deg, #FF6B5E, #3D9BFF) border-box' }}>
            <span className="relative z-10">SEE ALL EVENTS</span>
            <svg width="16" height="10" viewBox="0 0 18 12" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"><path d="M1 6h15M11 1l5 5-5 5"/></svg>

            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B5E] to-[#3D9BFF] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

const TeamRoster = () => {
  return (
    <div className="w-full mt-16 flex flex-col gap-24 relative z-20 pb-16 pt-8">
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">The Crew</h2>
        <p className="text-[#8A90A0] text-sm md:text-base max-w-xl mx-auto tracking-wide">The brilliant minds behind Code Hoppers, driving innovation, technology, and community.</p>
      </div>

      {TEAM_DOMAINS.map((domain, idx) => (
        <div key={idx} className="flex flex-col w-full max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 mb-10 pl-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A4F] shadow-[0_0_12px_rgba(255,90,79,0.8)]" />
            <h3 className="font-display text-lg md:text-2xl font-bold tracking-[0.15em] uppercase text-white/95">{domain.domain}</h3>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent ml-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 md:gap-x-8 gap-y-12">
            {domain.members.map((member, mIdx) => (
              <div key={mIdx} className="flex flex-col items-center group  card-hover">
                <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden mb-5 border border-white/5 bg-[#0b0f1e] shadow-lg transition-transform duration-500 group-hover:-translate-y-2">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover object-[center_20%] opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#12182C] to-[#080B16] text-[#8A90A0]" style={{ display: member.image ? 'none' : 'flex' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04060C] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
                </div>
                <h4 className="font-medium text-[13px] md:text-[15px] text-white text-center leading-tight mb-1.5 transition-colors group-hover:text-[#3D9BFF]">{member.name}</h4>
                <p className="text-[9px] md:text-[10px] tracking-[0.15em] text-[#8A90A0] uppercase text-center font-medium group-hover:text-white/80 transition-colors">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#04060C] text-white px-6">
          <div className="text-center max-w-md">
            <h1 className="font-display font-black text-3xl text-[#FF5A4F] mb-4">Something went wrong</h1>
            <p className="text-[#8A90A0] mb-6">{this.state.error?.message || "An unexpected error occurred."}</p>
            <button
              className="px-6 py-3 rounded-full border border-[#FF5A4F] text-[#FF5A4F] font-medium tracking-wide uppercase hover:bg-[#FF5A4F]/10 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const TeamPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen">
      <SharedContainer className="flex items-center justify-between mt-8 relative z-50">
        <Link to="/" className="inline-flex items-center gap-3 text-[#8A8F98] hover:text-white transition-colors uppercase tracking-[0.2em] text-[11px] font-medium  card-hover group">
          <div className="w-8 h-8 rounded-full border border-[#8A8F98]/30 flex items-center justify-center group-hover:border-white/60 group-hover:-translate-x-1 transition-all duration-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </div>
          BACK TO HOME
        </Link>
      </SharedContainer>
      <TeamRoster />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <div className="bg-[#04060C] text-white relative selection:bg-[#FF5A4F]/30 selection:text-white flex flex-col w-full min-h-screen">

      <Navbar />

      <div className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-70 md:opacity-90 scale-110">
          <source src="/download.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060C]/20 via-transparent to-[#04060C]/80" />
        <div className="absolute -bottom-10 -right-10 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-[#04060C] via-[#04060C] to-transparent blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 w-full flex-1">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/events" element={<EventsPage />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </div>
  );
}
