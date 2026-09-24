import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle } from 'lucide-react';
import { EVENTS_DATA } from './eventsData';
import SharedContainer from './components/SharedContainer';
import Footer from './components/Footer';

const EventCardLarge = ({ event, index }) => {
  const isUpcoming = event.status === 'upcoming';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-white/5 bg-[#0a0e1c]/80 backdrop-blur-sm overflow-hidden hover:bg-[#10162a]/90 transition-colors duration-500"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${event.colorStart}, transparent 70%)` }}
      />

      {/* Poster */}
      <div className="relative w-full md:w-[280px] h-[300px] shrink-0 rounded-xl overflow-hidden border border-white/10 z-10">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-20">
          {isUpcoming ? (
            <span className="bg-[#FF5A4F] text-white text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-full shadow-lg">
              Registration Open
            </span>
          ) : (
            <span className="bg-[#10162A]/90 text-white/70 text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/10 backdrop-blur-md">
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center flex-1 z-10 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-2 h-2 rounded-full ${isUpcoming ? 'bg-[#FF5A4F] shadow-[0_0_10px_#FF5A4F]' : 'bg-[#8A90A0]'}`} />
          <span className={`text-[12px] tracking-[0.2em] font-medium uppercase ${isUpcoming ? 'text-[#FF5A4F]' : 'text-[#8A90A0]'}`}>
            {event.dateLabel}
          </span>
        </div>

        <h2 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight text-white mb-2 group-hover:text-[#3D9BFF] transition-colors">
          {event.name}
        </h2>

        <p className="text-[14px] tracking-[0.1em] text-[#8A90A0] uppercase font-medium mb-8">
          {event.tag}
        </p>

        <div className="mt-auto">
          {isUpcoming ? (
            <a
              href={event.registrationLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FF5A4F] text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#FF5A4F]/90 transition-colors shadow-[0_0_20px_rgba(255,90,79,0.3)] hover:shadow-[0_0_30px_rgba(255,90,79,0.5)]"
            >
              REGISTER NOW
              <ArrowUpRight className="w-4 h-4" />
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[#8A90A0] text-[11px] font-bold tracking-[0.15em] uppercase cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              CONCLUDED
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const EventsPage = () => {
  const upcomingEvents = EVENTS_DATA.filter(e => e.status === 'upcoming');
  const pastEvents = EVENTS_DATA.filter(e => e.status === 'concluded');

  return (
    <div className="min-h-screen pt-32 pb-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter text-white mb-4">
          COHO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A4F] to-[#3D9BFF]">EVENTS</span>
        </h1>
        <p className="text-[#8A90A0] max-w-2xl mx-auto tracking-wide font-light">
          Join us in our upcoming hackathons, workshops, and tech talks. Discover what we've been up to.
        </p>
      </motion.div>

      {upcomingEvents.length > 0 && (
        <div className="mb-20">
          <h3 className="text-white font-display font-bold text-2xl tracking-wide uppercase border-b border-white/10 pb-4 mb-8">
            Upcoming Events
          </h3>
          <div className="flex flex-col gap-6">
            {upcomingEvents.map((event, i) => (
              <EventCardLarge key={i} event={event} index={i} />
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-white font-display font-bold text-2xl tracking-wide uppercase border-b border-white/10 pb-4 mb-8 opacity-80">
            Past Events
          </h3>
          <div className="flex flex-col gap-6">
            {pastEvents.map((event, i) => (
              <EventCardLarge key={i} event={event} index={i + upcomingEvents.length} />
            ))}
          </div>
        </div>
      )}

      <SharedContainer>
        <Footer />
      </SharedContainer>
    </div>
  );
};
