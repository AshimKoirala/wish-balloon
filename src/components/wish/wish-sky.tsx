'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Wish } from '@/types';
import Balloon from './balloon';

type WishSkyProps = {
  wishes: Wish[];
  onReleaseWish: (id: string, fulfilled: boolean) => void;
  onPositionChange: (id: string, pos: { x: number, y: number }) => void;
};

export default function WishSky({ wishes, onReleaseWish, onPositionChange }: WishSkyProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  return (
    <div className="relative w-full h-full">
      {isClient && wishes.length > 0 ? (
        wishes.map((wish) => (
          <Balloon
            key={wish.id}
            wish={wish}
            onRelease={onReleaseWish}
            onPositionChange={onPositionChange}
          />
        ))
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 pointer-events-none">
            <p className="text-xl text-muted-foreground">The sky is clear.</p>
            <p className="text-muted-foreground">Why not make a new wish?</p>
        </div>
      )}
    </div>
  );
}
