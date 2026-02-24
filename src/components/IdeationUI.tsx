"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { thumbImages, getHighRes } from "@/lib/images";

// Document attachment chips
const docAttachments = [
  { name: "Creative_Brief_Ep3.pdf", icon: "pdf", color: "bg-red-500/15 border-red-500/30 text-red-400" },
  { name: "Research_Notes.gdoc", icon: "doc", color: "bg-blue-500/15 border-blue-500/30 text-blue-400" },
  { name: "Storyboard_v2.png", icon: "img", color: "bg-green-500/15 border-green-500/30 text-green-400" },
];

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  clips?: { img: number; file: string; desc: string }[];
  playbackChange?: number;
  selectsGlow?: boolean;
};

const chatMessages: ChatMessage[] = [
  {
    role: "user",
    text: "I've attached the creative brief for Episode 3. Theme: 'what we leave behind.' What fits?",
  },
  {
    role: "assistant",
    text: "Based on the brief, core theme = departure, loss, landscape as memory. Strongest matches:",
    clips: [
      { img: 4, file: "ICE_0519.mov", desc: "Departure at dawn" },
      { img: 25, file: "ICE_0189.mov", desc: "Solitary figure" },
      { img: 19, file: "ICE_0753.mov", desc: "The long road out" },
    ],
  },
  {
    role: "user",
    text: "The silhouette shot is exactly right. Play it.",
    playbackChange: 25,
    selectsGlow: true,
  },
  {
    role: "assistant",
    text: "Playing ICE_0189.mov — person silhouette against mountain backdrop. Strong opening candidate.",
  },
  {
    role: "user",
    text: "Add to selects. Now what about Maria — the research notes mention her father's story",
    selectsGlow: true,
  },
  {
    role: "assistant",
    text: "Cross-referencing research notes... key passage at 01:24:18. Maria on the factory closing:",
    clips: [
      { img: 6, file: "INT_MARIA_03.mov", desc: "Maria on factory closing" },
    ],
  },
  {
    role: "user",
    text: "Play Maria's clip. What B-roll for cutaways?",
    playbackChange: 6,
  },
  {
    role: "assistant",
    text: "Playing INT_MARIA_03.mov. For cutaways matching emotional weight:",
    clips: [
      { img: 24, file: "DST_0221.mov", desc: "Vast emptiness" },
      { img: 14, file: "DST_0088.mov", desc: "What remains" },
    ],
  },
  {
    role: "user",
    text: "Snow field is perfect. Add it. What closes the episode?",
    selectsGlow: true,
  },
  {
    role: "assistant",
    text: "Brief says 'end with possibility.' Strongest candidates:",
    clips: [
      { img: 1, file: "ICE_0912.mov", desc: "Beauty in darkness" },
      { img: 17, file: "ICE_0847.mov", desc: "New beginning" },
    ],
  },
  {
    role: "user",
    text: "The aurora. Add to selects — that's our closing shot.",
    playbackChange: 1,
    selectsGlow: true,
  },
  {
    role: "assistant",
    text: "Episode 3 storyline: 1. Silhouette opening → 2. Maria's story → 3. Snow field emptiness → 4. Aurora closing. 4 selects, 6:42 total.",
    selectsGlow: true,
  },
];

// Compact media grid for the archive browser sidebar
const archiveGrid = [
  { img: 0, name: "ICE_0847.mov" },
  { img: 1, name: "ICE_0912.mov" },
  { img: 4, name: "ICE_0519.mov" },
  { img: 5, name: "ICE_0766.mov" },
  { img: 6, name: "INT_MARIA_03.mov" },
  { img: 8, name: "ICE_1087.mov" },
  { img: 14, name: "DST_0088.mov" },
  { img: 17, name: "ICE_0098.mov" },
  { img: 19, name: "ICE_0753.mov" },
  { img: 24, name: "DST_0221.mov" },
  { img: 25, name: "ICE_0189.mov" },
  { img: 12, name: "ICE_0812.mov" },
];

// Playback images used in the story
const playbackImageIndices = [0, 25, 6, 1]; // idle, silhouette, maria, aurora

export default function IdeationUI() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [playbackImageIndex, setPlaybackImageIndex] = useState(0);
  const [showSelectsGlow, setShowSelectsGlow] = useState(false);
  const [selectsCount, setSelectsCount] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typingIndex >= chatMessages.length) {
      const timeout = setTimeout(() => {
        setVisibleMessages([]);
        setTypingIndex(0);
        setPlaybackImageIndex(0);
        setShowSelectsGlow(false);
        setSelectsCount(0);
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

      if (msg.playbackChange !== undefined) {
        setPlaybackImageIndex(msg.playbackChange);
      }

      if (msg.selectsGlow) {
        setShowSelectsGlow(true);
        // Count selects additions on user "add to selects" messages
        if (msg.role === "user" && msg.text.toLowerCase().includes("add")) {
          setSelectsCount((prev) => prev + 1);
        }
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
          Ideate with your archive. Build storylines in conversation.
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
                {/* Collapsed left sidebar */}
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
                    <div className="w-8 h-8 rounded-md flex items-center justify-center text-purple-400 bg-purple-500/10 border border-purple-500/20">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
                    <div className="text-[11px] font-bold text-zinc-50">Ideation</div>
                    <div className="flex gap-1.5 text-[9px] text-zinc-500">
                      <span className="px-2 py-0.5 rounded border border-purple-500/30 text-purple-400">Creative Mode</span>
                    </div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                    {/* Archive Browser — narrow context panel */}
                    <div className="w-[180px] shrink-0 border-r border-zinc-800 flex flex-col">
                      <div className="px-2.5 py-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">Archive</span>
                        <span className="text-[7px] text-zinc-600">12 clips</span>
                      </div>
                      <div className="flex-1 overflow-hidden p-1.5 grid grid-cols-2 auto-rows-min gap-1.5 content-start">
                        {archiveGrid.map((item) => (
                          <div key={item.name} className="rounded overflow-hidden border border-zinc-800">
                            <div className="relative aspect-video">
                              <Image
                                src={thumbImages[item.img]}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                                unoptimized
                              />
                            </div>
                            <div className="px-1 py-0.5 text-[5px] font-mono text-zinc-500 truncate bg-zinc-900">
                              {item.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chat — STAR panel, widest */}
                    <div className="w-[320px] sm:w-[360px] md:w-[380px] shrink-0 border-r border-zinc-800 flex flex-col">
                      <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">Chat</span>
                        <span className="text-[7px] text-zinc-600">Ideation — Ep 3</span>
                      </div>

                      {/* Document attachment chips — pinned top */}
                      <div className="px-2.5 py-2 border-b border-zinc-800/50 flex flex-wrap gap-1.5">
                        {docAttachments.map((doc) => (
                          <div
                            key={doc.name}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[7px] font-mono border ${doc.color}`}
                          >
                            {doc.icon === "pdf" && <span className="text-[8px]">&#x1F4C4;</span>}
                            {doc.icon === "doc" && <span className="text-[8px]">&#x1F4DD;</span>}
                            {doc.icon === "img" && <span className="text-[8px]">&#x1F5BC;</span>}
                            {doc.name}
                          </div>
                        ))}
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
                                      : "bg-purple-900/10 border border-purple-800/20 text-zinc-300 rounded-bl-sm"
                                  }`}
                                >
                                  {msg.text}
                                </div>
                                {msg.clips && (
                                  <div className="space-y-1.5">
                                    {msg.clips.map((clip) => (
                                      <div
                                        key={clip.file + clip.desc}
                                        className="rounded-md border border-zinc-800 bg-zinc-900 p-2 flex gap-2.5 items-center"
                                      >
                                        <div className="w-14 h-9 rounded-sm overflow-hidden shrink-0 relative">
                                          <Image
                                            src={thumbImages[clip.img]}
                                            alt={clip.file}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                            unoptimized
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <svg className="w-2 h-2 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                                              <polygon points="6 3 20 12 6 21 6 3" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="text-[8px] font-mono text-zinc-200 truncate">{clip.file}</div>
                                          <div className="text-[7px] text-zinc-500 mt-0.5">{clip.desc}</div>
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
                                    : "bg-purple-900/10 border border-purple-800/20 rounded-bl-sm"
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
                          <span className="flex-1 text-[9px] text-zinc-500">Describe what you&apos;re looking for...</span>
                          <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Playback panel — dynamic */}
                    <div className="flex-1 border-r border-zinc-800 flex flex-col min-w-0">
                      <div className="px-3 py-2 border-b border-zinc-800 text-[8px] font-medium text-zinc-400 uppercase tracking-wider">
                        Playback
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden border border-zinc-800">
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
                            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center border border-white/20">
                              <svg className="w-5 h-5 text-white/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <polygon points="6 3 20 12 6 21 6 3" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-white/80">
                            00:00:00:00
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-white/80">
                            4K 23.98fps
                          </div>
                        </div>
                        <div className="w-full mt-3 space-y-1">
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 relative">
                            <div className="absolute left-0 top-0 h-full w-[20%] rounded-full bg-purple-500/60" />
                            <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-3 h-3 rounded-full bg-purple-400 border-2 border-purple-300" />
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
                          {selectsCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[7px]">
                              {selectsCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Selects — collapsed to vertical tab */}
                    <div className="w-[28px] shrink-0 flex flex-col items-center bg-zinc-900/30">
                      <div className="py-4 flex-1 flex items-start justify-center">
                        <div
                          className="text-[8px] font-medium text-zinc-500 uppercase tracking-widest whitespace-nowrap"
                          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                          Selects
                        </div>
                      </div>
                      <div className="pb-3">
                        <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M15 19l-7-7 7-7" />
                        </svg>
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
