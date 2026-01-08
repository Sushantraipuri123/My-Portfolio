import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { useState, useEffect } from "react";

const navigation = [
  { name: "About", href: "#about", code: "01" },
  { name: "Projects", href: "#projects", code: "02" },
  { name: "Tech Specs", href: "#tech", code: "03" },
];

export default function Header() {
  const [current, setCurrent] = useState("#");
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to add "active" state to header background
  useEffect(() => {
    const handleScrollDir = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScrollDir);
    return () => window.removeEventListener("scroll", handleScrollDir);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setCurrent(href);
    const target = href === "#" ? document.body : document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 z-[100] w-full transition-all duration-700 ${scrolled ? "py-4" : "py-8"
        }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className={`relative flex h-14 items-center justify-between px-6 transition-all duration-500 border-x border-white/5 ${scrolled ? "bg-black/60 backdrop-blur-xl border-y border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "bg-transparent"
          }`}>

          {/* Decorative Corner Accents (Top Left & Bottom Right) */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />

          {/* Left: Brand Identity */}
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 bg-white animate-pulse" />
            <span
              className="font-black text-xs tracking-[0.4em] text-white uppercase cursor-pointer hover:tracking-[0.6em] transition-all duration-500"
              onClick={(e) => handleScroll(e as any, "#")}
            >
              Sushant Raipuri // <span className="text-zinc-500 font-light">OS v2.0</span>
            </span>
          </div>

          {/* Center: HUD Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className={`group relative flex items-center gap-2 px-6 py-2 transition-all duration-300 ${current === item.href ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
              >
                {/* Micro-label */}
                <span className="text-[7px] font-mono opacity-50 group-hover:text-white transition-colors">
                  {item.code}
                </span>

                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  {item.name}
                </span>

                {/* Active Underline Glow */}
                {current === item.href && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-white shadow-[0_0_10px_white]" />
                )}
              </a>
            ))}
          </div>

          {/* Right: The Signal Button */}
          <div className="flex items-center gap-6">
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "#contact")}
              className="group relative flex items-center gap-2 bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-black transition-all duration-500 hover:bg-zinc-200"
            >
              {/* Button Accents */}
              <div className="absolute -top-[1px] -left-[1px] w-1 h-1 bg-black group-hover:bg-white" />
              <div className="absolute -bottom-[1px] -right-[1px] w-1 h-1 bg-black group-hover:bg-white" />

              Let's Talk
              <ArrowUpRightIcon className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Aesthetic Top Bar (Full Width) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </nav>
  );
}