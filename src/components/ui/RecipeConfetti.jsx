import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export default function RecipeConfetti() {
  const canvasRef = useRef(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!confettiRef.current) {
      confettiRef.current = confetti.create(canvasRef.current, {
        resize: true,
        disableForReducedMotion: true,
      });
    }

    const celebrate = confettiRef.current;

    // Let the completion screen appear before the burst.
    const timer = window.setTimeout(() => {
      const options = {
        particleCount: 70,
        spread: 65,
        startVelocity: 40,
        gravity: 0.9,
        ticks: 180,
        scalar: 0.9,
        colors: [
          "#CC2E5F",
          "#FFD5E2",
          "#620E28",
          "#EDC76B",
        ],
      };

      celebrate({
        ...options,
        angle: 60,
        origin: { x: 0.05, y: 0.75 },
      });

      celebrate({
        ...options,
        angle: 120,
        origin: { x: 0.95, y: 0.75 },
      });
    }, 150);

    return () => {
      window.clearTimeout(timer);
      celebrate.reset();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="
        pointer-events-none fixed inset-0
        z-[9999] h-full w-full
      "
    />
  );
}