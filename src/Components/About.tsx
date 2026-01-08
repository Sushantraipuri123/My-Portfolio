import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Cpu, BarChart3, ShieldCheck, Globe } from "lucide-react";

/* ============ Types ============ */
// Standardized IDs to match both logic and graphics
type CardId = "skills" | "metrics" | "pipeline";

/* ============ Main About Component ============ */
export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: r,
          start: "top 70%",
          once: true
        },
      });

      tl.from(r.querySelector("[data-kicker]"), { x: -20, opacity: 0, duration: 0.6, ease: "power4.out" })
        .from(r.querySelector("[data-title]"), { y: 30, opacity: 0, duration: 0.8, ease: "expo.out" }, "-=0.4")
        .from(r.querySelectorAll("[data-body]"), { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.5")
        .from(r.querySelectorAll("[data-stat]"), { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.3")
        .from(r.querySelector("[data-deck]"), { x: 60, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.8");

      const counters = gsap.utils.toArray<HTMLElement>("[data-count-to]");
      counters.forEach((el) => {
        const to = Number(el.dataset.countTo || 0);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: to,
          duration: 2,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
          onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#020406] overflow-hidden flex items-center py-24" id="about">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-cyan-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <div className="grid gap-16 lg:grid-cols-12 items-center">

          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center gap-4" data-kicker>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">System.Status: Active</span>
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-blue-500/30 to-transparent" />
            </div>

            <h2 data-title className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]">
              Building robust <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">MERN Stack</span> applications.
            </h2>

            <div className="space-y-6 max-w-xl text-lg text-zinc-400 leading-relaxed">
              <p data-body>
                I am a <span className="text-white border-b border-blue-500/30 font-medium">MERN Stack Developer</span> specialized in building scalable full-stack web applications.
              </p>
              <p data-body className="text-base">
                Focused on <span className="text-zinc-200">React ecosystems</span>, <span className="text-zinc-200">Node.js Performance</span>, and <span className="text-zinc-200">Modern UI/UX</span>.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4">
              <StatChip label="Years Exp" to={4} icon={<Cpu size={14} />} />
              <StatChip label="Projects" to={32} icon={<Globe size={14} />} />
              <StatChip label="Clients" to={12} icon={<ShieldCheck size={14} />} />
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center w-full" data-deck>
            <IdentityDeck />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Identity Deck ============ */
function IdentityDeck() {
  const deckRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<CardId[]>(["skills", "metrics", "pipeline"]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = deckRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const bringToFront = (id: CardId) => {
    setOrder((prev) => [id, ...prev.filter((p) => p !== id)]);
  };

  return (
    <div
      ref={deckRef}
      onPointerMove={onPointerMove}
      className="relative w-full max-w-[420px] h-[480px] perspective-[1200px] touch-none flex justify-center items-center"
    >
      {order.map((id, index) => (
        <CardWrapper
          key={id}
          id={id}
          index={index}
          mousePos={mousePos}
          onClick={() => bringToFront(id)}
        />
      ))}
    </div>
  );
}

function CardWrapper({ id, index, mousePos, onClick }: { id: CardId, index: number, mousePos: { x: number, y: number }, onClick: () => void }) {
  const isFront = index === 0;

  const translateZ = -index * 40;
  const translateY = index * 10;
  const opacity = 1 - index * 0.15;
  const rotateX = isFront ? (mousePos.y - 50) * -0.1 : 0;
  const rotateY = isFront ? (mousePos.x - 50) * 0.1 : 0;

  return (
    <div
      onClick={onClick}
      className="absolute inset-0 transition-all duration-700 ease-out cursor-pointer group"
      style={{
        transform: `translate3d(0, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        zIndex: 30 - index,
        opacity,
      }}
    >
      <div className="relative h-full w-full rounded-3xl border border-white/10 bg-[#0c0e12]/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black">
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.08), transparent 50%)` }}
        />

        <div className="p-6 h-full flex flex-col items-center justify-center">
          {id === "skills" && <SkillsGraphic mousePos={mousePos} />}
          {id === "metrics" && <MetricsGraphic />}
          {id === "pipeline" && <PipelineGraphic />}
        </div>
      </div>
    </div>
  );
}

/* ============ Graphic Components ============ */

function SkillsGraphic({ }: { mousePos: { x: number, y: number } }) {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      {/* Central Core */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        <span className="text-3xl font-black text-white">S</span>
        {/* Animated Rings */}
        <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping" />
      </div>

      {/* Orbiting Icons (Representative) - Increased gap by larger radius */}
      {[
        { icon: "Ra", color: "#61DAFB" },
        { icon: "No", color: "#339933" },
        { icon: "Ex", color: "#000000" },
        { icon: "Mo", color: "#47A248" },
        { icon: "Re", color: "#764ABC" },
        { icon: "Tw", color: "#38BDF8" },
      ].map(({ icon, color }, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 120; // Increased from 100 to 120 for larger gap
        const y = Math.sin(angle) * 120;
        return (
          <div
            key={i}
            className="absolute w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <span className="text-lg font-bold" style={{ color }}>{icon}</span>
          </div>
        );
      })}

      {/* SVG Connection Lines - Adjusted radius */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <circle cx="50%" cy="50%" r="120" fill="none" stroke="white" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}


function MetricsGraphic() {
  return (
    <div className="space-y-4 w-full px-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <BarChart3 className="text-blue-400" size={18} />
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest text-center">Efficiency_Metrics</div>
      </div>
      <div className="flex flex-col gap-6">
        {[{ l: 'Speed', p: '98%', c: 'bg-blue-400' }, { l: 'SEO', p: '100%', c: 'bg-emerald-400' }, { l: 'A11y', p: '94%', c: 'bg-purple-400' }].map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-zinc-300">{item.l}</span><span className="text-white font-bold">{item.p}</span></div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${item.c} rounded-full`} style={{ width: item.p }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineGraphic() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
        <Zap className="text-white" fill="white" size={32} />
      </div>
      <div className="text-center">
        <div className="text-white font-bold">High Velocity</div>
        <div className="text-zinc-500 text-xs mt-1 font-mono">deployment_pipeline.sh</div>
      </div>
    </div>
  );
}

function StatChip({ label, to, icon }: { label: string; to: number; icon: React.ReactNode }) {
  return (
    <div data-stat className="relative p-4 rounded-2xl bg-white/5 border border-white/10 text-center group">
      <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity text-blue-400">
        {icon}
      </div>
      <div className="text-2xl font-bold text-white"><span data-count-to={to}>0</span>+</div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">{label}</div>
    </div>
  );
}