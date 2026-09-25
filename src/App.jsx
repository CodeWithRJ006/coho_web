import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { LoadingScreen } from './LoadingScreen';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import Logo from './components/Logo';
import { Routes, Route, Link } from 'react-router-dom';
import { TEAM_DOMAINS } from './teamData';
import { EVENTS_DATA, getSortedEvents, getEventLink, isUpcomingEvent } from './eventsData';
import { EventsPage } from './EventsPage';

import SharedContainer from './components/SharedContainer';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

const AnimatedText = ({ text, className = "", gradientStyle = "" }) => {
  const containerRef = useRef(null);
  const [letterOffsets, setLetterOffsets] = useState([]);
  const [totalWidth, setTotalWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const updateLayout = () => {
        if (!containerRef.current) return;
        const spans = containerRef.current.querySelectorAll('.letter-span');
        const containerLeft = containerRef.current.getBoundingClientRect().left;
        const offsets = [];
        spans.forEach((span) => {
          const spanLeft = span.getBoundingClientRect().left;
          offsets.push(spanLeft - containerLeft);
        });
        setLetterOffsets(offsets);
        setTotalWidth(containerRef.current.offsetWidth);
      };
      updateLayout();
      window.addEventListener('resize', updateLayout);
      return () => window.removeEventListener('resize', updateLayout);
    }
  }, [text]);

  return (
    <div ref={containerRef} className={`overflow-hidden flex ${className}`}>
      {text.split('').map((char, index) => {
        const offsetLeft = letterOffsets[index] || 0;
        const spanStyle = gradientStyle ? {
          backgroundImage: gradientStyle,
          backgroundSize: totalWidth ? `${totalWidth}px 100%` : '100% 100%',
          backgroundPosition: `-${offsetLeft}px 0`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
        } : {};

        return (
          <motion.span
            key={index}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block letter-span"
            style={spanStyle}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </div>
  );
};

const Astronaut = () => (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.2 }} className="w-full h-full relative animate-float">
      <img src="/astronaut_final.png" alt="Astronaut" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(255,90,79,0.15)] relative z-10" />
    </motion.div>
);


const SciFiCard = ({ delay, title, desc, icon, accent }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay }}
      className="relative group w-[263px] h-[187px] card-hover shrink-0"
    >
      <div
        className="absolute inset-0 bg-[#0a0e1c] overflow-hidden"
        style={{ clipPath: 'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)' }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(61,155,255,0.15) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 pt-[26px] px-[31px] pb-[20px] flex flex-col items-start text-left z-10">
          <div className="mb-[12px] transform group-hover:-translate-y-1 group-hover:scale-105 transition-all duration-500 shrink-0">
            {icon}
          </div>
          <h3 className="font-sans font-medium text-[15px] tracking-[0.22em] uppercase mb-[6px] text-[#F2F4F8] group-hover:text-white transition-colors shrink-0">
            {title}
          </h3>
          <p
            className="font-sans font-light text-[13.3px] leading-[20px] text-[#B8BDC9] tracking-normal"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        </div>
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 263 187" fill="none">
        <path d="M14 .5H262.5V173L249 186.5H.5V14Z" stroke="rgba(255,255,255,.12)" className="group-hover:stroke-white/30 transition-colors duration-500" />
        {accent}
      </svg>
    </motion.div>
  );
};

const EventCard = ({ e }) => {
  const targetUrl = getEventLink(e);

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex-none w-[250px] sm:w-[300px] block group mb-4 transition-transform duration-300 hover:-translate-y-2"
    >
      {/* Poster Image Container */}
      <div
        className="relative w-[250px] sm:w-[300px] h-[280px] sm:h-[330px] overflow-hidden bg-[#0b0f1e] mb-3 border border-white/5 shadow-lg group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-shadow duration-500"
        style={{ clipPath: 'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)' }}
      >
        <img
          src={e.image}
          alt={e.name}
          className="absolute inset-0 w-full h-full object-cover z-10 opacity-100 transition-transform duration-700 group-hover:scale-105"
          onError={(err) => { err.target.style.display = 'none'; }}
        />
        {/* Bottom Scrim with Date Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040A]/85 via-[#02040A]/40 to-transparent z-20 flex items-end p-4 pointer-events-none">
          <span className="font-sans font-medium text-[11px] tracking-[0.2em] text-white uppercase">
            {e.dateLabel}
          </span>
        </div>
      </div>

      {/* Event Name Below Image */}
      <h3 className="font-sans font-medium text-[15px] sm:text-[17px] leading-snug text-white group-hover:text-[#3D9BFF] transition-colors line-clamp-2 px-1">
        {e.name}
      </h3>
    </a>
  );
};

const EventCarousel = ({ events }) => {
  const sortedEvents = getSortedEvents(events);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-[100vw] left-1/2 -translate-x-1/2 h-[380px] sm:h-[440px] overflow-hidden mask-edges film-holes">
      <div
        className={`flex gap-[16px] sm:gap-[24px] pt-[20px] sm:pt-[30px] pb-[10px] w-max ${
          shouldReduceMotion ? '' : 'animate-roll hover-pause'
        }`}
      >
        {[...sortedEvents, ...sortedEvents].map((e, index) => (
          <EventCard key={index} e={e} />
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
      <section className="relative w-full h-screen min-h-[720px] md:min-h-[750px] flex flex-col z-10 pt-24 md:pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060C]/90 via-[#04060C]/40 to-transparent w-[95%] md:w-[65%] z-10 pointer-events-none" />


        <SharedContainer className="flex flex-col justify-between h-full w-full relative z-20">
          <div className="flex-1 flex flex-col justify-center w-full relative">
            <div className="w-full max-w-[650px] pb-8 relative z-30">
              {/* Eyebrow / Wordmark + Tag Lockup */}
              <div className="flex items-center gap-3 sm:gap-3.5 mb-4">
                <span className="font-display font-bold text-[12px] sm:text-[13px] tracking-[0.18em] uppercase text-white">
                  CODEHOPPERS
                </span>
                <span className="px-3 py-0.5 rounded-full border border-[#3D9BFF]/40 text-[#8A90A0] text-[9.5px] sm:text-[10px] font-medium tracking-[0.2em] uppercase bg-[#3D9BFF]/5 shrink-0">
                  TECHNICAL CLUB
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-extrabold text-[clamp(42px,8vw,132px)] leading-[0.93] tracking-[-0.01em] mb-5 md:mb-6 flex flex-col drop-shadow-2xl">
                <AnimatedText
                  text="CODE"
                  className="pb-1 md:pb-2"
                  gradientStyle="linear-gradient(90deg, #F4F8FF 0%, #DCE9FF 40%, #3D7BFF 100%)"
                />
                <AnimatedText
                  text="HOPPERS"
                  gradientStyle="linear-gradient(180deg, #FF9C8C 0%, #FF5A4D 45%, #FF3535 100%)"
                />
              </h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-light text-[14px] sm:text-[16px] tracking-[0.08em] sm:tracking-[0.11em] text-white mb-5 md:mb-6"
              >
                Step in as a learner. Step out as a leader.
              </motion.p>

              {/* Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-light text-[13px] sm:text-[14px] leading-[1.4] sm:leading-[1.35] text-[#C9CED8] max-w-[480px] mb-8 md:mb-10 md:whitespace-nowrap"
              >
                A community of like-minded innovators fueled by the power of{' '}
                <br className="hidden md:block" />
                code. From your first line of code to your first big idea — CoHo{' '}
                <br className="hidden md:block" />
                welcomes every student, from every department, to learn, build,{' '}
                <br className="hidden md:block" />
                and grow together.
              </motion.p>

              {/* CTA Button */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
                <Link
                  to="/events"
                  className="group relative inline-flex items-center justify-center gap-2 w-[217px] h-[40px] rounded-full text-[11px] tracking-[0.2em] font-medium text-white uppercase overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(#04060C, #04060C) padding-box, linear-gradient(90deg, #FF6B5E, #3D7BFF) border-box',
                    border: '1px solid transparent',
                  }}
                >
                  <span className="relative z-10">CATCH US IN ACTION</span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B5E] to-[#3D9BFF] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Link>
              </motion.div>
            </div>

            {/* Astronaut */}
            <div className="hidden lg:block absolute left-[48%] top-[24%] w-[clamp(210px,19.5vw,360px)] pointer-events-none z-20">
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
      </section>

      <section id="about" className="relative w-full py-20 md:py-32 flex flex-col justify-center z-10 overflow-hidden scroll-mt-[96px]">
        <SharedContainer className="w-full relative z-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative w-full mb-12 md:mb-16">
            <div className="w-full md:w-[60%] z-20">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-2.5 text-[11px] tracking-[0.25em] mb-4 md:mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A4F] shadow-[0_0_12px_rgba(255,90,79,0.8)] shrink-0" />
                <span className="text-[#C9CED8] uppercase font-medium">ABOUT COHO</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display font-extrabold leading-[0.95] md:leading-[0.9] tracking-tighter text-[clamp(36px,8.5vw,80px)] mb-6 md:mb-8 sm:whitespace-nowrap">
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#8EC4FF] to-[#3D8BFF]">CODE. CREATE.</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FF9A8A] via-[#FF5148] to-[#FF3838]">CONQUER.</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-[#D5DAE6] text-[15px] sm:text-[17px] font-light tracking-[0.04em] leading-[22px] sm:leading-[24px]">
                A community of innovators powered by code.<br className="hidden sm:block"/> Learn. Build. Grow. Together.
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-[225px] absolute right-[8%] top-[18%] opacity-100 z-10 pointer-events-none hidden md:block">
              <div className="w-full h-full relative animate-float" style={{ animationDelay: '1s' }}>
                <img src="/astronaut.webp" alt="Astronaut" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(61,155,255,0.2)]" />
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-x-[40px] gap-y-6 md:gap-y-8 w-full justify-items-start items-start">
            <SciFiCard delay={0.1} title="WORKSHOPS" desc="Hands-on sessions to learn<br/>new tech, tools, and<br/>languages." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="36" height="26" rx="3"/><path d="M2 34h44l-3 5H5z"/><path d="M19 12l-5 6 5 6" stroke="#3D9BFF"/><path d="M29 12l5 6-5 6" stroke="#FF5A4F"/></svg>} accent={<path d="M.5 52V14L14 .5H52M262.5 135v38L249 186.5H211" stroke="#3D9BFF" strokeWidth="1.6" className="group-hover:stroke-[#FF5A4F] transition-colors duration-500" />}/>
            <SciFiCard delay={0.2} title="HACKATHONS" desc="Build real projects under<br/>pressure, as a team." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="12" r="6"/><path d="M12 38c0-8 5-13 12-13s12 5 12 13z"/><circle cx="10" cy="17" r="4.5" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500"/><path d="M2 36c0-6 3-10 8-10"/><circle cx="38" cy="17" r="4.5" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500"/><path d="M46 36c0-6-3-10-8-10" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500"/></svg>} accent={<><path d="M.5 52V14L14 .5H52" stroke="#FF5A4F" strokeWidth="1.6" className="group-hover:stroke-[#B48CFF] transition-colors duration-500" /><path d="M262.5 135v38L249 186.5H211" stroke="#B48CFF" strokeWidth="1.6" className="group-hover:stroke-[#FF5A4F] transition-colors duration-500" /></>}/>
            <SciFiCard delay={0.3} title="TALK SHOWS" desc="Learn from voices in tech,<br/>on your campus." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="2" width="12" height="22" rx="6" stroke="#3D9BFF" className="group-hover:stroke-white transition-colors duration-500"/><path d="M12 20c0 7 5 11 12 11s12-4 12-11M24 31v9M17 40h14"/></svg>} accent={<path d="M.5 52V14L14 .5H52M262.5 135v38L249 186.5H211" stroke="#3D9BFF" strokeWidth="1.6" className="group-hover:stroke-[#FF5A4F] transition-colors duration-500" />}/>
            <SciFiCard delay={0.4} title="CODE FEST" desc="Compete, showcase, and<br/>celebrate code." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3h20v12a10 10 0 0 1-20 0z"/><path d="M14 7H6c0 7 3 10 8 10M34 7h8c0 7-3 10-8 10M24 25v8M16 40h16M18 33h12v7"/><path d="M24 8l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4-2.5-2.4 3.4-.5z" stroke="#FF5A4F" strokeWidth="1" className="group-hover:stroke-white transition-colors duration-500"/></svg>} accent={<path d="M.5 52V14L14 .5H52M262.5 135v38L249 186.5H211" stroke="#FF5A4F" strokeWidth="1.6" className="group-hover:stroke-[#3D9BFF] transition-colors duration-500" />}/>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="mt-12">
            <button className="group relative inline-flex items-center justify-center gap-4 w-[256px] h-[44px] rounded-full border border-transparent text-[11px] tracking-[0.2em] font-medium text-white uppercase overflow-hidden card-hover transition-transform duration-300 hover:scale-105" style={{ background: 'linear-gradient(#04060C, #04060C) padding-box, linear-gradient(90deg, #FF6B5E, #3D9BFF) border-box' }}>
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">CATCH US IN ACTION</span>
              <svg width="16" height="10" viewBox="0 0 18 12" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"><path d="M1 6h15M11 1l5 5-5 5"/></svg>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B5E] to-[#3D9BFF] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </button>
          </motion.div>
        </SharedContainer>
      </section>

      <section id="team" className="relative w-full py-24 md:py-32 flex flex-col justify-center z-10 overflow-hidden scroll-mt-[96px]">
        <SharedContainer className="w-full relative z-20">
          <div className="flex justify-between items-center w-full mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-2.5 text-[11px] tracking-[0.25em] whitespace-nowrap">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A4F] shadow-[0_0_12px_rgba(255,90,79,0.8)] shrink-0" />
              <span className="text-[#C9CED8] uppercase font-medium">OUR TEAM</span>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative w-full aspect-[2.4/1] min-h-[140px] sm:min-h-[220px] md:min-h-[280px] mt-4 group transition-all duration-500 hover:scale-[1.01] hover:drop-shadow-[0_0_30px_rgba(61,155,255,0.4)] cursor-pointer">
            <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#10162A] to-[#080B16]" style={{ clipPath: 'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)' }}>
               <div id="team-fallback-ui" className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-[#8A90A0] text-[11px] tracking-[0.25em] uppercase z-0">
                  <svg width="46" height="40" viewBox="0 0 48 44" fill="none" stroke="#6B7286" strokeWidth="1.4" strokeLinecap="round"><circle cx="24" cy="12" r="6"/><path d="M12 38c0-8 5-13 12-13s12 5 12 13z"/><circle cx="10" cy="17" r="4.5"/><path d="M2 36c0-6 3-10 8-10"/><circle cx="38" cy="17" r="4.5"/><path d="M46 36c0-6-3-10-8-10"/></svg>
                  <span>Team group photo</span>
                  <span className="normal-case text-[10px] tracking-[0.18em] text-[#5E6474]">team_photo.jpg</span>
               </div>
               <img src="/assets/team_photo.jpg" alt="Team Photo" className="absolute inset-0 w-full h-full object-cover object-[center_30%] z-10 opacity-100 transition-all duration-700 ease-out" onLoad={() => { const el = document.getElementById('team-fallback-ui'); if(el) el.style.display='none'; }} onError={(e) => e.target.style.display='none'} />
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
            <Link
              to="/team"
              className="group relative inline-flex items-center justify-center gap-2 w-[216px] h-[44px] rounded-full text-[11px] tracking-[0.2em] font-medium text-white uppercase overflow-hidden transition-transform duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(#04060C, #04060C) padding-box, linear-gradient(90deg, #FF6B5E, #3D9BFF) border-box',
                border: '1px solid transparent',
              }}
            >
              <span className="relative z-10">MEET THE CREW</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B5E] to-[#3D9BFF] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </Link>
          </motion.div>
        </SharedContainer>
      </section>

      <section id="events" className="relative w-full min-h-[720px] max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-16 flex flex-col justify-center z-10 overflow-hidden scroll-mt-[96px]">
        <div className="flex justify-between items-center w-full mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-2.5 text-[11px] tracking-[0.25em] whitespace-nowrap">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A4F] shadow-[0_0_12px_rgba(255,90,79,0.8)] shrink-0" />
            <span className="text-[#C9CED8] uppercase font-medium">EVENTS</span>
          </motion.div>
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

const getRolePriority = (role = '') => {
  const r = role.toLowerCase();
  if (r.includes('lead') && !r.includes('co-lead') && !r.includes('vice')) return 1;
  if (r.includes('co-lead') || r.includes('vice') || r.includes('president')) return 2;
  return 3;
};

const AccordionRow = ({ domain }) => {
  const [activeMemberIndex, setActiveMemberIndex] = useState(null);

  const sortedMembers = [...domain.members].sort(
    (a, b) => getRolePriority(a.role) - getRolePriority(b.role)
  );

  const isSmallGroup = sortedMembers.length < 5;

  return (
    <div className="w-full flex flex-col mb-12 md:mb-[64px]">
      {/* Domain Heading */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A4F] shadow-[0_0_12px_rgba(255,90,79,0.8)] shrink-0" />
        <h3 className="font-display font-extrabold text-[20px] sm:text-[24px] md:text-[28px] uppercase tracking-[0.08em] sm:tracking-[0.12em] text-white leading-tight break-words">
          {domain.domain}
        </h3>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent ml-4 hidden sm:block" />
      </div>

      {/* Accordion Row Container */}
      <div
        className={`w-full flex gap-3.5 md:gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory event-scrollbar ${
          isSmallGroup ? 'justify-start' : 'justify-start md:justify-between'
        }`}
      >
        {sortedMembers.map((member, idx) => {
          const isHovered = activeMemberIndex === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveMemberIndex(idx)}
              onMouseLeave={() => setActiveMemberIndex(null)}
              onClick={() => setActiveMemberIndex(activeMemberIndex === idx ? null : idx)}
              tabIndex={0}
              onFocus={() => setActiveMemberIndex(idx)}
              onBlur={() => setActiveMemberIndex(null)}
              className={`snap-start shrink-0 h-[380px] sm:h-[420px] md:h-[440px] rounded-[14px] overflow-hidden relative group cursor-pointer border border-white/10 bg-[#0a0e1c] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isSmallGroup
                  ? isHovered
                    ? 'w-[260px] sm:w-[300px] md:w-[360px]'
                    : 'w-[200px] sm:w-[220px] md:w-[240px]'
                  : isHovered
                  ? 'w-[260px] sm:w-[280px] md:flex-[3.2] md:min-w-[280px]'
                  : 'w-[190px] sm:w-[210px] md:flex-1 md:min-w-0'
              }`}
            >
              {/* Photo Image */}
              <img
                src={encodeURI(member.image)}
                alt={member.name}
                className="w-full h-full object-cover object-top opacity-100 transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/team_placeholder.jpeg';
                }}
              />

              {/* Text Overlay (Reveals on Hover / Focus / Active) */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-[#04060C]/90 via-[#04060C]/40 to-transparent flex flex-col justify-end p-5 transition-opacity duration-300 pointer-events-none ${
                  isHovered ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100'
                }`}
              >
                <div className="font-sans font-medium text-[16px] sm:text-[18px] text-white leading-snug mb-1">
                  {member.name}
                </div>
                <div className="font-sans font-medium text-[10px] tracking-[0.2em] text-[#FF5A4F] uppercase">
                  {member.role}
                </div>
              </div>

              {/* Default role badge when unhovered */}
              <div
                className={`absolute bottom-3 left-3 right-3 bg-[#04060C]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 transition-opacity duration-300 pointer-events-none ${
                  isHovered ? 'opacity-0' : 'opacity-100 md:group-hover:opacity-0 md:group-focus-within:opacity-0'
                }`}
              >
                <div className="font-sans font-medium text-[12px] sm:text-[13px] text-white truncate">
                  {member.name}
                </div>
                <div className="font-sans font-medium text-[9px] tracking-[0.15em] text-[#8A90A0] uppercase truncate">
                  {member.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#04060C] text-white flex flex-col w-full overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden opacity-35">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center scale-110"
        >
          <source src="/download.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060C]/40 via-transparent to-[#04060C]" />
      </div>

      <div className="relative z-10 w-full flex-1 pt-28 md:pt-32">
        <SharedContainer>
          {/* Back to Home Link */}
          <div className="mb-6 md:mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-[#8A8F98] hover:text-white transition-colors uppercase tracking-[0.2em] text-[11px] font-medium group"
            >
              <div className="w-8 h-8 rounded-full border border-[#8A8F98]/30 flex items-center justify-center group-hover:border-white/60 group-hover:-translate-x-1 transition-all duration-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </div>
              BACK TO HOME
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-12 md:mb-16">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter text-white mb-3 md:mb-4">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A4F] to-[#3D9BFF]">CREW</span>
            </h1>
            <p className="text-[#8A90A0] text-sm md:text-base max-w-xl tracking-wide font-light">
              The brilliant minds behind Code Hoppers, driving innovation, technology, and community.
            </p>
          </div>

          {/* Accordion Rows per Domain */}
          <div className="flex flex-col gap-4 pb-16">
            {TEAM_DOMAINS.map((domain, idx) => (
              <AccordionRow key={idx} domain={domain} />
            ))}
          </div>
        </SharedContainer>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && (
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
      )}
    </>
  );
}
