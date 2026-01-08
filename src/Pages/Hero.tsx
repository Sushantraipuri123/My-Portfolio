import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CpuChipIcon } from "@heroicons/react/24/outline";

// --- TYPES ---
interface Point { x: number; y: number; }
interface LightningBolt {
  segments: Point[];
  opacity: number;
  width: number;
  lifeSpeed: number;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Array of refs to track the position of the 4 menu items
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isEngaged, setIsEngaged] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const activeBolts = useRef<LightningBolt[]>([]);
  const flashIntensity = useRef(0);

  // --- RESIZE HANDLER ---
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- FRACTAL LIGHTNING LOGIC ---
  const createBoltPath = (start: Point, end: Point, displacement: number): Point[] => {
    if (displacement < 4) return [start, end];
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const jitter = (Math.random() - 0.5) * displacement;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const midPoint = {
      x: midX + (-(dy / len) * jitter),
      y: midY + ((dx / len) * jitter)
    };
    return [
      ...createBoltPath(start, midPoint, displacement / 2),
      ...createBoltPath(midPoint, end, displacement / 2)
    ];
  };

  const strikeMenuLink = (index: number) => {
    const el = menuItemsRef.current[index];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    // Create the bolt from top to the specific menu item
    const path = createBoltPath(
      { x: targetX + (Math.random() * 400 - 200), y: -50 },
      { x: targetX, y: targetY },
      150
    );

    activeBolts.current.push({
      segments: path,
      opacity: 1.2,
      width: 3,
      lifeSpeed: 0.04
    });

    // Visual feedback for the strike
    flashIntensity.current = 0.7;

    // Reveal the specific item with a "power-on" glow
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power4.out",
      onStart: () => {
        gsap.fromTo(el,
          { filter: "brightness(10) blur(10px)" },
          { filter: "brightness(1) blur(0px)", duration: 1 }
        );
      }
    });
  };

  // --- AUTO-START ---
  useEffect(() => {
    const timer = setTimeout(() => {
      startInitialization();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const startInitialization = () => {
    if (isEngaged) return;
    setIsEngaged(true);
    audioRef.current?.play().catch(() => { }); // Catch autoplay blocks

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        // Reveal the center title last
        gsap.to(".center-content", { opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" });
      }
    });

    // Sequence the 4 strikes
    [0, 1, 2, 3].forEach((val, i) => {
      tl.add(() => strikeMenuLink(val), i * 0.7 + 0.5);
    });
  };

  // --- RENDER LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (flashIntensity.current > 0) {
        ctx.fillStyle = `rgba(99, 102, 241, ${flashIntensity.current * 0.15})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashIntensity.current *= 0.88;
      }

      activeBolts.current.forEach((bolt, index) => {
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#6366f1";
        ctx.globalCompositeOperation = "lighter";
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.opacity})`;
        ctx.lineWidth = bolt.width;

        if (bolt.segments.length > 0) {
          ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
          bolt.segments.forEach(p => ctx.lineTo(p.x, p.y));
        }
        ctx.stroke();
        bolt.opacity -= bolt.lifeSpeed;
        if (bolt.opacity <= 0) activeBolts.current.splice(index, 1);
      });

      requestAnimationFrame(render);
    };
    const raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#050505] overflow-hidden"
    >
      <audio ref={audioRef} src="/horror.mp3" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-40 h-full w-full" />

      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505]" />

      <div className="glitch-ui z-20 grid w-full max-w-screen-2xl grid-cols-1 md:grid-cols-3 px-8 md:px-12 items-center">

        {/* LEFT MENU (Strikes 1 & 2) */}
        <div className="flex flex-col gap-16 items-center md:items-start order-2 md:order-1 mt-10 md:mt-0">
          <div ref={el => { menuItemsRef.current[0] = el; }} className="opacity-0 translate-y-10">
            <MenuLink index="01" label="PROJECTS" sub="Visual Code" link="#projects" />
          </div>
          <div ref={el => { menuItemsRef.current[1] = el; }} className="opacity-0 translate-y-10">
            <MenuLink index="02" label="STACK" sub="Tech Core" link="#tech" />
          </div>
        </div>

        {/* CENTER TITLE (Revealed after all strikes) */}
        <div className="center-content opacity-0 scale-90 flex flex-col items-center text-center py-10 md:py-20 relative order-1 md:order-2">
          <h1 className="text-[10px] font-bold tracking-[1.5em] text-zinc-600 uppercase mb-8">System Online</h1>
          <h2 className="text-6xl md:text-8xl lg:text-7xl font-black italic text-white tracking-tighter leading-[0.85] relative z-10">
            MERN STACK <br /> <span className="stroke-text text-transparent text-6xl md:text-8xl lg:text-9xl">DEVELOPER</span>
          </h2>
          <div className="mt-12 h-[1px] w-48 bg-zinc-900 relative overflow-hidden">
            <div className={`h-full bg-white transition-all duration-[2s] ${isComplete ? 'w-full' : 'w-0'}`} />
          </div>
        </div>

        {/* RIGHT MENU (Strikes 3 & 4) */}
        <div className="flex flex-col gap-16 items-center md:items-end order-3 mt-10 md:mt-0">
          <div ref={el => { menuItemsRef.current[2] = el; }} className="opacity-0 translate-y-10">
            <MenuLink index="03" label="ABOUT" sub="The Logic" link="#about" />
          </div>
          <div ref={el => { menuItemsRef.current[3] = el; }} className="opacity-0 translate-y-10">
            <MenuLink index="04" label="CONTACT" sub="Secure Line" link="#contact" />
          </div>
        </div>
      </div>

      {!isEngaged && (
        <div
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#030305]/95 backdrop-blur-sm cursor-wait"
        >
          <div className="relative group mb-8">
            <div className="absolute -inset-6 rounded-full bg-indigo-500/20 animate-ping" />
            <CpuChipIcon className="relative h-16 w-16 text-white" />
          </div>
          <p className="text-[11px] tracking-[1em] text-white uppercase animate-pulse">Establishing Connection</p>
        </div>
      )}

      <div className="absolute bottom-10 w-full flex justify-between px-8 md:px-16 text-[8px] font-mono tracking-widest text-zinc-800 uppercase">
        <span>Sushant Portfolio v1.0</span>
        <span>©2024_SUSHANT</span>
      </div>

      <style>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(255,255,255,0.7); }
        .glitch-ui { will-change: filter, transform; }
      `}</style>
    </section>
  );
}

function MenuLink({ index, label, sub, link }: { index: string, label: string; sub: string; link: string }) {
  return (
    <a href={link} className="group cursor-pointer flex flex-col items-center md:items-start">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-indigo-500/50 group-hover:text-indigo-400">{index}</span>
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tighter text-white/40 group-hover:text-white transition-all duration-500 ease-out">
          {label}
        </h3>
      </div>
      <p className="text-[9px] tracking-[0.4em] text-zinc-700 mt-2 uppercase transition-colors group-hover:text-indigo-400/80">// {sub}</p>
    </a>
  );
}