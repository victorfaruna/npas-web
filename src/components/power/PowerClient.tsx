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
  LucideIcon,
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
  const { data: switches = [], mutate } = useSWR<Switch[]>(
    "/api/power",
    fetcher,
    {
      refreshInterval: 3000,
    },
  );

  const [progressStates, setProgressStates] = React.useState<
    Record<string, number>
  >({});

  const toggle = async (id: string) => {
    const currentSwitch = switches.find((s) => s.id === id);
    if (!currentSwitch) return;
    if (progressStates[id] !== undefined) return; // Prevent toggling while loading

    const newState = !currentSwitch.state;

    // Optimistic update so the toggle visual slides over immediately
    mutate(
      switches.map((s) => (s.id === id ? { ...s, state: newState } : s)),
      false,
    );

    // Step 1: Toggle initiated
    setProgressStates((prev) => ({ ...prev, [id]: 1 }));

    // A tiny delay just so step 1 renders, then we immediately start loading
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Step 2: Loading (tied directly to the fetch request)
    setProgressStates((prev) => ({ ...prev, [id]: 2 }));

    try {
      await fetch("/api/power", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, state: newState }),
      });
    } catch (e) {
      console.error(e);
      // Revert optimistic update if error
      mutate(
        switches.map((s) => (s.id === id ? { ...s, state: !newState } : s)),
        false,
      );
      // Remove loading state
      setProgressStates((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    // Step 3: Success (immediately after the request finishes)
    setProgressStates((prev) => ({ ...prev, [id]: 3 }));
    mutate(); // Fetch fresh data

    // Hide/reset stepper after showing success for a bit
    setTimeout(() => {
      setProgressStates((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 2000);
  };

  const setAll = async (state: boolean) => {
    mutate(
      switches.map((s) => ({ ...s, state })),
      false,
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
    <div className="max-w-290">
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
            <span className="text-foreground/60 text-sm font-medium ">W</span>
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
              <p className="text-foreground/60 text-sm ">Active connections</p>
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
                className="bg-card border border-foreground/5 rounded-sm p-4 flex flex-col gap-6 h-[320px] justify-between"
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
                    disabled={progressStates[s.id] !== undefined}
                    className={`w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${
                      s.state ? "bg-blue-700" : "bg-muted-foreground/30"
                    } ${progressStates[s.id] !== undefined ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        s.state ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Stepper UI */}
                <div className="flex-1 flex flex-col justify-center relative py-2 pl-2 mt-2">
                  {/* Vertical line connecting steps */}
                  <div className="absolute left-[17px] top-6 bottom-10 w-[2px] bg-foreground/10" />

                  {[
                    { title: "Toggle", desc: "Request initiated" },
                    { title: "Load", desc: "Processing request" },
                    { title: "Success", desc: "Successful request" },
                  ].map((step, idx) => {
                    const stepNum = idx + 1;
                    const currentStep = progressStates[s.id] ?? 3;
                    const isCompleted =
                      currentStep > stepNum ||
                      (currentStep === 3 && stepNum === 3);
                    const isCurrent = currentStep === stepNum;

                    const activeColorClass = s.state
                      ? "bg-[#5252ff]"
                      : "bg-orange-500";
                    const activeBorderClass = s.state
                      ? "border-[#5252ff]"
                      : "border-orange-500";
                    const activeRingClass = s.state
                      ? "ring-[#5252ff]/20"
                      : "ring-orange-500/20";

                    return (
                      <div
                        key={idx}
                        className="flex gap-4 items-start relative z-10 mb-4 last:mb-0"
                      >
                        {/* Background highlight for current step */}
                        {isCurrent && (
                          <div className="absolute -inset-y-1 -inset-x-2 bg-foreground/5 rounded-md -z-10" />
                        )}

                        {/* Circle */}
                        <div className="flex-shrink-0 mt-0.5 relative flex items-center justify-center w-5 h-5">
                          {isCompleted ? (
                            <div
                              className={`w-4 h-4 rounded-full ${activeColorClass} flex items-center justify-center`}
                            >
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                          ) : isCurrent ? (
                            <div
                              className={`size-4 rounded-full ring-4 ${activeRingClass} border-2 ${activeBorderClass} bg-background flex items-center justify-center`}
                            >
                              <div
                                className={`w-2 h-2 ${activeColorClass} rounded-full`}
                              />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-foreground/20 bg-background" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex flex-col">
                          <p
                            className={`text-sm font-semibold ${isCompleted || isCurrent ? "text-foreground" : "text-foreground/40"}`}
                          >
                            {step.title}
                          </p>
                          <p
                            className={`text-[12px] leading-snug ${isCompleted || isCurrent ? "text-foreground/70" : "text-foreground/40"}`}
                          >
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
