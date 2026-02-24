"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { thumbImages, getHighRes } from "@/lib/images";

// "Golden Hour Discovery" story — coherent arc
// Editor building Episode 3 paper edit. Searches golden hour → gets clips → plays one → finds cutaways → adds to selects → finds dramatic closing → adds to selects.

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  clips?: { img: number; file: string; tc: string; res: string }[];
  playbackChange?: number; // changes playback to this image index
  selectsGlow?: boolean;
};

const chatMessages: ChatMessage[] = [
  {
    role: "user",
    text: "Show me the golden hour shots from the Iceland footage",
  },
  {
    role: "assistant",
    text: "Found 3 golden hour clips across the Iceland Doc project:",
    clips: [
      { img: 17, file: "ICE_0847.mov", tc: "01:23:04 - 01:23:46", res: "4K" },
      { img: 8, file: "ICE_0912.mov", tc: "02:11:37 - 02:12:50", res: "4K" },
      { img: 15, file: "ICE_1087.mov", tc: "00:45:19 - 00:45:57", res: "4K" },
    ],
  },
  {
    role: "user",
    text: "Play the ridge shot",
    playbackChange: 17,
  },
  {
    role: "assistant",
    text: "Playing ICE_0847.mov — at 01:23:04, the narrator says: \"...and then the light just broke through, this incredible golden hour across the whole valley — we knew we had something.\"",
  },
  {
    role: "user",
    text: "Find cutaways for Maria talking about leaving",
  },
  {
    role: "assistant",
    text: "Maria mentions leaving the village at dawn. Found 2 B-roll clips that could work as cutaways:",
    clips: [
      { img: 4, file: "ICE_0519.mov", tc: "00:12:44 - 00:13:18", res: "4K" },
      { img: 11, file: "ICE_0331.mov", tc: "00:08:02 - 00:08:55", res: "4K" },
    ],
  },
  {
    role: "user",
    text: "Play the misty valley",
    playbackChange: 4,
  },
  {
    role: "assistant",
    text: "Playing ICE_0519.mov — misty valley at dawn. Strong visual match for Maria's departure scene.",
    selectsGlow: true,
  },
  {
    role: "user",
    text: "Add to selects",
    selectsGlow: true,
  },
  {
    role: "assistant",
    text: "Added ICE_0519.mov to Selects. Paper edit now runs 23:47 total.",
  },
  {
    role: "user",
    text: "Find something dramatic for the closing — the ridge above Víkurfjall",
  },
  {
    role: "assistant",
    text: "For the Víkurfjall ridge, here are the strongest dramatic moments:",
    clips: [
      { img: 5, file: "ICE_0766.mov", tc: "01:32:08 - 01:33:42", res: "4K" },
      { img: 12, file: "ICE_1340.mov", tc: "02:01:15 - 02:02:30", res: "4K" },
    ],
  },
  {
    role: "user",
    text: "Play the dramatic peak",
    playbackChange: 5,
  },
  {
    role: "assistant",
    text: "Playing ICE_0766.mov — dramatic ridge above Víkurfjall. Strong closing candidate.",
    selectsGlow: true,
  },
  {
    role: "user",
    text: "Add to selects — that's our closing shot",
    selectsGlow: true,
  },
  {
    role: "assistant",
    text: "Added ICE_0766.mov to Selects. 4 selects total for Episode 3.",
  },
];

const mediaGrid = [
  { img: 0, name: "ICE_0847.mov", dur: "00:42" },
  { img: 1, name: "ICE_0912.mov", dur: "01:13" },
  { img: 2, name: "ICE_1204.mov", dur: "00:38" },
  { img: 3, name: "ICE_0331.mov", dur: "02:05" },
  { img: 4, name: "ICE_0519.mov", dur: "01:28" },
  { img: 5, name: "ICE_0766.mov", dur: "00:55" },
  { img: 8, name: "ICE_1087.mov", dur: "01:42" },
  { img: 9, name: "ICE_0290.mov", dur: "00:33" },
  { img: 10, name: "ICE_0614.mov", dur: "01:09" },
  { img: 11, name: "ICE_0402.mov", dur: "01:55" },
  { img: 12, name: "ICE_0812.mov", dur: "01:34" },
  { img: 13, name: "ICE_0913.mov", dur: "01:15" },
  { img: 14, name: "DST_0088.mov", dur: "02:18" },
  { img: 15, name: "DST_0155.mov", dur: "01:14" },
  { img: 16, name: "BROLL_0441.mov", dur: "01:35" },
  { img: 17, name: "ICE_0098.mov", dur: "00:48" },
  { img: 18, name: "BROLL_0298.mov", dur: "00:35" },
  { img: 19, name: "ICE_0753.mov", dur: "01:22" },
  { img: 20, name: "ICE_1340.mov", dur: "00:58" },
  { img: 21, name: "ICE_0445.mov", dur: "02:30" },
  { img: 22, name: "ICE_0667.mov", dur: "01:05" },
  { img: 23, name: "BROLL_0512.mov", dur: "00:42" },
  { img: 24, name: "DST_0221.mov", dur: "01:48" },
  { img: 25, name: "ICE_0189.mov", dur: "01:10" },
  { img: 6, name: "INT_MARIA_03.mov", dur: "02:18" },
  { img: 7, name: "INT_DAVID_12.mov", dur: "01:44" },
];

const selectsSources: { file: string; regions: { in: string; out: string; selected?: boolean }[] }[] = [
  {
    file: "ICE_0847.mov",
    regions: [
      { in: "01:23:04:00", out: "01:23:46:12" },
      { in: "01:24:02:08", out: "01:24:18:00" },
    ],
  },
  {
    file: "INT_MARIA_03.mov",
    regions: [{ in: "02:14:33:00", out: "02:16:51:16", selected: true }],
  },
  {
    file: "INT_DAVID_12.mov",
    regions: [
      { in: "01:08:22:00", out: "01:10:06:04" },
      { in: "01:12:44:12", out: "01:13:22:00" },
    ],
  },
  {
    file: "ICE_0519.mov",
    regions: [{ in: "00:12:44:00", out: "00:13:18:08" }],
  },
  {
    file: "ICE_0766.mov",
    regions: [
      { in: "01:32:08:00", out: "01:33:42:04" },
      { in: "01:15:01:08", out: "01:15:38:20" },
    ],
  },
];

// Track which images are used as playback targets for preloading
const playbackImageIndices = [17, 4, 5]; // ridge sunrise, misty valley, dramatic peak

export default function IsometricUI() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [playbackImageIndex, setPlaybackImageIndex] = useState(17); // start with ridge sunrise
  const [showSelectsGlow, setShowSelectsGlow] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typingIndex >= chatMessages.length) {
      const timeout = setTimeout(() => {
        setVisibleMessages([]);
        setTypingIndex(0);
        setPlaybackImageIndex(17);
        setShowSelectsGlow(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }

    setIsTyping(true);
    const msg = chatMessages[typingIndex];
    const hasClips = msg.clips && msg.clips.length > 0;
    const typingDuration = msg.role === "user" ? 3000 : hasClips ? 6000 : 4500;

    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
      setVisibleMessages((prev) => [...prev, typingIndex]);

      // Update playback image if this message triggers a change
      if (msg.playbackChange !== undefined) {
        setPlaybackImageIndex(msg.playbackChange);
      }

      // Show/hide selects glow
      if (msg.selectsGlow) {
        setShowSelectsGlow(true);
        setTimeout(() => setShowSelectsGlow(false), 4000);
      }

      setTypingIndex((prev) => prev + 1);
    }, typingDuration);

    return () => clearTimeout(typingTimeout);
  }, [typingIndex]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [visibleMessages, isTyping]);

  const typingRole = typingIndex < chatMessages.length ? chatMessages[typingIndex].role : null;

  return (
    <section className="bg-black px-2 sm:px-4 py-20 sm:py-32">
      <div className="mx-auto w-full max-w-[1800px] flex flex-col items-center gap-12 sm:gap-16">
        <h2 className="text-center text-2xl sm:text-3xl font-light text-gray-400 tracking-tight">
          One interface. Your entire library.
        </h2>

        <div className="relative w-full flex justify-center" style={{ perspective: "3200px" }}>
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
                {/* Collapsed left sidebar — icons only */}
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

                {/* Main content area */}
                <div className="flex-1 flex flex-col">
                  <div className="shrink-0 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                    <div className="text-[11px] font-bold text-zinc-50">Archive Browser</div>
                    <div className="flex gap-1.5 text-[9px] text-zinc-500">
                      <span className="px-2 py-0.5 rounded border border-zinc-800">Search</span>
                      <span className="px-2 py-0.5 rounded border border-zinc-800">Filter</span>
                    </div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                    {/* Panel A: Media Browser */}
                    <div className="w-[160px] sm:w-[190px] shrink-0 border-r border-zinc-800 flex flex-col">
                      <div className="px-2.5 py-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">Media</span>
                        <span className="text-[7px] text-zinc-600">26 clips</span>
                      </div>
                      <div className="flex-1 overflow-hidden p-1.5 grid grid-cols-2 auto-rows-min gap-1.5 content-start">
                        {mediaGrid.map((item, i) => (
                          <div
                            key={item.name}
                            className={`rounded overflow-hidden border ${
                              i === 0 ? "border-amber-500/40" : "border-zinc-800"
                            }`}
                          >
                            <div className="relative aspect-video">
                              <Image
                                src={thumbImages[item.img]}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="96px"
                                unoptimized
                              />
                              <div className="absolute bottom-0 right-0 px-0.5 text-[6px] font-mono bg-black/70 text-white/70">
                                {item.dur}
                              </div>
                            </div>
                            <div className="px-1 py-0.5 text-[6px] font-mono text-zinc-400 truncate bg-zinc-900">
                              {item.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Panel B: Chat — wider */}
                    <div className="w-[260px] sm:w-[300px] md:w-[340px] shrink-0 border-r border-zinc-800 flex flex-col">
                      <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">Chat</span>
                        <span className="text-[7px] text-zinc-600">Iceland Doc</span>
                      </div>
                      <div
                        ref={chatRef}
                        className="flex-1 overflow-hidden px-2.5 py-2.5 space-y-3"
                      >
                        {visibleMessages.map((msgIndex) => {
                          const msg = chatMessages[msgIndex];
                          const isUser = msg.role === "user";
                          return (
                            <div key={msgIndex} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                              <div className="max-w-[92%] space-y-1.5">
                                <div className={`text-[7px] font-medium uppercase tracking-wider ${isUser ? "text-right text-zinc-500" : "text-zinc-500"}`}>
                                  {isUser ? "You" : "Archivist"}
                                </div>
                                <div
                                  className={`rounded-lg px-3 py-2 text-[9px] leading-relaxed ${
                                    isUser
                                      ? "bg-zinc-800 text-zinc-200 rounded-br-sm"
                                      : "bg-blue-900/10 border border-blue-800/20 text-zinc-300 rounded-bl-sm"
                                  }`}
                                >
                                  {msg.text}
                                </div>
                                {msg.clips && (
                                  <div className="space-y-1.5">
                                    {msg.clips.map((clip) => (
                                      <div
                                        key={clip.file + clip.tc}
                                        className="rounded-md border border-zinc-800 bg-zinc-900 p-2 flex gap-2.5 items-center"
                                      >
                                        <div className="w-16 h-10 rounded-sm overflow-hidden shrink-0 relative">
                                          <Image
                                            src={thumbImages[clip.img]}
                                            alt={clip.file}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                            unoptimized
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <svg className="w-2.5 h-2.5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                                              <polygon points="6 3 20 12 6 21 6 3" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="text-[8px] font-mono text-zinc-200 truncate">{clip.file}</div>
                                          <div className="text-[7px] font-mono text-zinc-500 mt-0.5">{clip.tc}</div>
                                          <div className="flex gap-1 mt-1">
                                            <span className="text-[7px] px-1 rounded bg-zinc-800 text-zinc-400">{clip.res}</span>
                                            <span className="text-[7px] px-1 rounded bg-amber-500/10 text-amber-400/70 border border-amber-500/20">+ Selects</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {isTyping && (
                          <div className={`flex ${typingRole === "user" ? "justify-end" : "justify-start"}`}>
                            <div className="space-y-1.5">
                              <div className={`text-[7px] font-medium uppercase tracking-wider ${typingRole === "user" ? "text-right" : ""} text-zinc-500`}>
                                {typingRole === "user" ? "You" : "Archivist"}
                              </div>
                              <div
                                className={`rounded-lg px-3 py-2 ${
                                  typingRole === "user"
                                    ? "bg-zinc-800 rounded-br-sm"
                                    : "bg-blue-900/10 border border-blue-800/20 rounded-bl-sm"
                                }`}
                              >
                                <div className="flex gap-1 items-center h-3">
                                  <div className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                  <div className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                  <div className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="px-2.5 py-2 border-t border-zinc-800">
                        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                          <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="flex-1 text-[9px] text-zinc-500">Ask about your footage...</span>
                          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-center mt-1 text-[8px] text-zinc-600">
                          Powered by Gemini &bull; Local DB
                        </div>
                      </div>
                    </div>

                    {/* Panel C: Video Playback — dynamic image */}
                    <div className="flex-1 border-r border-zinc-800 flex flex-col min-w-0">
                      <div className="px-3 py-2 border-b border-zinc-800 text-[8px] font-medium text-zinc-400 uppercase tracking-wider">
                        Playback
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden border border-zinc-800">
                          {/* Preload all playback images, show current */}
                          {playbackImageIndices.map((imgIdx) => (
                            <Image
                              key={imgIdx}
                              src={getHighRes(imgIdx)}
                              alt="Playback"
                              fill
                              className={`object-cover transition-opacity duration-700 ${
                                imgIdx === playbackImageIndex ? "opacity-100" : "opacity-0"
                              }`}
                              sizes="600px"
                              unoptimized
                            />
                          ))}
                          <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center border border-white/20">
                              <svg className="w-6 h-6 text-white/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <polygon points="6 3 20 12 6 21 6 3" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-white/80">
                            01:23:04:12
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-white/80">
                            4K 23.98fps
                          </div>
                          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-[8px] font-mono text-white/60">
                            ICE_0847.mov
                          </div>
                        </div>
                        <div className="w-full mt-3 space-y-1">
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 relative">
                            <div className="absolute left-0 top-0 h-full w-[35%] rounded-full bg-amber-500/60" />
                            <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-3 h-3 rounded-full bg-amber-400 border-2 border-amber-300" />
                          </div>
                          <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                            <span>01:23:04</span>
                            <span>03:32:18</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 mt-3">
                          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M19 20L9 12l10-8v16z" /><path d="M5 19V5" />
                          </svg>
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </div>
                          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M5 4l10 8-10 8V4z" /><path d="M19 5v14" />
                          </svg>
                        </div>
                        {/* Add to Selects button */}
                        <button
                          className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-medium transition-all duration-500 ${
                            showSelectsGlow
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
                    </div>

                    {/* Panel D: Transcript — collapsed to tab */}
                    <div className="w-[28px] shrink-0 border-r border-zinc-800 flex flex-col items-center bg-zinc-900/30">
                      <div className="py-4 flex-1 flex items-start justify-center">
                        <div
                          className="text-[8px] font-medium text-zinc-500 uppercase tracking-widest whitespace-nowrap"
                          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                          Transcript
                        </div>
                      </div>
                      <div className="pb-3">
                        <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Panel E: Selects */}
                    <div className="w-[150px] sm:w-[170px] shrink-0 flex flex-col">
                      <div className="px-2.5 py-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">Selects</span>
                        <span className="text-[7px] text-zinc-600">8 regions</span>
                      </div>
                      <div className="flex-1 overflow-hidden px-2 py-2 space-y-2.5">
                        {selectsSources.map((src, i) => (
                          <div key={src.file} className="space-y-1">
                            <div className={`text-[8px] font-mono truncate ${i === 0 ? "text-amber-400" : "text-zinc-300"}`}>
                              {src.file}
                            </div>
                            {src.regions.map((r, ri) => {
                              const isSelected = "selected" in r && r.selected;
                              return (
                                <div
                                  key={ri}
                                  className={`flex items-center gap-1.5 rounded px-2 py-1.5 ${
                                    isSelected
                                      ? "bg-amber-500/15 border border-amber-500/50"
                                      : "bg-zinc-900 border border-zinc-800"
                                  }`}
                                  style={isSelected ? { boxShadow: "0 0 12px rgba(245, 158, 11, 0.25), 0 0 4px rgba(245, 158, 11, 0.15)" } : undefined}
                                >
                                  <div className={`w-1 h-5 rounded-sm ${isSelected ? "bg-amber-400" : "bg-amber-500/40"}`} />
                                  <div className="min-w-0">
                                    <div className={`text-[7px] font-mono ${isSelected ? "text-amber-300" : "text-zinc-400"}`}>IN  {r.in}</div>
                                    <div className={`text-[7px] font-mono ${isSelected ? "text-amber-300" : "text-zinc-400"}`}>OUT {r.out}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-zinc-800 px-2 py-2 flex gap-1">
                        <div className="flex-1 text-center px-1 py-1 rounded text-[7px] border border-zinc-700 text-zinc-400">FCPXML</div>
                        <div className="flex-1 text-center px-1 py-1 rounded text-[7px] border border-zinc-700 text-zinc-400">EDL</div>
                        <div className="flex-1 text-center px-1 py-1 rounded text-[7px] border border-zinc-700 text-zinc-400">SRT</div>
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
