"use client";

import React, { useMemo } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  Zap,
  Lightbulb,
  Fan,
  Server,
  Plug,
  ShieldCheck,
  Power,
  Activity,
  LucideIcon
} from "lucide-react";
import type { Switch } from "@/lib/powerStore";

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Fan,
  Server,
  Plug,
  ShieldCheck,
  Zap,
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3, ease: "easeOut" as const },
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PowerClient() {
  const { data: switches = [], mutate } = useSWR<Switch[]>("/api/power", fetcher, {
    refreshInterval: 1000,
  });

  const toggle = async (id: string) => {
    const currentSwitch = switches.find((s) => s.id === id);
    if (!currentSwitch) return;
    const newState = !currentSwitch.state;

    // Optimistic update
    mutate(
      switches.map((s) => (s.id === id ? { ...s, state: newState } : s)),
      false
    );

    await fetch("/api/power", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, state: newState }),
    });

    mutate();
  };

  const setAll = async (state: boolean) => {
    mutate(
      switches.map((s) => ({ ...s, state })),
      false
    );
    await fetch("/api/power", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setAll", state }),
    });
    mutate();
  };

  const totalLoad = useMemo(
    () => switches.reduce((acc, s) => (s.state ? acc + s.power : acc), 0),
    [switches],
  );
  const activeCount = switches.filter((s) => s.state).length;

  return (
    <div className="max-w-290 ">
      {/* Header */}
      <motion.div
        {...fade(0)}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3"
      >
        <div>
          <h4 className="text-lg font-medium text-foreground ">
            Power Controls
          </h4>

          <p className="text-foreground/60 text-sm ">
            Real-time energy load management
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAll(false)}
            className="flex items-center gap-2 bg-transparent border border-border hover:border-foreground/20 px-3.5 py-2 rounded-sm text-xs font-medium text-foreground/60 hover:text-foreground transition-all "
          >
            Power Down All
          </button>
          <button
            onClick={() => setAll(true)}
            className="flex items-center gap-1.5 bg-foreground text-background px-3.5 py-2 rounded-sm text-xs font-semibold hover:bg-foreground/90 transition-all "
          >
            Power Up All
            <Power size={13} />
          </button>
        </div>
      </motion.div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4 max-w-200">
        {/* Load Stat */}
        <motion.div
          {...fade(0.1)}
          className="bg-foreground/3 gap-10 border border-foreground/2 rounded-md p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground ">
                Current Load
              </h4>
              <p className="text-foreground/60 text-sm mt-0.5 ">
                Total active draw
              </p>
            </div>
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-500/10">
              <Zap size={15} className="text-blue-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-4">
            <span className="text-3xl font-semibold text-foreground ">
              {totalLoad}
            </span>
            <span className="text-foreground/60 text-sm font-medium ">
              W
            </span>
          </div>
        </motion.div>

        {/* Status Stat */}
        <motion.div
          {...fade(0.15)}
          className="bg-foreground/3 gap-10 border border-foreground/2 rounded-md p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground ">
                System Status
              </h4>
              <p className="text-foreground/60 text-sm ">
                Active connections
              </p>
            </div>
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-emerald-500/10">
              <Activity size={15} className="text-emerald-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-4">
            <span className="text-3xl font-semibold text-foreground ">
              {activeCount}
            </span>
            <span className="text-foreground/60 text-sm font-medium ">
              / {switches.length} ONLINE
            </span>
          </div>
        </motion.div>
      </div>

      {/* Switches Grid */}
      <motion.div {...fade(0.2)}>
        <h4 className="text-lg font-medium text-foreground mt-10 mb-3">
          Module Relays
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {switches.map((s) => {
            const IconComponent = iconMap[s.iconName] || Plug;
            
            return (
              <div
                key={s.id}
                className="bg-card border border-foreground/5 rounded-sm p-4 flex flex-col gap-20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `${s.color}14` }}
                    >
                      <IconComponent size={15} style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground ">
                        {s.name}
                      </p>
                      <p className="text-[13px] text-foreground/60 ">
                        {s.area}
                      </p>
                    </div>
                  </div>

                  {/* Minimalist Switch */}
                  <button
                    onClick={() => toggle(s.id)}
                    className={`w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${
                      s.state ? "bg-blue-700" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        s.state ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span
                    className={`text-[11px] font-semibold px-1 py-0.5 rounded border ${
                      s.state
                        ? "border-emerald-500/20 text-emerald-600 bg-emerald-500/5"
                        : "border-muted-foreground/20 text-foreground/60 bg-muted/50"
                    }`}
                  >
                    {s.state ? "Online" : "Offline"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-foreground ">
                      {s.state ? s.power : 0}
                    </span>
                    <span className="text-foreground/60 text-[13px] font-medium ">
                      W
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
