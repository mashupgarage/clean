import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(30);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // Insert API call to detect cup
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [timeLeft]);

  // Note: Can improve redirect to timeout page, or show timeout modal
  return (
    <div className="text-center text-4xl font-bold">
      {timeLeft > 0 ? `Time left: ${timeLeft}` : <Navigate to="/" />}
    </div>
  );
};

export default CountdownTimer;
