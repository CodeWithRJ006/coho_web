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

// ── Domain stat row ────────────────────────────────────────────────────────────
const STATS = [
  { value: '40+', label: 'Active Devs' },
  { value: '5',   label: 'Tech Domains' },
  { value: '20+', label: 'Events Shipped' },
  { value: '3',   label: 'Years Strong' },
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

// ── Section Label ──────────────────────────────────────────────────────────────
const SectionLabel = ({ index, label }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-[#546e7a] uppercase mb-8"
  >
    <span className="text-[#FF5A4F]">{'//'}_{String(index).padStart(2, '0')}</span>
    <span className="w-8 h-px bg-white/15" />
    <span>{label}</span>
  </motion.div>
);

// ── Domain Tiles ───────────────────────────────────────────────────────────────
const DOMAINS = [
  {
    tag: 'WEB',
    title: 'Web Dev',
    desc: 'Full-stack engineering, UI/UX, and modern frameworks.',
    accent: '#3D9BFF',
  },
  {
    tag: 'AI',
    title: 'Artificial Intelligence',
    desc: 'Machine learning, computer vision, and data science.',
    accent: '#c792ea',
  },
  {
    tag: 'CLOUD',
    title: 'Cloud & DevOps',
    desc: 'AWS, containers, CI/CD pipelines, and infrastructure.',
    accent: '#00d4cc',
  },
  {
    tag: 'DSA',
    title: 'Algorithms',
    desc: 'Competitive programming, data structures, and problem solving.',
    accent: '#ffcc00',
  },
  {
    tag: 'DESIGN',
    title: 'Design Systems',
    desc: 'Product design, Figma workflows, and design engineering.',
    accent: '#FF5A4F',
  },
];

const DomainTile = ({ domain, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group border border-white/8 hover:border-white/20 transition-colors duration-300 p-5 sm:p-6 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="font-mono text-[9px] tracking-[0.3em] px-2 py-0.5 border font-bold"
          style={{ color: domain.accent, borderColor: `${domain.accent}40` }}
        >
          [{domain.tag}]
        </span>
        <span className="font-mono text-[9px] text-[#2d3342]">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="font-mono font-medium text-[13px] tracking-[0.15em] text-white uppercase mb-2 group-hover:text-[#E4E8F0] transition-colors">
        {domain.title}
      </h3>
      <p className="text-[#546e7a] text-[12px] leading-[1.6] font-sans group-hover:text-[#8A90A0] transition-colors">
        {domain.desc}
      </p>
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
        {/* Bottom scrim with date */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040A]/90 to-transparent z-20 flex items-end p-4 pointer-events-none">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#8A90A0] uppercase">
            {e.dateLabel}
          </span>
        </div>
        {/* Top-right bracket accent */}
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#FF5A4F] z-30 pointer-events-none" />
      </div>
      <h3 className="font-sans font-medium text-[14px] sm:text-[15px] leading-snug text-[#C9CED8] group-hover:text-white transition-colors line-clamp-2 px-1">
        {e.name}
      </h3>
    </a>
  );
};

const EventCarousel = ({ events }) => {
  const sortedEvents = getSortedEvents(events);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-[100vw] left-1/2 -translate-x-1/2 h-[370px] sm:h-[430px] overflow-hidden mask-edges">
      <div
        className={`flex gap-[14px] sm:gap-[20px] pt-[16px] sm:pt-[24px] pb-[10px] w-max ${
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
                >
                  {/*
                    Phase 1 (0 - 1.0s): stroke draws in, fill is transparent = pure outline
                    Phase 2 (1.0 - 1.5s): fill fades in = text solidifies
                    HOPPERS is staggered 0.4s behind CODE
                  */}

                  {/* CODE outline layer (fill=none, draws stroke) */}
                  <motion.text
                    x="4" y="112"
                    fontSize="128"
                    fontFamily="Outfit, Inter, sans-serif"
                    fontWeight="800"
                    letterSpacing="-4"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="3600 3600"
                    initial={{ strokeDashoffset: 3600 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
                  >CODE</motion.text>
                  {/* CODE fill layer (fades in after stroke is done) */}
                  <motion.text
                    x="4" y="112"
                    fontSize="128"
                    fontFamily="Outfit, Inter, sans-serif"
                    fontWeight="800"
                    letterSpacing="-4"
                    fill="white"
                    stroke="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.05 }}
                  >CODE</motion.text>

                  {/* HOPPERS outline layer */}
                  <motion.text
                    x="4" y="234"
                    fontSize="128"
                    fontFamily="Outfit, Inter, sans-serif"
                    fontWeight="800"
                    letterSpacing="-4"
                    fill="none"
                    stroke="#FF5A4F"
                    strokeWidth="1"
                    strokeDasharray="4600 4600"
                    initial={{ strokeDashoffset: 4600 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.55 }}
                  >HOPPERS</motion.text>
                  {/* HOPPERS fill layer */}
                  <motion.text
                    x="4" y="234"
                    fontSize="128"
                    fontFamily="Outfit, Inter, sans-serif"
                    fontWeight="800"
                    letterSpacing="-4"
                    fill="#FF5A4F"
                    stroke="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.65 }}
                  >HOPPERS</motion.text>
                </svg>
              </h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-mono text-[12px] sm:text-[13px] tracking-[0.12em] text-[#C9CED8] mb-4"
              >
                Code. Create. Conquer.
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="text-[13px] sm:text-[14px] leading-[1.65] text-[#8A90A0] max-w-[460px] mb-7 md:mb-8 font-sans"
              >
                A technical club at SMEC where students learn, build, and compete.
                From your first line of code to your first project launch, CoHo
                has a place for every developer.
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.44 }}
                className="flex items-center gap-5 sm:gap-7 mb-8 font-mono"
              >
                {STATS.map((s, i) => (
                  <div key={i} className="flex flex-col items-start">
                    <span className="text-[16px] sm:text-[18px] font-bold text-white">{s.value}</span>
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
                  <svg width="14" height="9" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6h15M11 1l5 5-5 5"/></svg>
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

      {/* ── ABOUT / DOMAINS ────────────────────────────────────────── */}
      <section id="about" className="relative w-full py-24 md:py-32 z-10 scroll-mt-[96px]">
        <SharedContainer>
          <SectionLabel index={1} label="What We Do" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-display font-extrabold text-[clamp(32px,4.5vw,64px)] leading-[1.05] tracking-tight text-white mb-4">
              Five Domains.<br />One Crew.
            </h2>
            <p className="text-[#8A90A0] text-[14px] max-w-[520px] leading-[1.7]">
              CoHo runs five active technical tracks. Join one, join all. We ship
              projects, run workshops, and compete year-round.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-white/5">
            {DOMAINS.map((d, i) => (
              <div key={i} className="bg-[#04060C]">
                <DomainTile domain={d} index={i} />
              </div>
            ))}
          </div>
        </SharedContainer>
      </section>

      {/* ── TEAM ───────────────────────────────────────────────────── */}
      <section id="team" className="relative w-full py-24 md:py-32 z-10 scroll-mt-[96px]">
        <SharedContainer className="w-full relative z-20">
          <SectionLabel index={2} label="The Crew" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,56px)] leading-[1.05] tracking-tight text-white">
              40+ Builders.<br />One Mission.
            </h2>
          </motion.div>

          {/* Team Photo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full aspect-[2.4/1] min-h-[140px] sm:min-h-[220px] md:min-h-[280px] mt-4 group border border-white/8 hover:border-white/18 transition-colors duration-400 cursor-pointer overflow-hidden"
          >
            {/* Fallback */}
            <div id="team-fallback-ui" className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-[#546e7a] text-[11px] tracking-[0.25em] uppercase z-0">
              <svg width="46" height="40" viewBox="0 0 48 44" fill="none" stroke="#546e7a" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="24" cy="12" r="6"/><path d="M12 38c0-8 5-13 12-13s12 5 12 13z"/>
                <circle cx="10" cy="17" r="4.5"/><path d="M2 36c0-6 3-10 8-10"/>
                <circle cx="38" cy="17" r="4.5"/><path d="M46 36c0-6-3-10-8-10"/>
              </svg>
              <span>team_photo.jpg</span>
            </div>
            <img
              src="/assets/team_photo.jpg"
              alt="Team Photo"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%] z-10 opacity-100 transition-transform duration-700 group-hover:scale-[1.02] ease-out"
              onLoad={() => { const el = document.getElementById('team-fallback-ui'); if (el) el.style.display = 'none'; }}
              onError={(e) => e.target.style.display = 'none'}
            />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#3D9BFF] z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#FF5A4F] z-20 pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <SharpButton to="/team" variant="primary">
              Meet the Crew
              <svg width="14" height="9" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6h15M11 1l5 5-5 5"/></svg>
            </SharpButton>
          </motion.div>
        </SharedContainer>
      </section>

      {/* ── EVENTS ─────────────────────────────────────────────────── */}
      <section id="events" className="relative w-full py-24 md:py-32 z-10 scroll-mt-[96px]">
        <SharedContainer className="w-full">
          <SectionLabel index={3} label="Events" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,56px)] leading-[1.05] tracking-tight text-white">
              What We Ship.
            </h2>
            <p className="text-[#8A90A0] text-[14px] mt-3 max-w-[440px] leading-[1.7]">
              Workshops, hackathons, talk shows, and code fests. Something ships every semester.
            </p>
          </motion.div>
        </SharedContainer>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative w-full"
        >
          <EventCarousel events={EVENTS_DATA} />
        </motion.div>

        <SharedContainer className="mt-8">
          <SharpButton to="/events" variant="primary">
            All Events
            <svg width="14" height="9" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6h15M11 1l5 5-5 5"/></svg>
          </SharpButton>
        </SharedContainer>
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
        {/* Dark bottom fade so content stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060C]/10 via-transparent to-[#04060C]/75" style={{ pointerEvents: 'none' }} />
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
