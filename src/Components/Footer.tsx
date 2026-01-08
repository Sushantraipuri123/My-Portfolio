import { Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { name: "LI", href: "https://www.linkedin.com/", icon: <Linkedin size={18} /> },
    { name: "TW", href: "https://x.com/", icon: <Twitter size={18} /> },
    { name: "GH", href: "https://github.com/Sushantraipuri123", icon: <Github size={18} /> },
  ];

  const quickLinks = ["About", "#projects", "#tech", "Contact"];

  return (
    <footer className="relative bg-[#020204] text-white pt-32 pb-10 overflow-hidden border-t border-white/5">
      {/* BACKGROUND WATERMARK - Huge, subtle text for massive scale */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 pointer-events-none select-none">
          SUSHANT RAIPURI
       
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          
          {/* LEFT: THE CALL TO ACTION */}
          <div className="md:col-span-6 space-y-8">
            <h3 className="text-5xl md:text-7xl font-light tracking-tighter leading-[0.9]">
              HAVE A <span className="italic font-serif text-indigo-500">Vision?</span> <br />
              LETS SYNC.
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="mailto:your@email.com" 
                className="group flex items-center justify-between px-8 py-5 bg-white text-black rounded-full font-bold transition-all hover:bg-indigo-500 hover:text-white"
              >
                START A PROJECT <ArrowUpRight className="ml-4 group-hover:rotate-45 transition-transform" />
              </a>
              <div className="flex items-center gap-2 px-6 py-5 border border-white/10 rounded-full backdrop-blur-md">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono tracking-widest text-zinc-400">AVAILABILITY: Mon - Sun</span>
              </div>
            </div>
          </div>

          {/* RIGHT: NAVIGATION & SOCIAL */}
          <div className="md:col-span-5 md:col-start-8 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase font-bold">Navigation</h4>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <a href={link.startsWith("#") ? link : `#${link.toLowerCase()}`} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-8">
                      {link.replace("#", "").replace(/.*/, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).replace("-"," "))}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase font-bold">Social Signal</h4>
              <div className="flex flex-col gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    className="flex items-center gap-3 text-sm text-zinc-400 hover:text-indigo-400 transition-all group"
                  >
                    <span className="p-2 border border-white/5 rounded-lg group-hover:border-indigo-500/50 transition-colors">
                      {link.icon}
                    </span>
                    <span className="font-mono">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
          <div className="flex items-center gap-8">
            <span>Local Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
           
          </div>
          
          <div className="text-zinc-600">
            &copy; {new Date().getFullYear()} SUSHANT_RAIPURI / ALL_RIGHTS_RESERVED
          </div>
        </div>
      </div>
    </footer >
  );
}