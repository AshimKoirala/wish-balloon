"use client";

import { useState, useEffect, useRef } from "react";
import type { Wish } from "@/types";
import { cn } from "@/lib/utils";
import BalloonIcon from "../icons/balloon-icon";
import WishDetailsDialog from "./wish-details-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

type BalloonProps = {
  wish: Wish;
  onRelease: (id: string, fulfilled: boolean) => void;
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
};

const categoryColors: Record<Wish["category"], string> = {
  goal: "hsl(var(--primary))",
  dream: "hsl(var(--accent))",
  feeling: "#F472B6",
};

export default function Balloon({
  wish,
  onRelease,
  onPositionChange,
}: BalloonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [releaseState, setReleaseState] = useState<
    "idle" | "popping" | "flying"
  >("idle");
  const [animationClass, setAnimationClass] = useState("");
  const [animationDuration, setAnimationDuration] = useState("");
  const [wasDragged, setWasDragged] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const popSound = useRef<HTMLAudioElement | null>(null);
  const fulfilledSound = useRef<HTMLAudioElement | null>(null);
  const releaseSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popSound.current = new Audio("/ballonpop.mp3");
    fulfilledSound.current = new Audio("/fullfilled.mp3");
    releaseSound.current = new Audio("/ballonrelease.mp3");

    const animations = [
      "animate-float-1",
      "animate-float-2",
      "animate-float-3",
    ];
    setAnimationClass(
      animations[Math.floor(Math.random() * animations.length)]
    );
    setAnimationDuration(`${Math.random() * 5 + 8}s`);
  }, []);

  const handleRelease = (fulfilled: boolean) => {
    if (fulfilled) {
      popSound.current?.play();
      fulfilledSound.current?.play();
      setReleaseState("popping");
      onRelease(wish.id, true);
    } else {
      releaseSound.current?.play();
      setReleaseState("flying");
      setTimeout(() => onRelease(wish.id, false), 200);
    }
  };

  const getDynamicAnimationClass = () => {
    switch (releaseState) {
      case "popping":
        return "animate-pop";
      case "flying":
        return "animate-fly-up";
      default:
        return animationClass;
    }
  };

  const handleDragStart = () => setWasDragged(false);
  const handleDrag = () => setWasDragged(true);
  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    onPositionChange(wish.id, { x: data.x, y: data.y });
  };

  const handleBalloonTap = () => {
    if (!wasDragged && releaseState === "idle") {
      setIsDialogOpen(true);
    }
    setWasDragged(false);
  };

  if (!animationClass || !animationDuration) return null;

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        position={{ x: wish.x ?? 0, y: wish.y ?? 0 }}
        onStart={handleDragStart}
        onDrag={handleDrag}
        onStop={handleDragStop}
        bounds="parent"
      >
        <div
          ref={nodeRef}
          className={cn("absolute", {
            "cursor-grab active:cursor-grabbing": releaseState === "idle",
          })}
          onMouseUp={handleBalloonTap} // Desktop tap
          onTouchEnd={handleBalloonTap} // Mobile tap
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "transition-transform duration-300 hover:scale-110",
                  getDynamicAnimationClass()
                )}
                style={{
                  animationDuration:
                    releaseState === "idle" ? animationDuration : undefined,
                }}
                role="button"
                aria-label={`Open wish: ${wish.text}`}
              >
                <BalloonIcon
                  className="w-24 h-28 md:w-32 md:h-36"
                  color={categoryColors[wish.category]}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{wish.text}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Draggable>

      <WishDetailsDialog
        wish={wish}
        color={categoryColors[wish.category]}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onRelease={handleRelease}
      />
    </>
  );
}
