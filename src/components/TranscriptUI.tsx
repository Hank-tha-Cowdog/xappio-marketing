"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getHighRes } from "@/lib/images";

// Scene images — fixed to match transcript content
const sceneImages = [
  getHighRes(0),  // 0: river valley — "village arrival" lines
  getHighRes(15), // 1: sun rays valley — "golden hour" lines
  getHighRes(6),  // 2: portrait woman — Maria speaking lines (was misty valley, now portrait)
  getHighRes(5),  // 3: dramatic peak — factory/emotional weight
];

const transcriptLines = [
  { tc: "01:22:30", text: "We'd been driving since midnight. Nobody was talking.", speaker: "" },
  { tc: "01:22:38", text: "The plan was to reach the village before dawn.", speaker: "" },
  { tc: "01:22:45", text: "We arrived at the village before dawn.", speaker: "" },
  { tc: "01:22:52", text: "The streets were completely empty.", speaker: "" },
  { tc: "01:23:00", text: "I remember thinking — this is what silence sounds like.", speaker: "" },
  { tc: "01:23:04", text: "And then the light just broke through —", speaker: "" },
  { tc: "01:23:10", text: "this incredible golden hour across the whole valley.", speaker: "" },
  { tc: "01:23:15", text: "We knew we had something. Everyone stopped.", speaker: "" },
  { tc: "01:23:22", text: "Nobody said a word.", speaker: "" },
  { tc: "01:23:30", text: "[ambient — wind, distant birds]", speaker: "SFX" },
  { tc: "01:23:38", text: "The Iceland interior is one of the last", speaker: "NARRATOR" },
  { tc: "01:23:44", text: "truly wild places in Europe.", speaker: "NARRATOR" },
  { tc: "01:23:50", text: "For Maria, coming back here meant confronting", speaker: "NARRATOR" },
  { tc: "01:23:58", text: "everything she had left behind.", speaker: "NARRATOR" },
  { tc: "01:24:05", text: "When I left, I was seventeen.", speaker: "MARIA" },
  { tc: "01:24:12", text: "I didn't look back. I couldn't.", speaker: "MARIA" },
  { tc: "01:24:18", text: "The factory was closing. Everyone knew.", speaker: "MARIA" },
  { tc: "01:24:25", text: "My father worked there thirty-two years.", speaker: "MARIA" },
  { tc: "01:24:33", text: "He never talked about it after. Not once.", speaker: "MARIA" },
  { tc: "01:24:40", text: "[pause — Maria looks away from camera]", speaker: "SFX" },
  { tc: "01:24:48", text: "You don't understand what it means to lose", speaker: "MARIA" },
  { tc: "01:24:55", text: "the only thing that held a community together.", speaker: "MARIA" },
  { tc: "01:25:02", text: "The Víkurfjall factory employed", speaker: "NARRATOR" },
  { tc: "01:25:08", text: "nearly 400 people in a town of 1,200.", speaker: "NARRATOR" },
  { tc: "01:25:15", text: "When it closed in 1994, the town began to empty.", speaker: "NARRATOR" },
  { tc: "01:25:22", text: "Sometimes I dream I'm still there.", speaker: "MARIA" },
  { tc: "01:25:30", text: "Standing at the gate, waiting for the shift whistle.", speaker: "MARIA" },
  { tc: "01:25:38", text: "But it never comes.", speaker: "MARIA" },
];

type AnimationStep = {
  activeLine: number;
  timelinePercent: number;
  timecodeDisplay: string;
  sceneIndex: number;
  chatAction?: "user-typing" | "user-done" | "assistant-typing" | "assistant-done" | "select";
  purpleLines?: number[];
  goldLines?: number[];
  selectsGlow?: boolean;
  duration: number;
};

const animationSteps: AnimationStep[] = [
  // Phase 1: Timeline scrubbing — user clicking through different points
  { activeLine: 2, timelinePercent: 10, timecodeDisplay: "01:22:45:00", sceneIndex: 0, duration: 3500 },
  { activeLine: 5, timelinePercent: 20, timecodeDisplay: "01:23:04:00", sceneIndex: 1, duration: 3000 },
  { activeLine: 8, timelinePercent: 28, timecodeDisplay: "01:23:22:00", sceneIndex: 1, duration: 3000 },
  { activeLine: 14, timelinePercent: 45, timecodeDisplay: "01:24:05:00", sceneIndex: 2, goldLines: [14], duration: 3500 },
  // Phase 2: User asks about the factory
  { activeLine: 14, timelinePercent: 45, timecodeDisplay: "01:24:05:00", sceneIndex: 2, goldLines: [14], chatAction: "user-typing", duration: 3000 },
  { activeLine: 14, timelinePercent: 45, timecodeDisplay: "01:24:05:00", sceneIndex: 2, goldLines: [14], chatAction: "user-done", duration: 1500 },
  // Phase 3: Archivist responds with recommendation
  { activeLine: 14, timelinePercent: 45, timecodeDisplay: "01:24:05:00", sceneIndex: 2, goldLines: [14], chatAction: "assistant-typing", duration: 4500 },
  { activeLine: 14, timelinePercent: 45, timecodeDisplay: "01:24:05:00", sceneIndex: 2, goldLines: [16, 17, 18], chatAction: "assistant-done", duration: 3500 },
  // Phase 4: User clicks the recommendation — transcript turns purple
  { activeLine: 16, timelinePercent: 55, timecodeDisplay: "01:24:18:00", sceneIndex: 3, purpleLines: [16, 17, 18], chatAction: "select", duration: 4500 },
  // Phase 5: Continue reading — purple stays, active line advances, selects glow
  { activeLine: 18, timelinePercent: 60, timecodeDisplay: "01:24:33:00", sceneIndex: 3, purpleLines: [16, 17, 18], goldLines: [18], selectsGlow: true, duration: 5000 },
];

type ChatMsg = { role: "user" | "assistant"; text: string; action?: string };

const initialChat: ChatMsg[] = [
  { role: "user", text: "Play from the village arrival" },
  { role: "assistant", text: "Jumping to 01:22:45 — village arrival scene. The narrator introduces Maria's return to Iceland." },
];

const userQuestion = "What does Maria say about the factory closing?";
const assistantAnswer: ChatMsg = {
  role: "assistant",
  text: "Maria discusses the factory at 01:24:18. She describes her father working there for 32 years and the closure's impact on the community.",
  action: "Jump to 01:24:18",
};

export default function TranscriptUI() {
  const [stepIndex, setStepIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(initialChat);
  const [isTyping, setIsTyping] = useState(false);
  const [typingRole, setTypingRole] = useState<"user" | "assistant" | null>(null);
  const [recommendationSelected, setRecommendationSelected] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const step = animationSteps[stepIndex];

  useEffect(() => {
    const current = animationSteps[stepIndex];

    // Typing indicator
    if (current.chatAction === "user-typing" || current.chatAction === "assistant-typing") {
      setIsTyping(true);
      setTypingRole(current.chatAction === "user-typing" ? "user" : "assistant");
    } else {
      setIsTyping(false);
      setTypingRole(null);
    }

    // Add chat messages (guard against duplicates)
    if (current.chatAction === "user-done") {
      setChatMessages((prev) => {
        if (prev[prev.length - 1]?.text === userQuestion) return prev;
        return [...prev, { role: "user", text: userQuestion }];
      });
    }
    if (current.chatAction === "assistant-done") {
      setChatMessages((prev) => {
        if (prev[prev.length - 1]?.text === assistantAnswer.text) return prev;
        return [...prev, assistantAnswer];
      });
    }
    if (current.chatAction === "select") {
      setRecommendationSelected(true);
    }

    // Advance to next step
    const timeout = setTimeout(() => {
      if (stepIndex >= animationSteps.length - 1) {
        // Restart loop
        setChatMessages([...initialChat]);
        setStepIndex(0);
        setIsTyping(false);
        setTypingRole(null);
        setRecommendationSelected(false);
      } else {
        setStepIndex((prev) => prev + 1);
      }
    }, current.duration);

    return () => clearTimeout(timeout);
  }, [stepIndex]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  // Transcript vertical offset to keep active line visible
  const transcriptOffset = Math.max(0, step.activeLine * 26 - 180);

  return (
    <section className="bg-black px-2 sm:px-4 py-20 sm:py-32">
      <div className="mx-auto w-full max-w-[1800px] flex flex-col items-center gap-12 sm:gap-16">
        <h2 className="text-center text-2xl sm:text-3xl font-light text-gray-400 tracking-tight">
          Live transcript. Instant navigation.
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
                {/* Collapsed sidebar — icon rail */}
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
                    {/* Media Browser — collapsed to vertical tab */}
                    <div className="w-[28px] shrink-0 border-r border-zinc-800 flex flex-col items-center bg-zinc-900/30">
                      <div className="py-4 flex-1 flex items-start justify-center">
                        <div
                          className="text-[8px] font-medium text-zinc-500 uppercase tracking-widest whitespace-nowrap"
                          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                          Media
                        </div>
                      </div>
                      <div className="pb-3">
                        <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Chat panel */}
                    <div className="w-[220px] sm:w-[260px] md:w-[280px] shrink-0 border-r border-zinc-800 flex flex-col">
                      <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">Chat</span>
                        <span className="text-[7px] text-zinc-600">Iceland Doc</span>
                      </div>
                      <div
                        ref={chatRef}
                        className="flex-1 overflow-hidden px-2.5 py-2.5 space-y-3"
                      >
                        {chatMessages.map((msg, i) => {
                          const isUser = msg.role === "user";
                          return (
                            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
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
                                {msg.action && (
                                  <div
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[8px] font-mono cursor-pointer transition-all duration-500 ${
                                      recommendationSelected
                                        ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                                        : "bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                                    }`}
                                  >
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      {recommendationSelected ? (
                                        <path d="M5 13l4 4L19 7" />
                                      ) : (
                                        <path d="M13 5l7 7-7 7M5 12h14" />
                                      )}
                                    </svg>
                                    {recommendationSelected ? "Jumped to 01:24:18" : msg.action}
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
                          <span className="flex-1 text-[9px] text-zinc-500">Ask about your footage...</span>
                          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Playback panel — animated timeline */}
                    <div className="flex-1 border-r border-zinc-800 flex flex-col min-w-0">
                      <div className="px-3 py-2 border-b border-zinc-800 text-[8px] font-medium text-zinc-400 uppercase tracking-wider">
                        Playback
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden border border-zinc-800">
                          {sceneImages.map((src, i) => (
                            <Image
                              key={i}
                              src={src}
                              alt="Playback"
                              fill
                              className={`object-cover transition-opacity duration-1000 ${
                                i === step.sceneIndex ? "opacity-100" : "opacity-0"
                              }`}
                              sizes="600px"
                              unoptimized
                            />
                          ))}
                          <div className="absolute inset-0 bg-black/15" />
                          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-white/80 transition-all duration-500">
                            {step.timecodeDisplay}
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-white/80">
                            4K 23.98fps
                          </div>
                          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-[8px] font-mono text-white/60">
                            ICE_0847.mov
                          </div>
                        </div>
                        {/* Animated timeline */}
                        <div className="w-full mt-3 space-y-1">
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 relative">
                            <div
                              className="absolute left-0 top-0 h-full rounded-full bg-amber-500/60 transition-all duration-1000 ease-in-out"
                              style={{ width: `${step.timelinePercent}%` }}
                            />
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 border-2 border-amber-300 transition-all duration-1000 ease-in-out"
                              style={{ left: `${step.timelinePercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                            <span>{step.timecodeDisplay.slice(0, 8)}</span>
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
                    </div>

                    {/* Transcript panel — fully expanded */}
                    <div className="w-[250px] sm:w-[280px] md:w-[320px] shrink-0 border-r border-zinc-800 flex flex-col">
                      <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">Transcript</span>
                        <span className="text-[7px] text-zinc-600">ICE_0847.mov</span>
                      </div>
                      <div className="flex-1 overflow-hidden relative">
                        <div
                          className="absolute inset-x-0 transition-transform duration-1000 ease-in-out"
                          style={{ transform: `translateY(-${transcriptOffset}px)` }}
                        >
                          {transcriptLines.map((line, i) => {
                            const isActive = i === step.activeLine;
                            const isPurple = step.purpleLines?.includes(i);
                            const isGold = step.goldLines?.includes(i) && !isPurple;

                            let bgClass = "";
                            let borderClass = "border-l-2 border-transparent";
                            let textClass = "text-zinc-500";

                            if (isPurple) {
                              bgClass = "bg-purple-500/10";
                              borderClass = "border-l-2 border-purple-400";
                              textClass = "text-purple-200";
                            } else if (isGold) {
                              bgClass = "bg-amber-500/10";
                              borderClass = "border-l-2 border-amber-400";
                              textClass = "text-amber-200";
                            } else if (isActive) {
                              bgClass = "bg-zinc-800/50";
                              borderClass = "border-l-2 border-zinc-400";
                              textClass = "text-zinc-200";
                            }

                            return (
                              <div
                                key={i}
                                className={`flex gap-2 px-2 py-1 transition-all duration-500 ${bgClass} ${borderClass}`}
                              >
                                <span className="text-[7px] font-mono text-zinc-600 shrink-0 w-[52px]">
                                  {line.tc}
                                </span>
                                <div className="min-w-0">
                                  {line.speaker && line.speaker !== "SFX" && (
                                    <span className="text-[7px] font-bold text-zinc-400 mr-1">{line.speaker}:</span>
                                  )}
                                  <span
                                    className={`text-[8px] leading-relaxed transition-colors duration-500 ${
                                      line.speaker === "SFX" ? "italic text-zinc-600" : textClass
                                    }`}
                                  >
                                    {line.text}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
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
