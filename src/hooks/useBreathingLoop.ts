import { useState, useEffect, useRef } from "react";
import { playClick, playCollect, playResolve } from "../systems/soundEngine";

type BreathingPhase = "inhale" | "hold" | "exhale" | "rest";

export function useBreathingLoop(activePowerUp: any, setIsHeroHealing: (v: boolean) => void) {
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>("inhale");
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState(4);
  const [breathingCircleScale, setBreathingCircleScale] = useState(1.1);
  const [completedBreaths, setCompletedBreaths] = useState(0);

  const phaseRef = useRef(breathingPhase);
  phaseRef.current = breathingPhase;
  const breathsRef = useRef(completedBreaths);
  breathsRef.current = completedBreaths;

  useEffect(() => {
    if (!activePowerUp) return;

    const interval = setInterval(() => {
      setBreathingSecondsLeft((prev) => {
        if (prev <= 1) {
          const currentPhase = phaseRef.current;
          if (currentPhase === "inhale") {
            setBreathingPhase("hold");
            setBreathingCircleScale(1.6);
            playClick();
            return 4;
          } else if (currentPhase === "hold") {
            setBreathingPhase("exhale");
            setBreathingCircleScale(1.3);
            playCollect();
            return 4;
          } else if (currentPhase === "exhale") {
            setBreathingPhase("rest");
            setBreathingCircleScale(0.8);
            const newBreaths = breathsRef.current + 1;
            setCompletedBreaths(newBreaths);
            if (newBreaths >= 3) {
              setTimeout(() => {
                clearInterval(interval);
                setIsHeroHealing(false);
                playResolve();
              }, 0);
            }
            return 2;
          } else {
            setBreathingPhase("inhale");
            setBreathingCircleScale(1.1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activePowerUp]);

  return {
    breathingPhase,
    breathingSecondsLeft,
    breathingCircleScale,
    completedBreaths,
    setBreathingPhase,
    setBreathingSecondsLeft,
    setBreathingCircleScale,
    setCompletedBreaths,
  };
}
