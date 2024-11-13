import { useState, useEffect } from "react";

export const CountdownTimer = ({
  duration,
  className,
}: {
  duration: number;
  className?: string;
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  // Note: Rewrite this so that uses keyframes and animation time in CSS instead of counting time in JS
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [timeLeft]);

  return (
    <div
      className={`text-center text-4xl font-bold text-slate-600 ${className}`}
    >
      {timeLeft} seconds left
    </div>
  );
};
