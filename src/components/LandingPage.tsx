"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Droplets,
  RefreshCcw,
  Battery,
  UserCheck,
  Flame,
  ArrowUpRight,
  ChevronRight,
  Menu,
  X,
  Cpu,
  Globe,
  LayoutDashboard,
  CheckCircle2,
  Play,
  Heart,
  Smile,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#232323]">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
        {/* Logo — clip SVG to show icon only */}
        <div className="relative overflow-hidden" style={{ width: 140, height: 64 }}>
          <Image
            src="/logo.svg"
            alt="NPAS Logo"
            width={140}
            height={140}
            style={{ 
              filter: "brightness(1.4) drop-shadow(0 0 6px rgba(168,230,61,0.35))", 
              display: "block",
              marginTop: -30 // Lift icon but leave more room at the bottom of the frame
            }}
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400">
          <Link href="/" className="px-4 py-2 text-white font-semibold relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-white after:rounded-full">
            Home
          </Link>
          <span className="text-gray-600">·</span>
          <Link href="#modules" className="px-4 py-2 hover:text-white transition-colors">Modules</Link>
          <span className="text-gray-600">·</span>
          <Link href="#about" className="px-4 py-2 hover:text-white transition-colors">About</Link>
          <span className="text-gray-600">·</span>
          <Link href="#contact" className="px-4 py-2 hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-[#a8e63d] text-gray-900 text-sm font-bold rounded-full hover:brightness-110 transition-all"
          >
            Launch Dashboard
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-[#232323] p-6 shadow-2xl flex flex-col gap-4"
        >
          <Link href="/" className="text-white font-semibold">Home</Link>
          <Link href="#modules" className="text-gray-400">Modules</Link>
          <Link href="#about" className="text-gray-400">About</Link>
          <Link href="#contact" className="text-gray-400">Contact</Link>
          <Link href="/dashboard" className="w-full text-center py-3 bg-[#a8e63d] text-gray-900 rounded-xl font-bold">
            Launch Dashboard
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

/* ─────────────────────────────────────────────
   HERO BENTO — 5-COLUMN STAGGERED
   Col 1 & 5: top-aligned  |  Col 2 & 4: mt-10
   Col 3: mt-20 (center dip)
───────────────────────────────────────────── */

/** Col 1 — Dark forest-green stat card */
const Col1Card = () => (
  <motion.div
    initial={{ opacity: 0, x: -24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3, duration: 0.6 }}
    className="relative bg-[#0d2b1d] rounded-[1.75rem] p-7 flex flex-col justify-between text-white overflow-hidden h-[360px] border border-[#1a4a2a]"
  >
    {/* decorative rings */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute border border-white/10 rounded-full"
          style={{
            width: `${90 + i * 50}px`,
            height: `${90 + i * 50}px`,
            top: `${-10 + i * 10}px`,
            right: `${-40 + i * 6}px`,
          }}
        />
      ))}
    </div>

    <div className="relative z-10">
      <span className="text-7xl font-black leading-none text-[#a8e63d]">6</span>
      <p className="text-sm mt-4 text-green-300/80 leading-relaxed max-w-[150px]">
        Engineering modules — power, water, fire, battery &amp; more
      </p>
    </div>

    <button className="relative z-10 flex items-center justify-between bg-[#a8e63d] text-gray-900 font-bold text-sm px-5 py-3 rounded-full w-full hover:brightness-105 transition-all">
      <span>See all modules</span>
      <span className="w-7 h-7 bg-gray-900 text-[#a8e63d] rounded-full flex items-center justify-center">
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </button>
  </motion.div>
);

/** Col 1 — bottom label bar (separate element) */
const Col1Bar = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.4 }}
    className="bg-[#111111] border border-[#1e1e1e] rounded-[1.25rem] px-5 py-4 flex items-center gap-3 mt-3"
  >
    <Smile className="w-5 h-5 text-[#a8e63d] shrink-0" />
    <span className="text-white text-sm font-bold">Live sensor data</span>
  </motion.div>
);

/** Col 2 & 4 — Photo card */
const PhotoCard = ({
  src, tag, title, delay = 0,
}: {
  src: string; tag: string; title: string; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.55 }}
    className="relative overflow-hidden rounded-[1.75rem] h-[380px] flex flex-col justify-end group cursor-pointer"
  >
    <Image src={src} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

    {/* Tag */}
    <div className="absolute top-5 left-5">
      <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15">
        {tag}
      </span>
    </div>

    {/* Bottom */}
    <div className="relative z-10 p-6">
      <p className="text-white text-lg font-bold leading-snug mb-4">{title}</p>
      <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#a8e63d] transition-colors cursor-pointer">
        <ArrowUpRight className="w-4 h-4 text-gray-900" />
      </span>
    </div>
  </motion.div>
);

/** Col 3 — Center join/community card */
const JoinCard = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.45, duration: 0.5 }}
    className="bg-[#161616] border border-[#2a2a2a] rounded-[1.75rem] h-[280px] flex flex-col items-center justify-center text-center p-8"
  >
    <p className="text-white text-xl font-black leading-tight mb-1">Official Agency</p>
    <p className="text-white text-xl font-black leading-tight mb-6">
      Visit <span className="text-[#a8e63d]">NIWA</span>
    </p>
    <a
      href="https://niwa.gov.ng"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors group"
    >
      <span>Visit NIWA official website</span>
      <span className="w-7 h-7 bg-[#1e1e1e] border border-[#333] text-white rounded-full flex items-center justify-center group-hover:bg-[#a8e63d] group-hover:text-gray-900 transition-all">
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </a>
  </motion.div>
);

const Col5Card = () => (
  <motion.div
    initial={{ opacity: 0, x: 24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3, duration: 0.6 }}
    whileHover={{ y: -5 }}
    className="relative bg-[#0a0a0a] rounded-[2rem] overflow-hidden h-[360px] flex flex-col border border-white/[0.05] group"
  >
    {/* Animated background patterns */}
    <div className="absolute inset-0 pointer-events-none opacity-20">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#a8e63d]/20 blur-[80px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#a8e63d]/10 blur-[60px] rounded-full" />
    </div>

    <div className="relative flex-1 overflow-hidden">
      <Image
        src="/images/collaboration_premium.png"
        alt="Engineering Synergy"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/20 to-[#0a0a0a]" />
      
      {/* Decorative Label */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#a8e63d]">
          Synergy
        </span>
      </div>
    </div>

    <div className="p-5 pt-0 relative z-10">
      <div className="mb-4">
        <h4 className="text-white font-bold text-lg leading-tight mb-1">Engineering Partnership</h4>
        <p className="text-gray-500 text-xs">Unlocking potential through collaboration.</p>
      </div>
      <button className="flex items-center justify-between bg-[#a8e63d] text-gray-900 font-black text-[10px] uppercase tracking-wider px-6 py-4 rounded-2xl w-full hover:bg-white transition-all shadow-[0_0_20px_rgba(168,230,61,0.2)]">
        <span>Connect & Discover</span>
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

/** Col 5 — bottom label bar (separate element) */
const Col5Bar = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.4 }}
    className="bg-[#111111] border border-[#1e1e1e] rounded-[1.25rem] px-5 py-4 flex items-center gap-3 mt-3"
  >
    <Heart className="w-5 h-5 text-[#a8e63d] shrink-0" />
    <span className="text-white text-sm font-bold">Engineering project / 2026</span>
  </motion.div>
);

/* ─────────────────────────────────────────────
   MODULE CARD (below fold)
───────────────────────────────────────────── */
const ModuleCard = ({
  icon: Icon, title, status, description, color, size = "small",
}: {
  icon: React.ElementType; title: string; status: string;
  description: string; color: string; size?: string;
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    className={`relative overflow-hidden bg-[#111111] border border-[#232323] rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer hover:border-[#a8e63d]/30 hover:shadow-lg hover:shadow-[#a8e63d]/5 transition-all ${
      size === "large" ? "md:col-span-2 row-span-2 min-h-[400px]" : "min-h-[260px]"
    }`}
  >
    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="w-10 h-10 bg-[#1e1e1e] rounded-full flex items-center justify-center border border-[#333]">
        <ArrowUpRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
    <div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${color}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#a8e63d] transition-colors">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">{description}</p>
    </div>
    <div className="mt-6 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500/80">{status}</span>
    </div>
  </motion.div>
);

const StepCard = ({
  number, title, description, icon: Icon,
}: {
  number: string; title: string; description: string; icon: React.ElementType;
}) => (
  <div className="relative p-8 rounded-[2rem] bg-[#111111] border border-[#232323] flex flex-col gap-6 group hover:border-[#a8e63d]/30 transition-all">
    <div className="w-16 h-16 rounded-2xl bg-[#1a2e1a] flex items-center justify-center border border-[#a8e63d]/20 text-[#a8e63d] group-hover:bg-[#a8e63d] group-hover:text-gray-900 transition-all">
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
    <div className="absolute top-8 right-8 text-6xl font-black text-white/5 select-none">{number}</div>
  </div>
);

const CollaborationSection = () => (
  <section className="py-24 px-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#84cc16]/5 blur-3xl rounded-full" />
    <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-[#84cc16]/5 blur-3xl rounded-full" />
    
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84cc16] mb-4">Collaboration</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8">
          Engineering <span className="text-[#84cc16]">Synergy</span>
        </h2>
        
        <div className="space-y-6">
          <p className="text-gray-400 text-lg leading-relaxed">
            NPAS is built on the foundation of seamless collaboration between hardware engineering and modern software development. 
            By bridging the gap between ESP32 sensors and real-time data analytics, we've created a unified ecosystem for facility management.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <div className="w-12 h-12 rounded-xl bg-[#0d2b1d] flex items-center justify-center text-[#84cc16] shrink-0 border border-[#84cc16]/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Hardware Integration</h4>
                <p className="text-gray-500 text-xs">Precise sensor calibration and firmware logic.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <div className="w-12 h-12 rounded-xl bg-[#0d2b1d] flex items-center justify-center text-[#84cc16] shrink-0 border border-[#84cc16]/20">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Software Precision</h4>
                <p className="text-gray-500 text-xs">Scalable real-time monitoring and analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative"
      >
        <div className="relative z-10 p-8 rounded-[2.5rem] bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/[0.08] shadow-2xl">
          <Image 
            src="/images/bigmac.svg" 
            alt="Collaboration Synergy" 
            width={600} 
            height={600} 
            className="w-full h-auto"
            style={{ filter: "drop-shadow(0 0 20px rgba(132,204,22,0.15))" }}
          />
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#84cc16]/10 blur-2xl rounded-full animate-pulse" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#84cc16]/10 blur-2xl rounded-full animate-pulse" />
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  const modules = [
    { icon: Zap, title: "Power Monitoring", status: "Active", description: "Real-time voltage, current, and power consumption analytics for industrial loads.", color: "bg-blue-600", size: "large" },
    { icon: Droplets, title: "Water Control", status: "Automated", description: "Intelligent tank level monitoring with automatic pump triggers.", color: "bg-emerald-600" },
    { icon: RefreshCcw, title: "Changeover", status: "Generator Off", description: "Seamless switching between NEPA and backup power sources.", color: "bg-amber-500" },
    { icon: Battery, title: "Battery Monitor", status: "92% Healthy", description: "Deep analytics for inverter battery health and percentage.", color: "bg-purple-600" },
    { icon: UserCheck, title: "Attendance", status: "Log Connected", description: "RFID-based smart logging for team members and restricted zones.", color: "bg-slate-600" },
    { icon: Flame, title: "Fire Detection", status: "System Safe", description: "Critical safety monitoring with instant fire/danger alerts.", color: "bg-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-[#a8e63d]/30">
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-10 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Headline block */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="text-5xl md:text-[4.5rem] font-black text-white tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Smart IoT systems are built with a single platform
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="text-gray-400 text-base max-w-md mx-auto leading-relaxed"
            >
              NPAS is an IT engineering project, a unified IoT dashboard for monitoring power, water, fire, attendance, and battery systems in real-time using ESP32 hardware.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
            >
              <Link
                href="/dashboard"
                className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-full hover:bg-[#a8e63d] hover:text-gray-900 transition-all text-sm border border-gray-700"
              >
                View Dashboard
              </Link>
              <button className="flex items-center gap-2.5 px-8 py-3.5 bg-transparent border border-[#2e2e2e] text-white font-semibold rounded-full hover:border-[#a8e63d]/40 transition-all text-sm">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white" />
                </span>
                Watch Video
              </button>
            </motion.div>
          </div>

          {/* ── 5-COLUMN STAGGERED BENTO GRID ── */}
          <div className="grid grid-cols-5 gap-3 mt-12 items-start">

            {/* Col 1 — dark green stat + bar (top) */}
            <div className="flex flex-col">
              <Col1Card />
              <Col1Bar />
            </div>

            {/* Col 2 — photo card (staggered down) */}
            <div className="mt-10">
              <PhotoCard
                src="/images/hero_hardware.png"
                tag="Power"
                title="Live power analytics for industrial loads"
                delay={0.4}
              />
            </div>

            {/* Col 3 — join card (deepest stagger) */}
            <div className="mt-20">
              <JoinCard />
            </div>

            {/* Col 4 — photo card (same stagger as col 2) */}
            <div className="mt-10">
              <PhotoCard
                src="/images/hero_water.png"
                tag="Water / Fire"
                title="Monitor water tank and fire detection systems"
                delay={0.45}
              />
            </div>

            {/* Col 5 — lime card + bar (top) */}
            <div className="flex flex-col">
              <Col5Card />
              <Col5Bar />
            </div>

          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#a8e63d] mb-3">The Modules</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Connected Ecosystem</h2>
            </div>
            <p className="max-w-md text-gray-500 text-base leading-relaxed">
              Every critical engineering module monitored and controlled in real-time. Efficiency powered by IoT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-fr">
            {modules.map((m, i) => (
              <ModuleCard key={i} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-[#070707] border-y border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#a8e63d] mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">From sensor to dashboard</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard number="01" icon={Cpu} title="Sensors Collect" description="ESP32 sensors gather real-time voltage, water levels, RFID codes, smoke and history data." />
            <StepCard number="02" icon={Globe} title="API Processes" description="NPAS API securely routes data from field devices to Firebase, SQL and push notifications." />
            <StepCard number="03" icon={LayoutDashboard} title="Dashboard Displays" description="Your admin dashboard shows real-time events, charts, and table status in one place." />
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section id="dashboard" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#a8e63d] mb-4">Dashboard</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Everything in <span className="text-[#a8e63d]">one view</span>
            </h2>
            <p className="text-gray-500 text-base mb-10 leading-relaxed">
              Real-time alerts. Historical logs. Module controls. No more switching between tools — NPAS centralises your entire facility intelligence.
            </p>
            <ul className="space-y-5 mb-10">
              {[
                "Live charts for every module",
                "Push alerts for fire, low battery, water",
                "Expandable attendance & event logs",
              ].map((item) => (
                <li key={item} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-[#1a2e1a] flex items-center justify-center text-[#a8e63d] group-hover:bg-[#a8e63d] group-hover:text-gray-900 transition-all border border-[#a8e63d]/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#333] rounded-full font-semibold text-sm text-white hover:bg-[#a8e63d] hover:text-gray-900 hover:border-[#a8e63d] transition-all"
            >
              Preview Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[#a8e63d]/5 blur-3xl rounded-full" />
            <div className="relative rounded-[2rem] overflow-hidden border border-[#232323] shadow-2xl bg-[#111111]">
              <div className="h-8 bg-[#0d0d0d] flex items-center px-5 gap-1.5 border-b border-[#1e1e1e]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              </div>
              <div className="p-3 bg-black/40">
                <Image 
                  src="/dashboard-snapshot-v2.png" 
                  alt="Dashboard Preview" 
                  width={1400} 
                  height={1000} 
                  quality={100}
                  unoptimized
                  priority
                  className="rounded-xl shadow-2xl w-full h-auto" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLLABORATION ── */}
      <CollaborationSection />

      {/* ── TEAM ── */}
      <section id="about" className="py-20 px-6 border-t border-white/[0.04]" style={{ background: "#050505" }}>
        <div className="max-w-7xl mx-auto">
          {/* 1 — Label + Heading */}
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84cc16] mb-3">The Team</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Built by <span className="text-[#84cc16]">students</span>
            </h2>
          </div>

          {/* 2 — Institution block */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ background: "rgba(132,204,22,0.05)", border: "1px solid rgba(132,204,22,0.3)" }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#84cc16" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zm0 0v10m-8 2l8 4 8-4" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: "rgba(132,204,22,0.8)" }}>
                Federal University Oye-Ekiti &nbsp;&middot;&nbsp; Ekiti State, Nigeria
              </span>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-xl">
              This project was developed as part of an IT Project in 2026, under the Department of
              Electrical &amp; Electronics Engineering. NPAS represents a practical solution to real-world
              power and facility management challenges faced in Nigerian institutions.
            </p>
          </div>

          {/* 3 — Supervisor card */}
          <div className="mb-8 rounded-2xl px-6 py-5" style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "3px solid #84cc16" }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#84cc16]">Project Supervisor</p>
            <p className="text-white font-bold text-base mt-2">[Supervisor Name]</p>
            <p className="text-gray-500 text-sm">Department of Electrical &amp; Electronics Engineering</p>
            <p className="text-gray-600 text-sm">Federal University Oye-Ekiti</p>
            <p className="text-gray-600 text-xs italic mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              &ldquo;We are grateful for the guidance and support provided throughout this project.&rdquo;
            </p>
          </div>

          {/* 4 — Team member cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {/* Faruna Victor */}
            <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0d2b1d] flex items-center justify-center text-lg font-black text-[#84cc16] shrink-0" style={{ border: "2px solid rgba(132,204,22,0.25)" }}>FV</div>
                <div>
                  <h3 className="text-white font-bold text-base">Faruna Victor</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Lead · Software &amp; Web Development</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "Node.js", "PostgreSQL", "UI/UX"].map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-md text-gray-400" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>{tag}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <a href="#" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-[#84cc16] transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.19a11.1 11.1 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.64 1.59.24 2.77.12 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.2 21.42 23.5 17.1 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
                  GitHub
                </a>
                <a href="#" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-[#84cc16] transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.91 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 20.45h3.56V9H3.56v11.45zM22.22 0H1.78C.8 0 0 .78 0 1.73v20.54C0 23.22.8 24 1.78 24h20.44C23.2 24 24 23.22 24 22.27V1.73C24 .78 23.2 0 22.22 0z"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Ajayi Korede */}
            <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0d2b1d] flex items-center justify-center text-lg font-black text-[#84cc16] shrink-0" style={{ border: "2px solid rgba(132,204,22,0.25)" }}>AK</div>
                <div>
                  <h3 className="text-white font-bold text-base">Ajayi Korede</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Co-Lead · Hardware &amp; IoT Integration</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["ESP32", "Arduino", "C++", "IoT Sensors"].map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-md text-gray-400" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>{tag}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <a href="#" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-[#84cc16] transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.19a11.1 11.1 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.64 1.59.24 2.77.12 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.2 21.42 23.5 17.1 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
                  GitHub
                </a>
                <a href="#" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-[#84cc16] transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.91 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 20.45h3.56V9H3.56v11.45zM22.22 0H1.78C.8 0 0 .78 0 1.73v20.54C0 23.22.8 24 1.78 24h20.44C23.2 24 24 23.22 24 22.27V1.73C24 .78 23.2 0 22.22 0z"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* 5 — Mission quote */}
          <div className="text-center">
            <div className="w-8 h-px bg-[#84cc16] mx-auto mb-5" />
            <p className="text-gray-400 text-base italic leading-relaxed max-w-xl mx-auto">
              &ldquo;Built to solve the real power, water, and facility challenges we see every day in Nigerian institutions.&rdquo;
            </p>
            <p className="text-xs font-semibold mt-4" style={{ color: "rgba(132,204,22,0.5)" }}>
              — Faruna &amp; Korede, FUOYE 2026
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="py-14 border-t border-[#1a1a1a] px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="relative overflow-hidden" style={{ width: 80, height: 34 }}>
            <Image
              src="/logo.svg"
              alt="NPAS Logo"
              width={100}
              height={100}
              style={{ 
                filter: "brightness(1.3) drop-shadow(0 0 4px rgba(168,230,61,0.25))", 
                display: "block",
                marginTop: -28 // Tight pull to keep text below the 34px frame
              }}
            />
          </div>
          <p className="text-gray-600 text-sm">
            &copy; 2026 Niwa Power &amp; Automation Solutions. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
