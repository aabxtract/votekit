'use client';

import { useEffect, useState } from 'react';

type CountdownProps = {
  endTime: bigint;
};

export function Countdown({ endTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Number(endTime) - now;

      if (remaining <= 0) {
        setTimeLeft('Voting has ended.');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(remaining / (24 * 60 * 60));
      const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((remaining % (60 * 60)) / 60);
      const seconds = Math.floor(remaining % 60);
      
      let timeLeftString = '';
      if(days > 0) timeLeftString += `${days}d `;
      if(hours > 0 || days > 0) timeLeftString += `${hours}h `;
      if(minutes > 0 || hours > 0 || days > 0) timeLeftString += `${minutes}m `;
      timeLeftString += `${seconds}s left`;

      setTimeLeft(timeLeftString);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return <span className="block text-sm font-medium text-muted-foreground mt-1">{timeLeft}</span>;
}
