"use client";

import { useState, useEffect, useCallback } from "react";

const questions = [
  "Find every moment where someone talks about leaving home",
  "Which interviews mention the factory closing?",
  "Show me all the sunset shots from the Iceland footage",
  "What did Maria say about her childhood?",
  "Pull together a paper edit for the opening of episode three",
  "Find the most emotional moments across all the interviews",
  "Which clips on this drive have people laughing?",
  "Search the B-roll for anything with rain",
  "What stories do we have about resilience?",
  "Show me every scene where the music changes mood",
  "Find all the archival footage we haven't used yet",
  "Which takes have the best audio quality?",
  "What's the strongest opening line from any interview?",
  "Pull every reference to the 1994 earthquake",
  "Show me quiet, contemplative moments from the desert shoot",
];

type Phase = "typing" | "pausing" | "erasing" | "waiting";

export default function TypingAnimation() {
  const [displayText, setDisplayText] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [charIndex, setCharIndex] = useState(0);

  const currentQuestion = questions[questionIndex];

  const getTypingDelay = useCallback(() => {
    // Variable speed: 60-140ms with occasional hesitation pauses
    if (Math.random() < 0.08) return 280 + Math.random() * 120; // hesitation
    return 60 + Math.random() * 80;
  }, []);

  const getEraseDelay = useCallback(() => {
    return 20 + Math.random() * 30;
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    switch (phase) {
      case "typing":
        if (charIndex < currentQuestion.length) {
          timeout = setTimeout(() => {
            setDisplayText(currentQuestion.slice(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          }, getTypingDelay());
        } else {
          setPhase("pausing");
        }
        break;

      case "pausing":
        timeout = setTimeout(() => {
          setPhase("erasing");
        }, 2000 + Math.random() * 500);
        break;

      case "erasing":
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1));
          }, getEraseDelay());
        } else {
          setPhase("waiting");
        }
        break;

      case "waiting":
        timeout = setTimeout(() => {
          const nextIndex = (questionIndex + 1) % questions.length;
          setQuestionIndex(nextIndex);
          setCharIndex(0);
          setPhase("typing");
        }, 500 + Math.random() * 300);
        break;
    }

    return () => clearTimeout(timeout);
  }, [phase, charIndex, displayText, questionIndex, currentQuestion, getTypingDelay, getEraseDelay]);

  return (
    <div className="font-mono text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight max-w-5xl text-center px-6">
      <span>{displayText}</span>
      <span className="cursor-blink ml-0.5 inline-block w-[0.55em] h-[1.1em] align-middle bg-white/90" />
    </div>
  );
}
