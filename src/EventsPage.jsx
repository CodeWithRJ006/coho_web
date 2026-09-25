import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EVENTS_DATA, isUpcomingEvent, getEventLink } from './eventsData';
import SharedContainer from './components/SharedContainer';
import Footer from './components/Footer';

const FeaturedEventCard = ({ event }) => {
  const targetUrl = getEventLink(event);

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0e1c]/80 backdrop-blur-sm p-4 sm:p-5 md:p-6 transition-all duration-250 ease-out hover:scale-[1.02] hover:border-[#3D9BFF]/50 hover:shadow-[0_0_24px_rgba(61,155,255,0.25)] mb-8 md:mb-12"
    >
      <div
        className="relative w-full h-[240px] sm:h-[320px] md:h-[420px] overflow-hidden bg-[#070a14] mb-4 border border-white/5 flex items-center justify-center"
        style={{ clipPath: 'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)' }}
      >
        {/* Subtle blurred backdrop fill matching poster colors */}
        <img
          src={event.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-25 scale-110 pointer-events-none"
        />
        <img
          src={event.image}
          alt={event.name}
          className="relative z-10 max-w-full max-h-full w-full h-full object-contain opacity-100 saturate-100 transition-transform duration-500 group-hover:scale-105"
          onError={(err) => { err.target.style.display = 'none'; }}
        />
      </div>

      <div className="flex flex-col">
        <span className="font-sans font-medium text-[11px] tracking-[0.2em] text-[#FF5A4F] uppercase mb-1">
          {event.dateLabel}
        </span>
        <h2 className="font-display font-extrabold text-[22px] sm:text-[28px] md:text-[32px] uppercase leading-tight text-white group-hover:text-[#3D9BFF] transition-colors">
          {event.name}
        </h2>
      </div>
    </a>
  );
};

const GridEventCard = ({ event }) => {
  const isUpcoming = isUpcomingEvent(event);
  const targetUrl = getEventLink(event);

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0e1c]/80 backdrop-blur-sm p-4 md:p-5 transition-all duration-250 ease-out hover:scale-[1.02] hover:border-[#3D9BFF]/50 hover:shadow-[0_0_24px_rgba(61,155,255,0.25)]"
    >
      <div
        className="relative w-full h-[220px] sm:h-[260px] md:h-[320px] overflow-hidden bg-[#070a14] border border-white/5 flex items-center justify-center"
        style={{ clipPath: 'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)' }}
      >
        {/* Subtle blurred backdrop fill matching poster colors */}
        <img
          src={event.image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 pointer-events-none ${
            isUpcoming ? 'opacity-25' : 'opacity-15 grayscale-[40%]'
          }`}
        />
        <img
          src={event.image}
          alt={event.name}
          className={`relative z-10 max-w-full max-h-full w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
            isUpcoming ? 'opacity-100 saturate-100' : 'opacity-90 grayscale-[40%]'
          }`}
          onError={(err) => { err.target.style.display = 'none'; }}
        />
      </div>

      <div className="flex flex-col mt-3">
        <h3 className="font-display font-extrabold text-[20px] sm:text-[24px] md:text-[26px] uppercase leading-tight text-white group-hover:text-[#3D9BFF] transition-colors mb-1">
          {event.name}
        </h3>
        <span className="font-sans font-medium text-[11px] tracking-[0.2em] text-[#FF5A4F] uppercase">
          {event.dateLabel}
        </span>
      </div>
    </a>
  );
};

export const EventsPage = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  const upcomingEvents = EVENTS_DATA.filter(isUpcomingEvent);
  const pastEvents = EVENTS_DATA.filter(e => !isUpcomingEvent(e)).sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

  const hasFeatured = upcomingEvents.length === 1;
  const featuredEvent = hasFeatured ? upcomingEvents[0] : null;
  const gridEvents = hasFeatured
    ? [...upcomingEvents.slice(1), ...pastEvents]
    : [...upcomingEvents, ...pastEvents];

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

      <div className="relative z-10 w-full flex-1 pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20">
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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 md:mb-12 text-center"
          >
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter text-white mb-3 md:mb-4">
              COHO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A4F] to-[#3D9BFF]">EVENTS</span>
            </h1>
            <p className="text-[#8A90A0] max-w-2xl mx-auto tracking-wide font-light text-sm md:text-base">
              From workshops to hackathons, here's what we've been up to.
            </p>
          </motion.div>

          {/* Featured Card (if exactly 1 upcoming event) */}
          {hasFeatured && featuredEvent && (
            <FeaturedEventCard event={featuredEvent} />
          )}

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
            {gridEvents.map((event, index) => (
              <GridEventCard key={index} event={event} />
            ))}
          </div>
        </SharedContainer>
      </div>

      <Footer />
    </div>
  );
};
