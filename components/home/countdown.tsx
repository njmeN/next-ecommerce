'use client';

import { useState, useEffect } from 'react';

export default function Countdown({ targetDate }: { targetDate: string }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [mounted, setMounted] = useState(false); // برای جلوگیری از hydration error

  useEffect(() => {
    setMounted(true); // فقط بعد از mount شدن کلاینت
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <div className="countdown">
      {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit) => (
        <div className="countdown__amount" key={unit}>
          <p className="countdown__period">{String(timeLeft[unit]).padStart(2, '0')}</p>
          <span className="unit">{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
        </div>
      ))}
    </div>
  );
}
