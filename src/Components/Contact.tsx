import { useEffect, useRef, useState } from "react";
import type React from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FormState = {
  name: string;   // From Name
  email: string;  // From Email
  subject: string;
  message: string;
};

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const TO_EMAIL = "cashu853@gmail.com";

  // EMAILJS CREDENTIALS
  const SERVICE_ID = "service_f36i37l";
  const TEMPLATE_ID = "template_gxgenv9";
  const PUBLIC_KEY = "pFJwAxD66KyV8YHE-";

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const tl = gsap.timeline({ scrollTrigger: { trigger: r, start: "top 70%", once: true } });
      tl.from(r.querySelector("[data-kicker]"), { y: 14, opacity: 0, duration: 0.45, ease: "power3.out" })
        .from(r.querySelector("[data-title]"), { y: 18, opacity: 0, duration: 0.55, ease: "power3.out" }, "-=0.2")
        .from(r.querySelector("[data-sub]"), { y: 12, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.2")
        .from(r.querySelector("[data-form]"), { y: 24, opacity: 0, scale: 0.985, duration: 0.55, ease: "power3.out" }, "-=0.1");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // 3D tilt on form card
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
  };
  const onLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    const el = cardRef.current!;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  };

  const setField =
    <K extends keyof FormState>(key: K) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (!form.subject.trim()) next.subject = "Add a short subject.";
    if (!form.message.trim() || form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setServerMsg("");

    try {
      // Sending email using EmailJS
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
          to_email: TO_EMAIL, // accessing this in template as {{to_email}}
        },
        PUBLIC_KEY
      );

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (err: any) {
      console.error("EmailJS Error:", err);
      setStatus("error");
      setServerMsg("Failed to send email. Please check your connection or EmailJS config.");
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-[#0b0d10]">
      <div className="mx-auto max-w-6xl px-6 py-24" id="contact">
        {/* Header */}
        <header className="mb-10 text-center">
          <span
            data-kicker
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300"
          >
            Mail
          </span>
          <h1 data-title className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Compose a message — I’ll reply within 24h
          </h1>
          <p data-sub className="mx-auto mt-2 max-w-2xl text-zinc-400">
            Familiar email-style composer: To, From, Subject, and Message. Clean, centered, and polished.
          </p>
        </header>

        {/* Composer card */}
        <div className="mx-auto max-w-3xl">
          <div
            ref={cardRef}
            data-form
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-[#0e1116] ring-1 ring-white/10"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(var(--rx,0)) rotateY(var(--ry,0))",
              boxShadow:
                "0 42px 60px -28px rgba(0,0,0,0.65), 0 16px 30px -16px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
              transition: "transform 160ms ease",
            }}
          >
            {/* shadow catcher */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-8 -bottom-8 -top-6 -z-10"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 65%, rgba(0,0,0,0.6), rgba(0,0,0,0.28) 45%, transparent 70%)",
                filter: "blur(18px)",
              }}
            />
            {/* inner bevel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5)" }}
            />
            {/* window controls + title */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0f1218]/60 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-xs uppercase tracking-wider text-zinc-400">Compose</span>
              </div>
              <div className="text-[11px] text-zinc-500">New message</div>
            </div>
            {/* glare */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), transparent 60%)",
                mixBlendMode: "screen",
              }}
            />

            {/* Form rows: To / From / Subject / Message */}
            <form ref={formRef} onSubmit={onSubmit} className="relative z-10 p-5 sm:p-6">
              {/* To */}
              <Row label="To">
                <span className="inline-flex items-center rounded-md bg-white/10 px-2.5 py-1 text-xs text-zinc-200 ring-1 ring-white/10">
                  {TO_EMAIL}
                </span>
              </Row>

              {/* From (name + email) */}
              <Row label="From">
                <div className="grid w-full gap-2 sm:grid-cols-2">
                  <input
                    id="from-name"
                    value={form.name}
                    onChange={setField("name")}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-[#0f1319] px-3 py-2.5 text-sm text-white ring-1 ring-white/10 outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:ring-white/20"
                  />
                  <input
                    id="from-email"
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    placeholder="you@domain.com"
                    className="w-full rounded-xl border border-white/10 bg-[#0f1319] px-3 py-2.5 text-sm text-white ring-1 ring-white/10 outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:ring-white/20"
                  />
                </div>
              </Row>
              {(errors.name || errors.email) && (
                <div className="mb-2 grid grid-cols-[64px_1fr] items-start gap-3">
                  <div />
                  <div className="space-y-1">
                    {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                  </div>
                </div>
              )}

              {/* Subject */}
              <Row label="Subject">
                <input
                  id="subject"
                  value={form.subject}
                  onChange={setField("subject")}
                  placeholder="Let’s build something great"
                  className="w-full rounded-xl border border-white/10 bg-[#0f1319] px-3 py-2.5 text-sm text-white ring-1 ring-white/10 outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:ring-white/20"
                />
              </Row>
              {errors.subject && (
                <div className="mb-2 grid grid-cols-[64px_1fr] items-start gap-3">
                  <div />
                  <p className="text-xs text-red-400">{errors.subject}</p>
                </div>
              )}

              {/* Message */}
              <Row label="Message" alignTop>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={setField("message")}
                  rows={8}
                  placeholder="Hi — I’d love to chat about…"
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#0f1319] px-3 py-2.5 text-sm text-white ring-1 ring-white/10 outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:ring-white/20"
                />
              </Row>
              {errors.message && (
                <div className="mb-2 grid grid-cols-[64px_1fr] items-start gap-3">
                  <div />
                  <p className="text-xs text-red-400">{errors.message}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 grid grid-cols-[64px_1fr] items-center gap-3">
                <div />
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-zinc-500">
                    Or email me directly:{" "}
                    <a href={`mailto:${TO_EMAIL}`} className="text-zinc-300 underline underline-offset-2">
                      {TO_EMAIL}
                    </a>
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group relative inline-flex items-center gap-2 rounded-lg border border-white/10 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 ring-1 ring-white/10 transition hover:bg-indigo-500/20 hover:text-white disabled:opacity-50"
                    style={{ transform: "translate3d(var(--tx,0), var(--ty,0), 0) scale(var(--scale,1))" }}
                    onMouseMove={(e) => magnetMove(e.currentTarget as HTMLElement, e)}
                    onMouseLeave={(e) => magnetReset(e.currentTarget as HTMLElement)}
                  >
                    {status === "loading" ? (
                      <>
                        <Spinner /> Sending…
                      </>
                    ) : status === "success" ? (
                      <>
                        <CheckIcon /> Sent!
                      </>
                    ) : (
                      <>
                        Send <PaperPlaneIcon />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Server message */}
              <div aria-live="polite" className="min-h-[20px]">
                {status === "error" && serverMsg && (
                  <p className="mt-2 text-sm text-red-400" role="alert">
                    {serverMsg}
                  </p>
                )}
                {status === "success" && (
                  <p className="mt-2 text-sm text-emerald-400" role="status">
                    Thanks! I’ll reach out shortly.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Row helper (label: To/From/Subject/Message) ============ */
function Row({ label, children, alignTop }: { label: string; children: React.ReactNode; alignTop?: boolean }) {
  return (
    <div className={`mb-3 grid grid-cols-[64px_1fr] ${alignTop ? "items-start" : "items-center"} gap-3`}>
      <div className={`text-xs uppercase tracking-wider text-zinc-400 ${alignTop ? "pt-2" : ""}`}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

/* ============ Small UI helpers ============ */
function magnetMove(el: HTMLElement, e: React.MouseEvent) {
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty("--tx", `${x * 6}px`);
  el.style.setProperty("--ty", `${y * 6}px`);
  el.style.setProperty("--scale", "1.015");
}
function magnetReset(el: HTMLElement) {
  el.style.setProperty("--tx", `0px`);
  el.style.setProperty("--ty", `0px`);
  el.style.setProperty("--scale", "1");
}

function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />;
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-emerald-400" fill="currentColor" aria-hidden>
      <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" />
    </svg>
  );
}
function PaperPlaneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" fill="currentColor" aria-hidden>
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
} 