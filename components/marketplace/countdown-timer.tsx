"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: Date;
}

export function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
      <div className="bg-[#2b2b2b] rounded-[15px] p-4 border border-[#A259FF]/20">
        <div className="text-3xl font-bold text-[#A259FF]">
          {timeLeft.days.toString().padStart(2, '0')}
        </div>
        <div className="text-sm text-white/60">Days</div>
      </div>
      <div className="bg-[#2b2b2b] rounded-[15px] p-4 border border-[#A259FF]/20">
        <div className="text-3xl font-bold text-[#A259FF]">
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <div className="text-sm text-white/60">Hours</div>
      </div>
      <div className="bg-[#2b2b2b] rounded-[15px] p-4 border border-[#A259FF]/20">
        <div className="text-3xl font-bold text-[#A259FF]">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <div className="text-sm text-white/60">Minutes</div>
      </div>
      <div className="bg-[#2b2b2b] rounded-[15px] p-4 border border-[#A259FF]/20">
        <div className="text-3xl font-bold text-[#A259FF]">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <div className="text-sm text-white/60">Seconds</div>
      </div>
    </div>
  );
}
