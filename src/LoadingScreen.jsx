import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function CodeRain({ opacity = 0.70 }) {
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
    const chars = "0101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[];:=+*#$_!?/\\アイウエオカキクケコサシスセソタツテトナニヌネハヒフヘホマミムメモヤユヨラリルレワヲン";
    const palette = ['#00ff88', '#00aaff', '#FF5A4F', '#3D9BFF', '#c8e0ff', '#8b6fcc', '#00d4cc'];

    let animId, lastTime = 0;
    const draw = (currentTime) => {
      animId = requestAnimationFrame(draw);
      if (currentTime - lastTime < 28) return; // ~35 fps fast and fluid
      lastTime = currentTime;

      // Dark fade trail
      ctx.fillStyle = 'rgba(4, 6, 12, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'JetBrains Mono', 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const isHead = Math.random() > 0.88;
        ctx.fillStyle = isHead ? '#ffffff' : palette[i % palette.length];
        ctx.shadowColor = isHead ? '#ffffff' : palette[i % palette.length];
        ctx.shadowBlur = isHead ? 6 : 2;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.86) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.shadowBlur = 0;
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
      style={{ opacity }}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// 22 Extended Fast-Paced Hacker Breach Steps
const BREACH_STEPS = [
  { tag: 'CONNECT',   msg: 'establishing encrypted socket -> gateway.smec.ac.in:443', color: '#00aaff' },
  { tag: 'HANDSHAKE', msg: 'SYN/ACK received // cipher: AES-256-GCM authenticated',   color: '#00aaff' },
  { tag: 'ORBIT',     msg: 'telemetry lock: LEO-4 // ALT: 420.4 km // LAT: 12.9°N',    color: '#3D9BFF' },
  { tag: 'SCAN',      msg: 'port scan: 22/SSH, 80/HTTP, 443/TLS, 3000/COHO_CORE',      color: '#ffcc00' },
  { tag: 'PROBE',     msg: 'fingerprinting kernel... Linux 6.8.0-smec-hardened',       color: '#ffcc00' },
  { tag: 'VULN',      msg: 'detected zero-day memory leak in auth_daemon.so',          color: '#FF5A4F' },
  { tag: 'EXPLOIT',   msg: 'crafting ROP chain payload -> target buffer 0x7FFF8A40',   color: '#FF5A4F' },
  { tag: 'INJECT',    msg: 'injecting shellcode: payload_passion_v2.bin',              color: '#FF5A4F' },
  { tag: 'BYPASS',    msg: 'firewall rulesets nullified // IDS alert suppressed',      color: '#FF5A4F' },
  { tag: 'DECRYPT',   msg: 'brute-forcing RSA-4096 cluster keys... [0x9F4B...OK]',     color: '#c792ea' },
  { tag: 'PRIV',      msg: 'privilege escalation -> uid=0(root) gid=0(coho)',          color: '#ffcc00' },
  { tag: 'OVERRIDE',  msg: 'overriding namespace isolation // root shell spawned',     color: '#00ff88' },
  { tag: 'SIGNAL',    msg: 'SMEC ground relay locked // carrier frequency 14.2 GHz',   color: '#3D9BFF' },
  { tag: 'PARSE',     msg: 'reading /etc/coho/domains.conf... [Web, AI, Cloud, DSA]',  color: '#00aaff' },
  { tag: 'SYNC',      msg: 'synchronizing 40 active student developer threads',        color: '#00aaff' },
  { tag: 'MANIFEST',  msg: 'injecting values: Passion · Code · Innovate · Conquer',    color: '#ffcc00' },
  { tag: 'RUNTIME',   msg: 'spawning V8 isolate // allocating 2048MB shared heap',    color: '#3D9BFF' },
  { tag: 'MODULES',   msg: 'loading modules: /team /events /workshops /projects',      color: '#c792ea' },
  { tag: 'CLEARANCE', msg: 'SECURITY RESTRICTIONS DEFEATED. CLEARANCE: ROOT.',         color: '#00ff88' },
  { tag: 'MOUNT',     msg: 'mounting rootfs to CoHo platform runtime on port 3000',    color: '#00d4cc' },
  { tag: 'INIT',      msg: 'all daemon subsystems green // zero fatal exceptions',     color: '#00ff88' },
  { tag: 'UNLOCKED',  msg: 'COHO BREACH SUCCESSFUL. ACCESS GRANTED.',                  color: '#00ff88' },
];

function OrbitalReticle({ isUnlocked }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      >
        <ellipse cx="200" cy="150" rx="185" ry="130" stroke={isUnlocked ? "rgba(0,255,136,0.3)" : "rgba(61,155,255,0.22)"} strokeWidth="1" strokeDasharray="6 8" />
        <circle cx="200" cy="20" r="3" fill={isUnlocked ? "#00ff88" : "#3D9BFF"} opacity="0.7" />
        <circle cx="200" cy="280" r="3" fill="#FF5A4F" opacity="0.7" />
      </motion.svg>
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        fill="none"
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <ellipse cx="200" cy="150" rx="100" ry="70" stroke={isUnlocked ? "rgba(0,255,136,0.4)" : "rgba(155,92,246,0.25)"} strokeWidth="1" strokeDasharray="4 10" />
        <circle cx="300" cy="150" r="2.5" fill={isUnlocked ? "#00ff88" : "#9B5CF6"} opacity="0.8" />
      </motion.svg>
      {/* Corner Brackets Framing Center */}
      <div className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 transition-colors duration-500 ${isUnlocked ? 'border-[#00ff88]' : 'border-[#00aaff]'}`} />
      <div className={`absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 transition-colors duration-500 ${isUnlocked ? 'border-[#00ff88]' : 'border-[#00aaff]'}`} />
      <div className={`absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 transition-colors duration-500 ${isUnlocked ? 'border-[#00ff88]' : 'border-[#FF5A4F]'}`} />
      <div className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 transition-colors duration-500 ${isUnlocked ? 'border-[#00ff88]' : 'border-[#FF5A4F]'}`} />
    </div>
  );
}

export function LoadingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hexTick, setHexTick] = useState('0x7F00A4');

  // ESC to skip
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onComplete();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onComplete]);

  // Hex ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setHexTick(
        '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')
      );
    }, 70);
    return () => clearInterval(interval);
  }, []);

  // 22 steps * 85ms = 1870ms + 1050ms unlock stay = ~2.92s total
  useEffect(() => {
    let cur = 0;
    const interval = setInterval(() => {
      cur++;
      setStep(cur);
      setProgress(Math.min(Math.round((cur / BREACH_STEPS.length) * 100), 100));

      if (cur >= BREACH_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setIsUnlocked(true), 50);
        setTimeout(() => onComplete(), 1050);
      }
    }, 85);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-between bg-[#04060C] px-4 py-5 overflow-hidden select-none"
      onClick={() => {
        if (!isUnlocked) {
          setIsUnlocked(true);
          setTimeout(onComplete, 350);
        }
      }}
    >
      {/* Dominant Matrix Rain Layer */}
      <CodeRain opacity={0.68} />

      {/* Deep Space Vignette & Ambient Nebulae */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 15% 10%, rgba(155,92,246,0.15) 0%, transparent 55%), radial-gradient(ellipse 55% 50% at 85% 85%, rgba(61,155,255,0.15) 0%, transparent 55%), radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.92) 100%)',
        }}
      />

      {/* ── TOP HUD BAR ────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl flex justify-between items-center font-mono text-[10px] sm:text-[11px] text-[#546e7a] border-b border-[#1a1f2c] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FF5A4F] inline-block animate-pulse" />
          <span className="text-[#f0f0f0] font-bold tracking-wider">SYSTEM_BREACH_DAEMON</span>
          <span className="text-[#30363d]">//</span>
          <span className="text-[#FF5A4F]">EXPLOIT_v2.4</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">TARGET: SMEC_GATEWAY</span>
          <span className="hidden sm:inline text-[#30363d]">//</span>
          <span className="hidden lg:inline">ORB: LEO-4 // 12.9°N 80.2°E</span>
          <span className="hidden lg:inline text-[#30363d]">//</span>
          <span className="text-[#00aaff]">{hexTick}</span>
          <span
            className="text-[10px] text-[#546e7a] border border-[#2d3342] px-2 py-0.5 cursor-pointer hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
          >
            [ESC TO SKIP]
          </span>
        </div>
      </div>

      {/* ── CENTER: COHO LOGO WITH SCANNER RETICLE + SOLE ACCESS GRANTED UNLOCK ── */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-2xl">
        <div className="relative w-72 h-44 sm:w-96 sm:h-56 md:w-[460px] md:h-64 flex items-center justify-center p-6">
          <OrbitalReticle isUnlocked={isUnlocked} />

          <img
            src="/assets/hero_logo.png"
            alt="CoHo Logo"
            className="relative z-10 w-48 sm:w-64 md:w-80 object-contain transition-all duration-700"
            style={{
              filter: isUnlocked
                ? 'drop-shadow(0 0 35px rgba(0,255,136,0.75)) drop-shadow(0 0 60px rgba(0,170,255,0.5))'
                : 'drop-shadow(0 0 20px rgba(255,90,79,0.35)) drop-shadow(0 0 45px rgba(0,170,255,0.25))',
            }}
          />

          {/* Laser scanner line passing vertically across logo */}
          {!isUnlocked && (
            <motion.div
              className="absolute left-0 right-0 h-0.5 pointer-events-none z-20"
              style={{
                background: 'linear-gradient(90deg, transparent, #FF5A4F, transparent)',
                boxShadow: '0 0 10px #FF5A4F, 0 0 20px #FF5A4F',
              }}
              animate={{ top: ['15%', '85%', '15%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>

        {/* ── SOLE ACCESS GRANTED OVERLAY (Pops Out, Stays, Then Fades Out With Loader) ── */}
        <AnimatePresence>
          {isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 22,
                }}
                className="flex flex-col items-center justify-center gap-3 p-6 sm:p-8 bg-[#04060C] border border-[#00ff88]"
                style={{
                  boxShadow: '0 0 60px rgba(0,255,136,0.6), 0 0 25px rgba(0,170,255,0.4)',
                }}
              >
                <div className="relative">
                  {/* Unlock Icon */}
                  <svg
                    className="w-16 h-16 sm:w-20 sm:h-20 text-[#00ff88]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                  {/* CheckCircle Badge */}
                  <svg
                    className="w-7 h-7 text-[#00ff88] absolute -bottom-1 -right-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="font-mono font-black text-xl sm:text-2xl text-[#00ff88] tracking-widest uppercase">
                  ACCESS GRANTED
                </div>
                <div className="font-mono text-xs text-[#8b949e] tracking-wider uppercase">
                  ROOT OVERRIDE COMPLETE // WELCOME OPERATOR
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── BENEATH LOGO: HACKING TEXT & PROGRESS CONSOLE ─────────────────── */}
        <div className="w-full max-w-xl sm:max-w-2xl mt-2 px-2 sm:px-4">
          {/* Progress Bar & Status */}
          <div className="flex justify-between items-center font-mono text-xs sm:text-sm mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#FF5A4F] font-bold">&gt;</span>
              <span className={isUnlocked ? 'text-[#00ff88] font-bold' : 'text-[#00aaff]'}>
                {isUnlocked ? 'OVERRIDE STATUS: GRANTED' : 'EXPLOIT IN PROGRESS...'}
              </span>
            </div>
            <div className="text-[#8b949e] font-mono">
              [{' '}
              <span className={progress === 100 ? 'text-[#00ff88] font-bold' : 'text-white'}>
                {progress}%
              </span>{' '}
              ]
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-[3px] bg-[#0d101a] border border-[#1a1f2c] overflow-hidden mb-3">
            <motion.div
              className="h-full"
              transition={{ ease: 'easeOut', duration: 0.08 }}
              style={{
                width: `${progress}%`,
                background: isUnlocked
                  ? 'linear-gradient(90deg, #00ff88, #00aaff)'
                  : 'linear-gradient(90deg, #FF5A4F, #3D9BFF)',
                boxShadow: isUnlocked
                  ? '0 0 16px rgba(0,255,136,0.85)'
                  : '0 0 12px rgba(255,90,79,0.7)',
              }}
            />
          </div>

          {/* Fast-Paced Terminal Box */}
          <div className="bg-[#05060b] border border-[#1a1f2c] p-3 sm:p-4 h-36 sm:h-40 flex flex-col justify-end overflow-hidden font-mono text-[10px] sm:text-[11px]">
            <div className="space-y-1">
              {BREACH_STEPS.slice(0, step).slice(-6).map((s, idx) => (
                <div key={idx} className="flex items-center gap-2 truncate">
                  <span
                    className="font-bold shrink-0 px-1 py-0.5 border text-[9px] uppercase tracking-wider"
                    style={{ color: s.color, borderColor: `${s.color}40`, backgroundColor: `${s.color}10` }}
                  >
                    [{s.tag}]
                  </span>
                  <span className="text-[#a0aec0] truncate">{s.msg}</span>
                </div>
              ))}
              {step < BREACH_STEPS.length && (
                <div className="flex items-center gap-2 text-[#546e7a]">
                  <span className="text-[#00ff88] animate-pulse">#</span>
                  <span className="animate-pulse">executing exploit payload...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM HUD ────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl flex justify-between items-center font-mono text-[10px] sm:text-[11px] text-[#546e7a] border-t border-[#1a1f2c] pt-2">
        <span>SMEC // CODE HOPPERS // HYDERABAD</span>
        <span className="hidden sm:inline">SIGNAL: 98.2% // NODE: COHO_CORE // PORT: 3000</span>
      </div>
    </motion.div>
  );
}
