import TypingAnimation from "./TypingAnimation";

export default function HeroSection() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-black">
      <div className="relative">
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-80px -120px",
            background: "radial-gradient(ellipse at center, rgba(147,51,234,0.25) 0%, rgba(147,51,234,0.12) 35%, rgba(147,51,234,0.04) 60%, transparent 80%)",
            filter: "blur(30px)",
          }}
        />
        <TypingAnimation />
      </div>
    </section>
  );
}
