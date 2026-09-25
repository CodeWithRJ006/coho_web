import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { LoadingScreen } from './LoadingScreen';
import { ChevronDown } from 'lucide-react';
import Logo from './components/Logo';
import { Routes, Route, Link } from 'react-router-dom';
import { TEAM_DOMAINS } from './teamData';
import { EVENTS_DATA, getSortedEvents, getEventLink, isUpcomingEvent } from './eventsData';
import { EventsPage } from './EventsPage';

import SharedContainer from './components/SharedContainer';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

// Background matrix rain that overlays the space video
function BackgroundCodeRain({ opacity = 0.22 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * (canvas.height / fontSize))
    );
    const chars = "0101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[];:=+*#$_!?/\\";
    const palette = ['#00ff88', '#00aaff', '#FF5A4F', '#3D9BFF', '#c8e0ff'];

    let animId, lastTime = 0;
    const draw = (currentTime) => {
      animId = requestAnimationFrame(draw);
      if (currentTime - lastTime < 32) return;
      lastTime = currentTime;

      ctx.fillStyle = 'rgba(4, 6, 12, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'JetBrains Mono', 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const isHead = Math.random() > 0.92;
        ctx.fillStyle = isHead ? '#ffffff' : palette[i % palette.length];
        ctx.fillText(char, x, y);
        if (y > canvas.height && Math.random() > 0.87) drops[i] = 0;
        drops[i]++;
      }
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity, position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}


// ── Typing Terminal Component ──────────────────────────────────────────────────

// ── Typewriter Text Component ──────────────────────────────────────────────────
function Typewriter({
  text,
  delay = 0,
  speed = 28,
  className = "",
  showCursor = true,
  cursorChar = "▌",
  onComplete,
}) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayed(text);
      setIsDone(true);
      return;
    }

    let intervalId;
    const startTimer = setTimeout(() => {
      let index = 0;
      intervalId = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setIsDone(true);
          if (onComplete) onComplete();
        }
      }, speed);
    }, delay * 1000);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay, speed, onComplete, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {displayed}
      {showCursor && !isDone && (
        <span className="inline-block animate-pulse text-[#FF5A4F] ml-0.5 font-mono font-normal">
          {cursorChar}
        </span>
      )}
    </span>
  );
}

// ── Domain stat row ────────────────────────────────────────────────────────────
const STATS = [
  { value: '40+', label: 'Active Devs' },
  { value: '5', label: 'Tech Domains' },
  { value: '20+', label: 'Events Shipped' },
  { value: '3', label: 'Years Strong' },
];

// ── Sharp CTA Button ───────────────────────────────────────────────────────────
const SharpButton = ({ children, href, to, onClick, variant = 'primary', className = '' }) => {
  const cls = [
    'inline-flex items-center gap-3 px-6 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-200',
    variant === 'primary'
      ? 'border border-[#FF5A4F] text-[#FF5A4F] hover:bg-[#FF5A4F] hover:text-[#04060C]'
      : 'border border-white/20 text-white hover:border-white hover:text-white',
    className,
  ].join(' ');

  if (to) {
    return <Link to={to} className={cls}>{children}</Link>;
  }
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  }
  return <button onClick={onClick} className={cls}>{children}</button>;
};

// ── SciFiCard from ui-overhaul ─────────────────────────────────────────────────
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

// ── Event Card ─────────────────────────────────────────────────────────────────
const EventCard = ({ e }) => {
  const targetUrl = getEventLink(e);

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex-none w-[240px] sm:w-[290px] block group mb-4"
    >
      <div
        className="relative w-[240px] sm:w-[290px] h-[270px] sm:h-[320px] overflow-hidden bg-[#0b0f1e] mb-3 border border-white/8 group-hover:border-white/20 transition-colors duration-300"
      >
        <img
          src={e.image}
          alt={e.name}
          className="absolute inset-0 w-full h-full object-cover z-10 opacity-100 transition-transform duration-500 group-hover:scale-105"
          onError={(err) => { err.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040A]/90 to-transparent z-20 flex items-end p-4 pointer-events-none">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#8A90A0] uppercase">
            {e.dateLabel}
          </span>
        </div>
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#FF5A4F] z-30 pointer-events-none" />
      </div>
      <h3 className="font-sans font-medium text-[14px] sm:text-[15px] leading-snug text-[#C9CED8] group-hover:text-white transition-colors line-clamp-2 px-1">
        {e.name}
      </h3>
    </a>
  );
};

// ── Event Carousel ─────────────────────────────────────────────────────────────
const EventCarousel = ({ events }) => {
  const sortedEvents = getSortedEvents(events);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-[100vw] left-1/2 -translate-x-1/2 h-[370px] sm:h-[430px] overflow-hidden mask-edges">
      <div
        className={`flex gap-[14px] sm:gap-[20px] pt-[16px] sm:pt-[24px] pb-[10px] w-max ${shouldReduceMotion ? '' : 'animate-roll hover-pause'
          }`}
      >
        {[...sortedEvents, ...sortedEvents].map((e, index) => (
          <EventCard key={index} e={e} />
        ))}
      </div>
    </div>
  );
};

// ── Home Page ──────────────────────────────────────────────────────────────────
const Home = () => {
  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative w-full h-screen min-h-[700px] md:min-h-[740px] flex flex-col z-10 pt-24 md:pt-28 overflow-hidden">


        <SharedContainer className="flex flex-col justify-between h-full w-full relative z-20">
          <div className="flex-1 flex items-center w-full">

            {/* Left: Text block */}
            <div className="w-full max-w-[680px] pb-8 relative z-30">

              {/* Terminal prompt eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-mono text-[11px] tracking-[0.2em] text-[#00d4cc] mb-4 flex items-center gap-2"
              >
                <span>&gt;_</span>
                <span>coho@smec:~$</span>
                <span className="text-[#546e7a]">./run platform</span>
              </motion.div>

              {/* Headline - ECell-style outline stroke draw-in, then fill solidifies */}
              <h1 className="mb-5 md:mb-6 leading-none" aria-label="Code Hoppers">
                <svg
                  viewBox="0 0 720 240"
                  className="w-full max-w-[min(720px,92vw)]"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  overflow="visible"
                  style={{ filter: 'drop-shadow(0 2px 18px rgba(4,6,12,0.95))' }}
                >
                  {/*
                    Phase 1 (t=0.8s - 1.95s): CODE and HOPPERS stroke outlines write in AT THE SAME TIME
                    (waits until loading screen fade-out finishes)
                    Phase 2 (t=1.95s): CODE fill immediately floods in
                    Phase 3 (t=2.45s): HOPPERS fill floods in after a 0.5s delay
                  */}

                  {/* CODE outline layer - simultaneous stroke write-in */}
                  <motion.text
                    x="4" y="110"
                    fontSize="126"
                    fontFamily="'Space Grotesk', sans-serif"
                    fontWeight="700"
                    letterSpacing="-2"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeDasharray="3600 3600"
                    initial={{ strokeDashoffset: 3600 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 7, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
                  >CODE</motion.text>
                  {/* CODE fill layer - floods in right when stroke completes */}
                  <motion.text
                    x="4" y="110"
                    fontSize="126"
                    fontFamily="'Space Grotesk', sans-serif"
                    fontWeight="700"
                    letterSpacing="-2"
                    fill="#FFFFFF"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                  >CODE</motion.text>

                  {/* HOPPERS outline layer - writes at the EXACT SAME TIME as CODE */}
                  <motion.text
                    x="4" y="230"
                    fontSize="126"
                    fontFamily="'Space Grotesk', sans-serif"
                    fontWeight="700"
                    letterSpacing="-2"
                    fill="none"
                    stroke="#FF5A4F"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeDasharray="4600 4600"
                    initial={{ strokeDashoffset: 4600 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 7, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
                  >HOPPERS</motion.text>
                  {/* HOPPERS fill layer - 0.5s delay before fill floods in */}
                  <motion.text
                    x="4" y="230"
                    fontSize="126"
                    fontFamily="'Space Grotesk', sans-serif"
                    fontWeight="700"
                    letterSpacing="-2"
                    fill="#FF5A4F"
                    stroke="#FF5A4F"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.55 }}
                  >HOPPERS</motion.text>
                </svg>
              </h1>

              {/* Tagline - Typewriter animation starting as headline fills */}
              <p
                className="font-mono text-[12px] sm:text-[13px] tracking-[0.12em] text-white mb-4 min-h-[20px]"
                style={{ textShadow: '0 1px 12px rgba(4,6,12,1)' }}
              >
                <Typewriter
                  text="Code. Create. Conquer."
                  delay={1.8}
                  speed={34}
                  showCursor={true}
                  cursorChar="▌"
                />
              </p>

              {/* Description - Typewriter stream animation flowing in right after tagline */}
              <p
                className="text-[13px] sm:text-[14px] leading-[1.65] text-[#B8BEC9] max-w-[460px] mb-7 md:mb-8 font-sans min-h-[66px]"
                style={{ textShadow: '0 1px 10px rgba(4,6,12,1)' }}
              >
                <Typewriter
                  text="A technical club at SMEC where students learn, build, and compete. From your first line of code to your first project launch, CoHo has a place for every developer."
                  delay={2.6}
                  speed={16}
                  showCursor={true}
                  cursorChar="▌"
                />
              </p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.44 }}
                className="flex items-center gap-5 sm:gap-7 mb-8 font-mono"
              >
                {STATS.map((s, i) => (
                  <div key={i} className="flex flex-col items-start">
                    <span className="text-[16px] sm:text-[18px] font-bold text-white" style={{ textShadow: '0 1px 8px rgba(4,6,12,1)' }}>{s.value}</span>
                    <span className="text-[9px] tracking-[0.18em] text-[#546e7a] uppercase">{s.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.56 }}
                className="flex items-center gap-4 flex-wrap"
              >
                <SharpButton to="/events" variant="primary">
                  See Events
                  <svg width="14" height="9" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6h15M11 1l5 5-5 5" /></svg>
                </SharpButton>
                <SharpButton to="/team" variant="secondary">
                  Meet the Crew
                </SharpButton>
              </motion.div>
            </div>

          </div>

          {/* Scroll hint */}
          <div className="flex items-center gap-4 pb-10 md:pb-12" onClick={scrollToNext}>
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#546e7a] uppercase hidden md:block">Scroll</span>
            <motion.button
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-8 h-8 border border-[#FF5A4F]/50 flex items-center justify-center text-[#FF5A4F] hover:bg-[#FF5A4F] hover:text-[#04060C] transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
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
                A community of innovators powered by code.<br className="hidden sm:block" /> Learn. Build. Grow. Together.
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-[225px] absolute right-[8%] top-[18%] opacity-100 z-10 pointer-events-none hidden md:block">
              <div className="w-full h-full relative animate-float" style={{ animationDelay: '1s' }}>
                <img src="/astronaut.webp" alt="Astronaut" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(61,155,255,0.2)]" />
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-x-[40px] gap-y-6 md:gap-y-8 w-full justify-items-start items-start">
            <SciFiCard delay={0.1} title="WORKSHOPS" desc="Hands-on sessions to learn<br/>new tech, tools, and<br/>languages." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="36" height="26" rx="3" /><path d="M2 34h44l-3 5H5z" /><path d="M19 12l-5 6 5 6" stroke="#3D9BFF" /><path d="M29 12l5 6-5 6" stroke="#FF5A4F" /></svg>} accent={<path d="M.5 52V14L14 .5H52M262.5 135v38L249 186.5H211" stroke="#3D9BFF" strokeWidth="1.6" className="group-hover:stroke-[#FF5A4F] transition-colors duration-500" />} />
            <SciFiCard delay={0.2} title="HACKATHONS" desc="Build real projects under<br/>pressure, as a team." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="12" r="6" /><path d="M12 38c0-8 5-13 12-13s12 5 12 13z" /><circle cx="10" cy="17" r="4.5" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500" /><path d="M2 36c0-6 3-10 8-10" /><circle cx="38" cy="17" r="4.5" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500" /><path d="M46 36c0-6-3-10-8-10" stroke="#FF5A4F" className="group-hover:stroke-[#B48CFF] transition-colors duration-500" /></svg>} accent={<><path d="M.5 52V14L14 .5H52" stroke="#FF5A4F" strokeWidth="1.6" className="group-hover:stroke-[#B48CFF] transition-colors duration-500" /><path d="M262.5 135v38L249 186.5H211" stroke="#B48CFF" strokeWidth="1.6" className="group-hover:stroke-[#FF5A4F] transition-colors duration-500" /></>} />
            <SciFiCard delay={0.3} title="TALK SHOWS" desc="Learn from voices in tech,<br/>on your campus." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="2" width="12" height="22" rx="6" stroke="#3D9BFF" className="group-hover:stroke-white transition-colors duration-500" /><path d="M12 20c0 7 5 11 12 11s12-4 12-11M24 31v9M17 40h14" /></svg>} accent={<path d="M.5 52V14L14 .5H52M262.5 135v38L249 186.5H211" stroke="#3D9BFF" strokeWidth="1.6" className="group-hover:stroke-[#FF5A4F] transition-colors duration-500" />} />
            <SciFiCard delay={0.4} title="CODE FEST" desc="Compete, showcase, and<br/>celebrate code." icon={<svg width="48" height="44" viewBox="0 0 48 44" fill="none" stroke="#E8ECF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3h20v12a10 10 0 0 1-20 0z" /><path d="M14 7H6c0 7 3 10 8 10M34 7h8c0 7-3 10-8 10M24 25v8M16 40h16M18 33h12v7" /><path d="M24 8l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4-2.5-2.4 3.4-.5z" stroke="#FF5A4F" strokeWidth="1" className="group-hover:stroke-white transition-colors duration-500" /></svg>} accent={<path d="M.5 52V14L14 .5H52M262.5 135v38L249 186.5H211" stroke="#FF5A4F" strokeWidth="1.6" className="group-hover:stroke-[#3D9BFF] transition-colors duration-500" />} />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="mt-12">
            <button className="group relative inline-flex items-center justify-center gap-4 w-[256px] h-[44px] rounded-full border border-transparent text-[11px] tracking-[0.2em] font-medium text-white uppercase overflow-hidden card-hover transition-transform duration-300 hover:scale-105" style={{ background: 'linear-gradient(#04060C, #04060C) padding-box, linear-gradient(90deg, #FF6B5E, #3D9BFF) border-box' }}>
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">CATCH US IN ACTION</span>
              <svg width="16" height="10" viewBox="0 0 18 12" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"><path d="M1 6h15M11 1l5 5-5 5" /></svg>
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
                <svg width="46" height="40" viewBox="0 0 48 44" fill="none" stroke="#6B7286" strokeWidth="1.4" strokeLinecap="round"><circle cx="24" cy="12" r="6" /><path d="M12 38c0-8 5-13 12-13s12 5 12 13z" /><circle cx="10" cy="17" r="4.5" /><path d="M2 36c0-6 3-10 8-10" /><circle cx="38" cy="17" r="4.5" /><path d="M46 36c0-6-3-10-8-10" /></svg>
                <span>Team group photo</span>
                <span className="normal-case text-[10px] tracking-[0.18em] text-[#5E6474]">team_photo.jpg</span>
              </div>
              <img src="/assets/team_photo.jpg" alt="Team Photo" className="absolute inset-0 w-full h-full object-cover object-[center_30%] z-10 opacity-100 transition-all duration-700 ease-out" onLoad={() => { const el = document.getElementById('team-fallback-ui'); if (el) el.style.display = 'none'; }} onError={(e) => e.target.style.display = 'none'} />
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
            <svg width="16" height="10" viewBox="0 0 18 12" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"><path d="M1 6h15M11 1l5 5-5 5" /></svg>

            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B5E] to-[#3D9BFF] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </Link>
        </motion.div>
      </section>

      <Footer />
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
                  <path d="M19 12H5M12 19l-7-7 7-7" />
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
        <motion.div
          className="bg-[#04060C] text-white relative selection:bg-[#FF5A4F]/30 selection:text-white flex flex-col w-full min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >

          <Navbar />

          <div className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-70 md:opacity-90 scale-110">
              <source src="/download.mp4" type="video/mp4" />
            </video>
            {/* Matrix rain overlay above video, below content */}
            <BackgroundCodeRain opacity={0.38} />
            {/* Dark fade overlay for bottom readability */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, transparent 45%, rgba(4,6,12,0.85) 100%)', pointerEvents: 'none' }} />
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
        </motion.div>
      )}
    </>
  );
}
