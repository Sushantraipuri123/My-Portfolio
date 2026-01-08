import React, { useEffect, useRef, useState } from "react";

type Tech = {
  name: string;
  logo: string;
  type: "inner" | "outer";
};

const techs: Tech[] = [
  { name: "React", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg", type: "inner" },
  { name: "Next.js", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg", type: "outer" },
  { name: "TypeScript", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg", type: "inner" },
  { name: "Node.js", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg", type: "outer" },
  { name: "Tailwind", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg", type: "inner" },
  { name: "Redux", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg", type: "outer" },
  { name: "Express", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg", type: "inner" },
  { name: "MongoDB", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg", type: "outer" },
  { name: "JavaScript", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg", type: "inner" },
];

export default function NexusTechOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState({ x: 20, y: 0 });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const { width, height, left, top } = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const rotateY = ((mouseX / width) - 0.5) * 30;
    const rotateX = 20 + ((mouseY / height) - 0.5) * -20;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 20, y: 0 });
  };

  const OrbitRing = ({
    items,
    radius,
    direction,
    zOffset = 0
  }: {
    items: Tech[],
    radius: number,
    speed: number,
    direction: number,
    zOffset?: number
  }) => {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          width: radius * 2,
          height: radius * 2,
          top: `calc(50% - ${radius}px)`,
          left: `calc(50% - ${radius}px)`,
          transform: `rotateZ(${rotation * direction}deg)`,
          transition: 'transform 0.016s linear'
        }}
      >
        {items.map((tech, i) => {
          const angle = (360 / items.length) * i;
          return (
            <div
              key={tech.name}
              className="absolute"
              style={{
                transform: `rotate(${angle}deg) translate(${radius}px) translateZ(${zOffset}px)`,
              }}
            >
              <div
                className="group relative"
                style={{
                  transform: `rotate(${-angle - rotation * direction}deg)`,
                  transition: 'transform 0.016s linear'
                }}
              >
                {/* 3D Card */}
                <div className="relative w-20 h-20 transition-all duration-300 hover:scale-110 cursor-pointer preserve-3d">
                  {/* Card back glow */}
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl" />

                  {/* Main card */}
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-sm overflow-hidden group-hover:border-cyan-400 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all">
                    {/* Top edge highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

                    {/* Corner accents */}
                    <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-cyan-400/40" />
                    <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-cyan-400/40" />
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-cyan-400/40" />
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-cyan-400/40" />

                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />

                    {/* Logo container */}
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={tech.logo}
                        alt={tech.name}
                        className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* Bottom label */}
                    <div className="absolute bottom-1 left-0 right-0 text-center">
                      <span className="text-[9px] font-mono text-cyan-300/70 tracking-wider">{tech.name}</span>
                    </div>
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-slate-900/95 border border-cyan-500/50 rounded-lg px-3 py-1.5 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <span className="text-sm font-mono text-cyan-300">{tech.name}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id="tech"
      className="relative min-h-screen bg-[#0a0e1a] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Top status bar */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-xs font-mono text-cyan-300">Tech Stack</span>
          </div>
          <div className="w-px h-4 bg-cyan-500/30" />
          <button
            onClick={() => setIsActive(!isActive)}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Core
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-20 text-center mb-16">
        <h2 className="text-6xl md:text-8xl font-black tracking-tight">
          <span className="text-white">TECH </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400">
            STACK
          </span>
        </h2>
      </div>

      {/* 3D Orbit System */}
      <div
        className="relative flex items-center justify-center w-[900px] h-[900px] max-w-[95vw] max-h-[95vw]"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s ease-out'
          }}
          className="relative w-full h-full"
        >
          {/* Central Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="relative w-40 h-40">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />

              {/* Rotating ring segments */}
              <div className="absolute inset-0 animate-spin-slow">
                {[0, 90, 180, 270].map((angle, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />
                  </div>
                ))}
              </div>

              {/* Inner rings */}
              <div className="absolute inset-4 rounded-full border-2 border-cyan-500/50 animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-cyan-400/30" />

              {/* Core circle */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/60 shadow-[0_0_60px_rgba(6,182,212,0.4)] flex items-center justify-center">
                <span className="text-xl font-black text-cyan-300 tracking-wider">Core</span>
              </div>

              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
            </div>
          </div>

          {/* Orbit rings visual */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[460px] h-[460px] rounded-full border border-cyan-500/20" />
            <div className="absolute inset-0 w-[460px] h-[460px] rounded-full border border-dashed border-cyan-500/10" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[740px] h-[740px] rounded-full border border-cyan-500/15" />
            <div className="absolute inset-0 w-[740px] h-[740px] rounded-full border border-dashed border-cyan-500/5" />
          </div>

          {/* Inner Ring */}
          <OrbitRing
            items={techs.filter(t => t.type === 'inner')}
            radius={210}
            speed={1}
            direction={1}
            zOffset={20}
          />

          {/* Outer Ring */}
          <OrbitRing
            items={techs.filter(t => t.type === 'outer')}
            radius={350}
            speed={1}
            direction={-1}
            zOffset={10}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}