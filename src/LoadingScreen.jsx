import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function CodeRain({ opacity }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * (canvas.height / fontSize)));
    const chars = '01アイウエオカキクケコ<>{}[];:=+#$_!?/\\ABCDEF0123456789';
    const palette = ['#FF5A4F', '#3D9BFF', '#c8deff', '#9B5CF6', '#00d4cc'];

    let animId, lastTime = 0;
    const draw = (t) => {
      animId = requestAnimationFrame(draw);
      if (t - lastTime < 38) return;
      lastTime = t;
      ctx.fillStyle = 'rgba(4,6,12,0.17)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'JetBrains Mono','Courier New',monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.93 ? '#ffffff' : palette[i % palette.length];
        ctx.globalAlpha = Math.random() * 0.5 + 0.3;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        ctx.globalAlpha = 1;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.87) drops[i] = 0;
        drops[i]++;
      }
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ opacity }} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const BOOT_STEPS = [
  { tag: 'ORBIT',   msg: 'acquiring orbital lock... LEO-4 // ALT: 420 km',        color: '#3D9BFF' },
  { tag: 'SIGNAL',  msg: 'handshake with SMEC ground relay — signal: 98.2%',       color: '#3D9BFF' },
  { tag: 'SCAN',    msg: 'env probe: port 443/TLS · 22/SSH · 3000/COHO_RUNTIME',  color: '#9B5CF6' },
  { tag: 'AUTH',    msg: 'validating student operator credentials... uid=coho',     color: '#9B5CF6' },
  { tag: 'KERNEL',  msg: 'loading core runtime kernel v2.4.1-hacker',              color: '#3D9BFF' },
  { tag: 'INJECT',  msg: 'injecting passion_module.bin → heap 0x7FF4A8C0',         color: '#FF5A4F' },
  { tag: 'DOMAIN',  msg: 'indexing domains: Web · AI · Cloud · DSA · Design',     color: '#FF5A4F' },
  { tag: 'CREW',    msg: 'loading 40 active developer threads... SYNC COMPLETE',   color: '#3D9BFF' },
  { tag: 'COMPILE', msg: 'compiling values: Code · Build · Innovate · Conquer',   color: '#9B5CF6' },
  { tag: 'MOUNT',   msg: 'mounting /coho/events /coho/team /coho/domains',         color: '#3D9BFF' },
  { tag: 'INIT',    msg: 'platform runtime initialized — CoHo v2.0 is live',      color: '#00d4cc' },
  { tag: 'READY',   msg: 'SYSTEMS NOMINAL. WELCOME TO CODE HOPPERS.',             color: '#00d4cc' },
];

function OrbitalReticle({ isReady }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" fill="none"
        animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}>
        <ellipse cx="200" cy="150" rx="185" ry="130" stroke="rgba(61,155,255,0.18)" strokeWidth="1" strokeDasharray="6 8" />
        <circle cx="200" cy="20"  r="3" fill="#3D9BFF" opacity="0.6" />
        <circle cx="200" cy="280" r="3" fill="#FF5A4F" opacity="0.6" />
      </motion.svg>
      <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" fill="none"
        animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
        <ellipse cx="200" cy="150" rx="100" ry="70" stroke="rgba(155,92,246,0.22)" strokeWidth="1" strokeDasharray="4 10" />
        <circle cx="300" cy="150" r="2.5" fill="#9B5CF6" opacity="0.7" />
      </motion.svg>
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#3D9BFF]" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#3D9BFF]" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF5A4F]" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF5A4F]" />
    </div>
  );
}

export function LoadingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hexTick, setHexTick] = useState('0x3F00A4');

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onComplete(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onComplete]);

  useEffect(() => {
    const id = setInterval(() => {
      setHexTick('0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0'));
    }, 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cur = 0;
    const interval = setInterval(() => {
      cur++;
      setStep(cur);
      setProgress(Math.min(Math.round((cur / BOOT_STEPS.length) * 100), 100));
      if (cur >= BOOT_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setIsReady(true), 80);
        setTimeout(() => onComplete(), 1000);
      }
    }, 175);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-between bg-[#04060C] px-4 py-5 overflow-hidden select-none">

      <CodeRain opacity={0.45} />

      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 15% 10%, rgba(155,92,246,0.13) 0%, transparent 55%), radial-gradient(ellipse 55% 50% at 85% 85%, rgba(61,155,255,0.14) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 50% 50%, rgba(4,6,12,0.7) 0%, transparent 80%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.88) 100%)' }} />

      {/* TOP HUD */}
      <div className="relative z-10 w-full max-w-4xl flex justify-between items-center font-mono text-[10px] sm:text-[11px] text-[#546e7a] border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A4F] animate-pulse inline-block" />
          <span className="text-[#D5DAE6] font-bold tracking-widest">COHO_STATION</span>
          <span className="text-[#30363d]">//</span>
          <span className="text-[#FF5A4F]">BOOT_v2.4</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">ORB: LEO-4</span>
          <span className="hidden lg:inline text-[#30363d]">//</span>
          <span className="hidden lg:inline">LAT:12.9N LON:80.2E</span>
          <span className="text-[#30363d]">//</span>
          <span className="text-[#3D9BFF]">{hexTick}</span>
          <span className="text-[10px] border border-[#2d3342] px-2 py-0.5 hover:text-white cursor-pointer transition-colors" onClick={onComplete}>[ESC SKIP]</span>
        </div>
      </div>

      {/* CENTER */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-2xl">
        <div className="relative w-72 h-48 sm:w-96 sm:h-64 md:w-[480px] md:h-72 flex items-center justify-center">
          <OrbitalReticle isReady={isReady} />
          <img src="/assets/hero_logo.png" alt="CoHo" className="relative z-10 w-48 sm:w-64 md:w-80 object-contain transition-all duration-700"
            style={{ filter: isReady ? 'drop-shadow(0 0 28px rgba(61,155,255,0.55)) drop-shadow(0 0 55px rgba(155,92,246,0.3))' : 'drop-shadow(0 0 20px rgba(255,90,79,0.3)) drop-shadow(0 0 40px rgba(61,155,255,0.2))' }} />
          {!isReady && (
            <motion.div className="absolute left-0 right-0 h-px pointer-events-none z-20"
              style={{ background: 'linear-gradient(90deg, transparent, #FF5A4F, transparent)', boxShadow: '0 0 8px #FF5A4F, 0 0 18px #FF5A4F' }}
              animate={{ top: ['20%', '80%', '20%'] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }} />
          )}
        </div>

        <AnimatePresence>
          {isReady && (
            <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="absolute flex flex-col items-center gap-3 px-8 py-6 bg-[#04060C] border border-[#3D9BFF] z-30"
              style={{ boxShadow: '0 0 50px rgba(61,155,255,0.5), 0 0 20px rgba(155,92,246,0.3)' }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <motion.circle cx="28" cy="28" r="24" stroke="#3D9BFF" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} />
                <motion.path d="M17 28.5L24.5 36L39 21" stroke="#00d4cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }} />
              </svg>
              <div className="font-mono font-black text-lg sm:text-xl tracking-[0.3em] text-[#3D9BFF] uppercase">SYSTEMS ONLINE</div>
              <div className="font-mono text-[10px] text-[#546e7a] tracking-[0.25em] uppercase">CoHo Platform Ready // Port 3000</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TERMINAL */}
        <div className="w-full max-w-xl sm:max-w-2xl mt-4 px-2 sm:px-4">
          <div className="flex justify-between items-center font-mono text-[11px] sm:text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#FF5A4F] font-bold">&gt;</span>
              <span className={isReady ? 'text-[#3D9BFF] font-bold' : 'text-[#D5DAE6]'}>
                {isReady ? 'STATUS: ONLINE' : 'INITIALIZING PLATFORM...'}
              </span>
            </div>
            <div className="text-[#546e7a] font-mono">[<span className={progress === 100 ? 'text-[#3D9BFF] font-bold' : 'text-white'}>{progress}%</span>]</div>
          </div>

          <div className="w-full h-[3px] bg-[#0d101a] border border-white/5 overflow-hidden mb-3">
            <motion.div className="h-full" transition={{ ease: 'easeOut', duration: 0.12 }}
              style={{ width: `${progress}%`, background: isReady ? 'linear-gradient(90deg, #3D9BFF, #00d4cc)' : 'linear-gradient(90deg, #FF5A4F, #3D9BFF)', boxShadow: isReady ? '0 0 12px rgba(61,155,255,0.8)' : '0 0 12px rgba(255,90,79,0.7)' }} />
          </div>

          <div className="bg-[#07080e] border border-white/5 p-3 sm:p-4 h-32 sm:h-36 flex flex-col justify-end overflow-hidden font-mono text-[10px] sm:text-[11px]">
            <div className="space-y-1">
              {BOOT_STEPS.slice(0, step).slice(-5).map((s, idx) => (
                <div key={idx} className="flex items-center gap-2 truncate">
                  <span className="font-bold shrink-0 px-1 py-0.5 border text-[9px]" style={{ color: s.color, borderColor: `${s.color}35` }}>[{s.tag}]</span>
                  <span className="text-[#8A90A0] truncate">{s.msg}</span>
                </div>
              ))}
              {step < BOOT_STEPS.length && (
                <div className="flex items-center gap-2 text-[#546e7a]">
                  <span className="text-[#FF5A4F] animate-pulse">▶</span>
                  <span className="animate-pulse">loading subsystems...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM HUD */}
      <div className="relative z-10 w-full max-w-4xl flex justify-between items-center font-mono text-[10px] sm:text-[11px] text-[#546e7a] border-t border-white/5 pt-2">
        <span>SMEC // CODE HOPPERS // HYDERABAD</span>
        <span className="hidden sm:inline">SIGNAL: 98.2% // NODE: COHO_CORE // PORT: 3000</span>
      </div>
    </motion.div>
  );
}
