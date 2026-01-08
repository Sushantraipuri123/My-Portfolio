import React, { useEffect, useRef, useState } from "react";
type Metric = { label: string; value: string };
type Project = {
  title: string;
  url: string;
  image?: string;
  tags: string[];
  summary?: string;
  year?: number;
  metrics?: Metric[];
  shots?: string[];
};
const projects: Project[] = [
  {
    title: "Plexjar",
    url: "https://plexjar.com/",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    summary: "Modern web experience with a focus on clarity and performance.",
    year: 2024,
    metrics: [
      { label: "Performance", value: "98 LH" },
      { label: "Role", value: "Frontend" },
      { label: "Focus", value: "UX • Speed" },
    ],
  },
  {
    title: "Akride",
    url: "https://akride.netlify.app/",
    tags: ["React", "CSS", "SPA"],
    summary: "Clean SPA showcasing content with speed and simplicity.",
    year: 2023,
  },
  {
    title: "Arkin PHI",
    url: "https://arkin-phi.vercel.app/",
    tags: ["Next.js", "GSAP", "UI/UX"],
    summary: "Interactive landing with premium feel and purposeful motion.",
    year: 2024,
    metrics: [
      { label: "Motion", value: "Scroll" },
      { label: "UX", value: "Premium" },
    ],
  },
  {
    title: "Webspak",
    url: "https://webspak.vercel.app/",
    tags: ["React", "Tailwind", "Animation"],
    summary: "Product site with crisp design and smooth interactions.",
    year: 2024,
    metrics: [
      { label: "Stack", value: "React" },
      { label: "Ship", value: "2 weeks" },
    ],
  },
  {
    title: "WebMixStudio",
    url: "https://webmixstudio.com/",
    tags: ["React", "Node", "AWS"],
    summary: "Full-Stack Engineering with Psychological Design for B2B & SaaS.",
    year: 2025,
  },
];
const screenshot = (url: string, w = 1200) =>
  `https://image.thum.io/get/width/${w}/${encodeURIComponent(url)}`;
export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<{ url: string; title: string } | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; title?: string } | null>(null);
  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{ x: number, y: number, vx: number, vy: number, life: number }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        life: Math.random()
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.life * 0.3})`;
        ctx.fill();

        particles.forEach(other => {
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 120) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  const centerTo = (i: number) => {
    const track = trackRef.current;
    const el = itemRefs.current[i];
    if (!track || !el) return;
    const left = el.offsetLeft - (track.clientWidth - el.clientWidth) / 2;
    track.scrollTo({ left, behavior: "smooth" });
  };
  // Coverflow effect
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const apply = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let min = Infinity;
      itemRefs.current.forEach((el, i) => {
        const c = el.offsetLeft + el.clientWidth / 2;
        const d = c - center;
        const abs = Math.abs(d);
        if (abs < min) {
          min = abs;
          nearest = i;
        }
        const ratio = Math.min(1, abs / (track.clientWidth * 0.7));
        const scale = 1 - ratio * 0.08;
        const ry = (d / track.clientWidth) * 12;
        el.style.setProperty("--cf-scale", String(scale));
        el.style.setProperty("--cf-ry", `${ry}deg`);
        el.style.setProperty("--cf-opacity", String(1 - ratio * 0.3));
      });
      setActive(nearest);
    };
    apply();
    track.addEventListener("scroll", apply, { passive: true });
    const ro = new ResizeObserver(apply);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", apply);
      ro.disconnect();
    };
  }, []);
  // Drag to scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      track.classList.add("dragging");
      startX = e.clientX;
      startScroll = track.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      track.scrollLeft = startScroll - dx;
    };
    const onPointerUp = () => {
      isDown = false;
      track.classList.remove("dragging");
    };
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointerleave", onPointerUp);
    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointerleave", onPointerUp);
    };
  }, []);
  const prev = () => centerTo(Math.max(0, active - 1));
  const next = () => centerTo(Math.min(projects.length - 1, active + 1));
  return (
    <section id="projects" ref={sectionRef} className="relative overflow-hidden bg-[#0a0e1a] min-h-screen py-24">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Project Archives
          </div>

          <h2 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500">
              Featured Work
            </span>
          </h2>

          <p className="text-lg text-cyan-200/70 max-w-2xl mx-auto mb-8">
            Drag or swipe to explore immersive project previews
          </p>
          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              disabled={active === 0}
              className="group relative flex items-center justify-center w-12 h-12 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 transition-all hover:bg-cyan-500/20 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="absolute inset-0 rounded-xl bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </button>
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => centerTo(i)}
                  className={`h-2 rounded-full transition-all ${i === active
                      ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                      : 'w-2 bg-cyan-500/30 hover:bg-cyan-500/50'
                    }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              disabled={active === projects.length - 1}
              className="group relative flex items-center justify-center w-12 h-12 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 transition-all hover:bg-cyan-500/20 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="absolute inset-0 rounded-xl bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </button>
          </div>
        </header>
        {/* Carousel */}
        <div
          ref={trackRef}
          className="no-scrollbar relative flex snap-x snap-mandatory gap-8 overflow-x-auto pb-12 pt-4 select-none"
          style={{ touchAction: "pan-y", cursor: "grab" }}
        >
          {projects.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                if (el) itemRefs.current[i] = el;
              }}
              className="shrink-0 snap-center w-[90vw] xs:w-[85vw] sm:w-[75vw] md:w-[65vw] lg:w-[55vw] xl:w-[50rem]"
              style={{
                transform: "perspective(1500px) rotateY(var(--cf-ry,0)) scale(var(--cf-scale,1))",
                opacity: "var(--cf-opacity,1)",
                transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms",
                willChange: "transform, opacity",
              }}
            >
              <ProjectCard
                project={p}
                onQuickPreview={() => setModal({ url: p.url, title: p.title })}
                onShowImage={(src) => setLightbox({ src, title: p.title })}
                accentIndex={i}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Live site modal */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900/95 shadow-[0_0_60px_rgba(6,182,212,0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-cyan-500/20 bg-slate-950/60 p-4">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/80 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                  <span className="h-3 w-3 rounded-full bg-amber-300/80 shadow-[0_0_10px_rgba(252,211,77,0.5)]" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <span className="text-sm font-semibold text-white">{modal.title}</span>
                <span className="text-xs text-cyan-400 font-mono">{modal.url.replace(/^https?:\/\//, "")}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={modal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
                >
                  Open Live ↗
                </a>
                <button
                  onClick={() => setModal(null)}
                  className="rounded-lg border border-white/20 bg-slate-800 p-2 text-white hover:bg-slate-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="aspect-[16/9] w-full bg-black">
              <iframe
                src={modal.url}
                title={modal.title}
                className="h-full w-full"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
              />
            </div>
          </div>
        </div>
      )}
      {/* Image lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.3)]">
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-4 top-4 z-10 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-2 text-sm text-white border border-white/20 hover:bg-black/80 transition-all"
            >
              Close
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.title || "Preview"}
              className="block max-h-[90vh] w-full object-contain"
            />
          </div>
        </div>
      )}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .dragging { cursor: grabbing !important; }
        .dragging iframe, .dragging a { pointer-events: none !important; }
      `}</style>
    </section>
  );
}
function ProjectCard({
  project,
  onQuickPreview,
  onShowImage,
  accentIndex,
}: {
  project: Project;
  onQuickPreview: () => void;
  onShowImage: (src: string) => void;
  accentIndex?: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * 5;
    const ry = (x - 0.5) * 8;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  };
  const coverHi = project.image || screenshot(project.url, 1280);
  const coverLow = project.image || screenshot(project.url, 360);
  const accentColors = [
    { border: 'border-purple-500/40', glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]', bg: 'from-purple-500/20' },
    { border: 'border-cyan-500/40', glow: 'shadow-[0_0_40px_rgba(6,182,212,0.4)]', bg: 'from-cyan-500/20' },
    { border: 'border-pink-500/40', glow: 'shadow-[0_0_40px_rgba(236,72,153,0.4)]', bg: 'from-pink-500/20' },
    { border: 'border-blue-500/40', glow: 'shadow-[0_0_40px_rgba(59,130,246,0.4)]', bg: 'from-blue-500/20' },
  ][(accentIndex ?? 0) % 4];
  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative isolate overflow-hidden rounded-3xl"
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateX(var(--rx,0)) rotateY(var(--ry,0))",
        transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Glowing border */}
      <div className={`absolute -inset-[1px] ${accentColors.border} ${accentColors.glow} rounded-3xl blur-sm`} />
      <div className={`absolute -inset-[2px] bg-gradient-to-br ${accentColors.bg} to-transparent rounded-3xl opacity-40 animate-pulse`} />

      {/* Main card */}
      <div className={`relative bg-slate-900/95 backdrop-blur-xl rounded-3xl border ${accentColors.border} overflow-hidden`}>
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-scan" />
        </div>
        {/* Glare effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(300px circle at var(--mx,50%) var(--my,50%), rgba(6,182,212,0.15), transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
        {/* Browser chrome */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-950/60 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/80 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
              <span className="h-3 w-3 rounded-full bg-amber-300/80 shadow-[0_0_10px_rgba(252,211,77,0.5)]" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            </div>
            <span className="text-xs text-cyan-400/70 font-mono truncate max-w-[200px]">
              {project.url.replace(/^https?:\/\//, "")}
            </span>
          </div>
          {project.year && (
            <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-semibold">
              {project.year}
            </div>
          )}
        </div>
        {/* Preview area */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
          {/* LQIP */}
          <img src={coverLow} alt="" className="absolute inset-0 h-full w-full object-cover blur-lg scale-110" />

          {/* Hi-res image */}
          <img
            src={coverHi}
            alt={`${project.title} preview`}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
          {/* Live iframe */}
          {inView && (
            <iframe
              src={project.url}
              title={`${project.title} live preview`}
              className="absolute inset-0 h-full w-full transition-opacity duration-800"
              style={{ opacity: iframeLoaded ? 1 : 0 }}
              sandbox="allow-scripts allow-same-origin allow-forms"
              loading="lazy"
              onLoad={() => setIframeLoaded(true)}
            />
          )}
          {/* Status badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-xs text-emerald-300 font-semibold">LIVE</span>
            </div>
          </div>
          {/* Bottom vignette */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title and actions */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              {project.summary && (
                <p className="text-sm text-cyan-200/70 line-clamp-2">{project.summary}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onQuickPreview}
                className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
              >
                Expand
              </button>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500/30 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                Visit →
              </a>
            </div>
          </div>
          {/* Tech tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-slate-800/50 border border-cyan-500/20 text-xs text-cyan-300 font-medium hover:bg-slate-800/80 hover:border-cyan-500/40 transition-all"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {project.metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 backdrop-blur-sm hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all"
                >
                  <div className="text-[10px] uppercase tracking-widest text-cyan-400/60 font-semibold mb-1">
                    {m.label}
                  </div>
                  <div className="text-sm font-bold text-white">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Gallery shots */}
          {project.shots && project.shots.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">Gallery</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {project.shots.map((shot, j) => (
                  <button
                    key={j}
                    onClick={() => onShowImage(shot)}
                    className="relative aspect-[16/9] overflow-hidden rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all group"
                  >
                    <img
                      src={shot}
                      alt={`Shot ${j + 1} of ${project.title}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}