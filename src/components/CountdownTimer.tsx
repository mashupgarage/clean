import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export const CountdownTimer = ({
  duration,
  redirect,
}: {
  duration?: number;
  redirect?: string;
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration || 30);

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
    <div className="text-center text-4xl font-bold">
      {timeLeft > 0 ? (
        `${timeLeft} seconds left`
      ) : (
        <Navigate to={redirect || "/"} />
      )}
    </div>
  );
};
