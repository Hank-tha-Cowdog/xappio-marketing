"use client";

import { useState } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    label: "Post-Production",
    name: "Sarah Chen, Senior Editor",
    img: "https://images.unsplash.com/photo-1598520106830-a159f55d0643?w=800&h=450&fit=crop",
  },
  {
    id: 2,
    label: "Film Production",
    name: "James Porter, Director",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop",
  },
  {
    id: 3,
    label: "Documentary",
    name: "Maria Vasquez, Documentary Filmmaker",
    img: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&h=450&fit=crop",
  },
  {
    id: 4,
    label: "Film Archive",
    name: "Dr. Thomas Okafor, Head Archivist",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop",
  },
  {
    id: 5,
    label: "Academic Research",
    name: "Prof. Elena Kozlov, Film Studies",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop",
  },
];

export default function VideoPlaceholder() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setActive((i) => (i + 1) % slides.length);

  return (
    <section className="bg-black px-6 py-24">
      <div className="mx-auto max-w-5xl space-y-6">
        <h2 className="text-center text-2xl sm:text-3xl font-light text-gray-400 tracking-tight">
          Testimonials
        </h2>

        {/* Main player with arrows */}
        <div className="relative flex items-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous video"
            className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:border-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative flex-1 aspect-video rounded-lg border border-white/10 overflow-hidden">
            <Image
              src={slides[active].img}
              alt={slides[active].label}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 960px"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-16 w-16 text-white/70"
              >
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
              <div className="text-center space-y-1">
                <span className="block text-sm tracking-wide uppercase text-white/70">
                  {slides[active].label}
                </span>
                <span className="block text-xs text-white/50">
                  {slides[active].name}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={next}
            aria-label="Next video"
            className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:border-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="flex justify-center gap-3">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setActive(i)}
              aria-label={`Select ${slide.label}`}
              className={`group relative rounded-md border overflow-hidden transition-all ${
                i === active
                  ? "border-white/40 ring-1 ring-white/20"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="w-28 sm:w-32 aspect-video relative">
                <Image
                  src={slide.img}
                  alt={slide.label}
                  fill
                  className="object-cover"
                  sizes="128px"
                  unoptimized
                />
                <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                  i === active ? "bg-black/30" : "bg-black/50 group-hover:bg-black/40"
                }`}>
                  <svg
                    className={`w-4 h-4 transition-colors ${
                      i === active ? "text-white/60" : "text-white/30 group-hover:text-white/45"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </div>
              </div>
              <div
                className={`px-2 py-1.5 text-[10px] font-mono truncate transition-colors ${
                  i === active ? "text-white/70" : "text-white/30 group-hover:text-white/50"
                }`}
              >
                {slide.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
