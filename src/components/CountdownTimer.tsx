import { useState, useEffect } from "react";

export const CountdownTimer = ({
  duration,
  className,
  isDispensingPage,
}: {
  duration: number;
  className?: string;
  isDispensingPage?: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);

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
      {timeLeft <= 1 && isDispensingPage ? (
        "Almost there!"
      ) : (
        <>{timeLeft} seconds left</>
      )}
    </div>
  );
};
