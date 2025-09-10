'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export default function ConversationTimer({ updatedAt }: { updatedAt: Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expirationTime = new Date(updatedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const difference = expirationTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('This conversation has expired and will be deleted soon.');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      setTimeLeft(
        `This conversation will be deleted in ${days}d ${hours}h ${minutes}m.`
      );
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [updatedAt]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-100 p-2 rounded-md">
      <Timer className="h-4 w-4" />
      <span>{timeLeft}</span>
    </div>
  );
}
