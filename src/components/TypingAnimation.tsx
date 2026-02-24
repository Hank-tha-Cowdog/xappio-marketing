"use client";

import { useState, useEffect, useCallback } from "react";

const questions = [
  "You've got 14 hours of Iceland footage across three drives — show me the highlights",
  "Which interviews haven't been used in any paper edit yet?",
  "What stories do we have about resilience?",
  "I've attached the creative brief — find clips that match the opening sequence",
  "Cross-reference this research PDF with anything in the highland footage",
  "Pull clips that match the shot list from the Google Drive doc",
  "When does Maria first mention leaving home?",
  "Find every moment someone talks about the factory closing",
  "What's the strongest opening line from any interview?",
  "Pull together a paper edit for the opening of episode three",
  "Search for B-roll that could work as cutaways for the Maria segment",
  "Add the Víkurfjall ridge sunset to selects and flag it for color review",
  "Show me all the golden hour shots from the Iceland footage",
  "Find quiet, contemplative moments from the highland plateau",
  "Which clips on this drive have people in silhouette against the sky?",
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
