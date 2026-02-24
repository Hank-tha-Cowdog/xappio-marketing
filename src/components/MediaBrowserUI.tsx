"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { thumbImages } from "@/lib/images";

const popupPlaybackImage = "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&h=675&fit=crop&q=90";

const mediaGrid = [
  { img: 0, name: "ICE_0847.mov", dur: "00:42", res: "4K" },
  { img: 1, name: "ICE_0912.mov", dur: "01:13", res: "4K" },
  { img: 2, name: "ICE_1204.mov", dur: "00:38", res: "4K" },
  { img: 3, name: "ICE_0331.mov", dur: "02:05", res: "4K" },
  { img: 4, name: "ICE_0519.mov", dur: "01:28", res: "4K" },
  { img: 5, name: "ICE_0766.mov", dur: "00:55", res: "4K" },
  { img: 8, name: "ICE_1087.mov", dur: "01:42", res: "4K" },
  { img: 9, name: "ICE_0290.mov", dur: "00:33", res: "4K" },
  { img: 10, name: "ICE_0614.mov", dur: "01:09", res: "1080p" },
  { img: 11, name: "ICE_0402.mov", dur: "01:55", res: "4K" },
  { img: 12, name: "FAC_0114.mov", dur: "01:34", res: "4K" },
  { img: 13, name: "FAC_0227.mov", dur: "01:15", res: "4K" },
  { img: 14, name: "DST_0088.mov", dur: "02:18", res: "4K" },
  { img: 15, name: "DST_0155.mov", dur: "01:14", res: "4K" },
  { img: 6, name: "INT_MARIA_03.mov", dur: "02:18", res: "1080p" },
  { img: 7, name: "INT_DAVID_12.mov", dur: "01:44", res: "4K" },
];

const popupTranscript = [
  { tc: "00:05:12", text: "The sky began to shift around midnight." },
  { tc: "00:05:18", text: "A faint green ribbon appeared above the ridge." },
  { tc: "00:05:25", text: "We set up the tripod as quickly as we could." },
  { tc: "00:05:32", text: "The aurora is caused by charged particles from the sun." },
  { tc: "00:05:38", text: "At this latitude, displays can last for hours." },
  { tc: "00:05:45", text: "We started shooting wide — 14mm, f/1.8." },
  { tc: "00:05:52", text: "Can you see that? It's moving." },
  { tc: "00:05:58", text: "[ambient — wind, camera shutter clicks]" },
  { tc: "00:06:02", text: "For the crew, this was the shot they'd been waiting for." },
  { tc: "00:06:08", text: "Three weeks in Iceland, and finally —" },
  { tc: "00:06:15", text: "the sky came alive." },
  { tc: "00:06:22", text: "The colors shifted from green to violet." },
  { tc: "00:06:28", text: "We ran through four batteries that night." },
  { tc: "00:06:35", text: "Nobody wanted to stop shooting." },
  { tc: "00:06:42", text: "I've never seen anything like this." },
  { tc: "00:06:48", text: "It's like the whole sky is breathing." },
];

const sceneDescription = [
  { label: "Scene", value: "Aurora borealis above Víkurfjall ridge" },
  { label: "Location", value: "65.6°N, 18.1°W — Northern Iceland" },
  { label: "Date", value: "October 14, night shoot" },
  { label: "Weather", value: "Clear, -3°C, wind 8km/h NE" },
  { label: "Camera", value: "RED Komodo, 14mm f/1.8" },
  { label: "Duration", value: "Extended shoot 23:45 - 03:20" },
  { label: "Peak Activity", value: "01:15 - 01:45" },
  { label: "Coverage", value: "Wide establishing, medium tracking, close-up time-lapse" },
];

const notesContent = [
  "Best take: 01:15:22 - 01:16:48 (green/violet transition)",
  "Consider for Episode 2 opening montage",
  "Audio usable — wind is present but atmospheric",
  "Color grade note: preserve natural green, don't push saturation",
  "Director note: \"This is the heart of the film\"",
  "Needs stabilization on medium shots (wind vibration)",
];

const techSpecs = [
  { label: "Codec", value: "H.265 (HEVC)" },
  { label: "Resolution", value: "3840 × 2160" },
  { label: "Frame Rate", value: "23.98 fps" },
  { label: "Audio", value: "PCM 48kHz 24-bit" },
  { label: "Duration", value: "01:13" },
  { label: "Size", value: "3.8 GB" },
  { label: "Color", value: "Rec. 2020" },
  { label: "Bit Depth", value: "10-bit" },
];

type Step = {
  hoveredCard: number | null;
  selectedCard: number | null;
  popupOpen: boolean;
  popupLine: number;
  popupTimecode: string;
  popupTab: number;
  selectsGlow?: boolean;
  duration: number;
};

const animationSteps: Step[] = [
  // Phase 1: Browsing
  { hoveredCard: 3, selectedCard: null, popupOpen: false, popupLine: 0, popupTimecode: "", popupTab: 0, duration: 2500 },
  { hoveredCard: 7, selectedCard: null, popupOpen: false, popupLine: 0, popupTimecode: "", popupTab: 0, duration: 2000 },
  { hoveredCard: 1, selectedCard: null, popupOpen: false, popupLine: 0, popupTimecode: "", popupTab: 0, duration: 2500 },
  // Phase 2: Select aurora clip
  { hoveredCard: 1, selectedCard: 1, popupOpen: false, popupLine: 0, popupTimecode: "", popupTab: 0, duration: 1200 },
  // Phase 3: Popup opens — transcript tab
  { hoveredCard: null, selectedCard: 1, popupOpen: true, popupLine: 0, popupTimecode: "00:05:12:00", popupTab: 0, duration: 3000 },
  { hoveredCard: null, selectedCard: 1, popupOpen: true, popupLine: 4, popupTimecode: "00:05:38:00", popupTab: 0, duration: 3000 },
  { hoveredCard: null, selectedCard: 1, popupOpen: true, popupLine: 8, popupTimecode: "00:06:02:00", popupTab: 0, duration: 3000 },
  // Click specific transcript line — selectsGlow on this step
  { hoveredCard: null, selectedCard: 1, popupOpen: true, popupLine: 12, popupTimecode: "00:06:28:00", popupTab: 0, selectsGlow: true, duration: 3500 },
  // Switch to Scene Description
  { hoveredCard: null, selectedCard: 1, popupOpen: true, popupLine: 12, popupTimecode: "00:06:28:00", popupTab: 1, duration: 3000 },
  // Switch to Notes
  { hoveredCard: null, selectedCard: 1, popupOpen: true, popupLine: 12, popupTimecode: "00:06:28:00", popupTab: 2, duration: 3000 },
  // Close popup
  { hoveredCard: null, selectedCard: null, popupOpen: false, popupLine: 0, popupTimecode: "", popupTab: 0, duration: 3000 },
];

const tabLabels = ["Transcript", "Scene Description", "Notes"];

export default function MediaBrowserUI() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = animationSteps[stepIndex];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStepIndex((prev) =>
        prev >= animationSteps.length - 1 ? 0 : prev + 1
      );
    }, step.duration);
    return () => clearTimeout(timeout);
  }, [stepIndex, step.duration]);

  const previewCard = step.hoveredCard !== null
    ? mediaGrid[step.hoveredCard]
    : step.selectedCard !== null
    ? mediaGrid[step.selectedCard]
    : mediaGrid[0];

  const transcriptOffset = Math.max(0, step.popupLine * 26 - 80);

  return (
    <section className="bg-black px-2 sm:px-4 py-20 sm:py-32">
      <div className="mx-auto w-full max-w-[1800px] flex flex-col items-center gap-12 sm:gap-16">
        <h2 className="text-center text-2xl sm:text-3xl font-light text-gray-400 tracking-tight">
          Browse. Preview. Select.
        </h2>

        <div className="relative w-full flex justify-center" style={{ perspective: "3200px" }}>
          {/* 3D UI container */}
          <div
            className="relative w-full max-w-[1600px]"
            style={{
              transform: "rotateX(6deg) rotateY(-14deg) rotateZ(0.5deg)",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >

            {/* Card thickness layer */}
            <div
              className="absolute inset-0 -z-10 rounded-xl border border-purple-500/20 bg-purple-950/50"
              style={{ transform: "translateZ(-8px)" }}
            />

            {/* Main card */}
            <div
              className="relative rounded-xl border border-purple-500/30 bg-zinc-950 overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: [
                  "0 0 40px 10px rgba(147,51,234,0.12)",
                  "0 0 80px 30px rgba(147,51,234,0.09)",
                  "0 0 120px 50px rgba(147,51,234,0.07)",
                  "0 0 180px 80px rgba(147,51,234,0.05)",
                  "0 0 260px 120px rgba(147,51,234,0.035)",
                  "0 0 360px 170px rgba(147,51,234,0.02)",
                  "0 0 500px 240px rgba(147,51,234,0.01)",
                  "20px 40px 80px rgba(0,0,0,0.6)",
                ].join(", "),
              }}
            >
              <div className="flex h-[560px] sm:h-[660px] md:h-[760px] lg:h-[840px]">
                {/* Sidebar icon rail */}
                <div className="w-[52px] shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col items-center">
                  <div className="py-4">
                    <span className="text-[10px] font-bold text-zinc-50">x</span>
                  </div>
                  <nav className="flex-1 space-y-1 py-2">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-md flex items-center justify-center bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                  </nav>
                  <div className="pb-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-[7px] font-medium text-zinc-300">ZA</span>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col">
                  <div className="shrink-0 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                    <div className="text-[11px] font-bold text-zinc-50">Archive Browser</div>
                    <div className="flex gap-1.5 text-[9px] text-zinc-500">
                      <span className="px-2 py-0.5 rounded border border-zinc-800">Search</span>
                      <span className="px-2 py-0.5 rounded border border-zinc-800">Filter</span>
                    </div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                    {/* Media Browser — expanded, wide */}
                    <div className="w-[280px] sm:w-[340px] md:w-[400px] shrink-0 border-r border-zinc-800 flex flex-col">
                      <div className="px-2.5 py-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">Media</span>
                        <span className="text-[7px] text-zinc-600">{mediaGrid.length} clips</span>
                      </div>
                      <div className="flex-1 overflow-hidden p-2 grid grid-cols-3 auto-rows-min gap-2 content-start">
                        {mediaGrid.map((item, i) => {
                          const isHovered = step.hoveredCard === i;
                          const isSelected = step.selectedCard === i;
                          return (
                            <div
                              key={item.name}
                              className={`rounded overflow-hidden border transition-all duration-300 ${
                                isSelected
                                  ? "border-amber-500/60 ring-1 ring-amber-500/30"
                                  : isHovered
                                  ? "border-zinc-500 ring-1 ring-zinc-500/20"
                                  : "border-zinc-800"
                              }`}
                            >
                              <div className="relative aspect-video">
                                <Image
                                  src={thumbImages[item.img]}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="128px"
                                  unoptimized
                                />
                                {isHovered && !isSelected && (
                                  <div className="absolute inset-0 bg-white/5" />
                                )}
                                {isSelected && (
                                  <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center">
                                      <svg className="w-3 h-3 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                                        <polygon points="6 3 20 12 6 21 6 3" />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                                <div className="absolute bottom-0 right-0 px-0.5 text-[6px] font-mono bg-black/70 text-white/70">
                                  {item.dur}
                                </div>
                              </div>
                              <div className="px-1 py-0.5 text-[6px] font-mono text-zinc-400 truncate bg-zinc-900">
                                {item.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preview / Playback */}
                    <div className="flex-1 border-r border-zinc-800 flex flex-col min-w-0">
                      <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">Preview</span>
                        <span className="text-[7px] font-mono text-zinc-600">{previewCard.name}</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden border border-zinc-800">
                          {mediaGrid.map((card, i) => (
                            <Image
                              key={i}
                              src={thumbImages[card.img]}
                              alt={card.name}
                              fill
                              className={`object-cover transition-opacity duration-500 ${
                                card === previewCard ? "opacity-100" : "opacity-0"
                              }`}
                              sizes="600px"
                              unoptimized
                            />
                          ))}
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-white/80">
                            {previewCard.res} 23.98fps
                          </div>
                          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-[8px] font-mono text-white/60">
                            {previewCard.name}
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-[8px] font-mono text-white/60">
                            {previewCard.dur}
                          </div>
                        </div>
                        <div className="w-full mt-3">
                          <div className="w-full h-1 rounded-full bg-zinc-800" />
                        </div>
                        <div className="mt-4 text-[9px] text-zinc-500">
                          Double-click a clip to open detail view
                        </div>
                      </div>
                    </div>

                    {/* Chat — collapsed */}
                    <div className="w-[28px] shrink-0 border-r border-zinc-800 flex flex-col items-center bg-zinc-900/30">
                      <div className="py-4 flex-1 flex items-start justify-center">
                        <div
                          className="text-[8px] font-medium text-zinc-500 uppercase tracking-widest whitespace-nowrap"
                          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                          Chat
                        </div>
                      </div>
                    </div>

                    {/* Transcript — collapsed */}
                    <div className="w-[28px] shrink-0 border-r border-zinc-800 flex flex-col items-center bg-zinc-900/30">
                      <div className="py-4 flex-1 flex items-start justify-center">
                        <div
                          className="text-[8px] font-medium text-zinc-500 uppercase tracking-widest whitespace-nowrap"
                          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                          Transcript
                        </div>
                      </div>
                    </div>

                    {/* Selects — collapsed */}
                    <div className="w-[28px] shrink-0 flex flex-col items-center bg-zinc-900/30">
                      <div className="py-4 flex-1 flex items-start justify-center">
                        <div
                          className="text-[8px] font-medium text-zinc-500 uppercase tracking-widest whitespace-nowrap"
                          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                          Selects
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FileDetailModal popup overlay */}
              <div
                className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 ${
                  step.popupOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div
                  className={`relative z-30 w-[90%] max-w-[1100px] h-[80%] rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden flex flex-col transition-transform duration-500 ${
                    step.popupOpen ? "scale-100" : "scale-95"
                  }`}
                  style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
                >
                  {/* Modal header */}
                  <div className="shrink-0 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[11px] font-mono font-medium text-zinc-200">ICE_0912.mov</span>
                      <span className="text-[9px] text-zinc-500">Aurora Borealis — Night Shoot</span>
                    </div>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-200 border border-zinc-700">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>

                  {/* Modal body — two panels */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Left: Playback + Tech Specs */}
                    <div className="w-[45%] shrink-0 border-r border-zinc-800 flex flex-col">
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden border border-zinc-800">
                          <Image
                            src={popupPlaybackImage}
                            alt="ICE_0912.mov"
                            fill
                            className="object-cover"
                            sizes="500px"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-white/80 transition-all duration-500">
                            {step.popupTimecode || "00:05:12:00"}
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-white/80">
                            4K 23.98fps
                          </div>
                        </div>
                        {/* Timeline */}
                        <div className="w-full mt-3 space-y-1">
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 relative">
                            <div
                              className="absolute left-0 top-0 h-full rounded-full bg-amber-500/60 transition-all duration-1000"
                              style={{ width: `${step.popupOpen ? Math.max(15, step.popupLine * 6 + 15) : 0}%` }}
                            />
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-amber-300 transition-all duration-1000"
                              style={{ left: `${step.popupOpen ? Math.max(15, step.popupLine * 6 + 15) : 0}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[7px] font-mono text-zinc-500">
                            <span>{step.popupTimecode ? step.popupTimecode.slice(0, 8) : "00:05:12"}</span>
                            <span>00:06:48</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-2">
                          <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M19 20L9 12l10-8v16z" /><path d="M5 19V5" />
                          </svg>
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                            <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </div>
                          <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M5 4l10 8-10 8V4z" /><path d="M19 5v14" />
                          </svg>
                        </div>
                        {/* Add to Selects button in modal */}
                        <button
                          className={`mt-3 mx-auto flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-medium transition-all duration-500 ${
                            step.selectsGlow
                              ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 selects-glow"
                              : "bg-zinc-800/50 border border-zinc-700 text-zinc-500"
                          }`}
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 4v16m8-8H4" />
                          </svg>
                          Add to Selects
                        </button>
                      </div>
                      {/* Tech specs */}
                      <div className="border-t border-zinc-800 px-4 py-3">
                        <div className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider mb-2">Tech Specs</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {techSpecs.map((spec) => (
                            <div key={spec.label} className="flex justify-between">
                              <span className="text-[7px] text-zinc-500">{spec.label}</span>
                              <span className="text-[7px] font-mono text-zinc-300">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Tabs — Transcript / Scene / Notes */}
                    <div className="flex-1 flex flex-col">
                      {/* Tab bar */}
                      <div className="shrink-0 px-4 py-2 border-b border-zinc-800 flex gap-1">
                        {tabLabels.map((label, i) => (
                          <div
                            key={label}
                            className={`px-3 py-1.5 rounded text-[8px] font-medium transition-colors duration-300 ${
                              step.popupTab === i
                                ? "bg-zinc-800 text-zinc-200"
                                : "text-zinc-500"
                            }`}
                          >
                            {label}
                          </div>
                        ))}
                      </div>

                      {/* Tab content */}
                      <div className="flex-1 overflow-hidden relative">
                        {/* Transcript tab */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 ${
                            step.popupTab === 0 ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <div className="h-full overflow-hidden relative">
                            <div
                              className="absolute inset-x-0 transition-transform duration-1000 ease-in-out"
                              style={{ transform: `translateY(-${transcriptOffset}px)` }}
                            >
                              {popupTranscript.map((line, i) => {
                                const isActive = step.popupLine === i;
                                return (
                                  <div
                                    key={i}
                                    className={`flex gap-2 px-4 py-1.5 transition-all duration-500 border-l-2 ${
                                      isActive
                                        ? "bg-amber-500/10 border-amber-400"
                                        : "border-transparent"
                                    }`}
                                  >
                                    <span className={`text-[8px] font-mono shrink-0 w-[52px] ${
                                      isActive ? "text-amber-400" : "text-zinc-600"
                                    }`}>
                                      {line.tc}
                                    </span>
                                    <span className={`text-[9px] leading-relaxed transition-colors duration-500 ${
                                      isActive ? "text-zinc-200" : "text-zinc-500"
                                    }`}>
                                      {line.text}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Scene Description tab */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 ${
                            step.popupTab === 1 ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <div className="p-4 space-y-3">
                            {sceneDescription.map((item) => (
                              <div key={item.label}>
                                <div className="text-[7px] font-medium text-zinc-500 uppercase tracking-wider">{item.label}</div>
                                <div className="text-[9px] text-zinc-300 mt-0.5">{item.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Notes tab */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 ${
                            step.popupTab === 2 ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <div className="p-4 space-y-2.5">
                            <div className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider mb-3">Production Notes</div>
                            {notesContent.map((note, i) => (
                              <div key={i} className="flex gap-2 items-start">
                                <div className="w-1 h-1 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                                <span className="text-[9px] text-zinc-400 leading-relaxed">{note}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
