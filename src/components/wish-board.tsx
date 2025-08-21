"use client";

import { useState, useEffect } from "react";
import type { Wish } from "@/types";
import CreateWishDialog from "@/components/wish/create-wish-dialog";
import WishSky from "@/components/wish/wish-sky";
import { Button } from "./ui/button";
import { Plus, Sparkles, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BalloonIcon from "./icons/balloon-icon";
import { TooltipProvider } from "@/components/ui/tooltip";
import Confetti from "react-confetti";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const initialWishes: Wish[] = [
  {
    id: "1",
    text: "To travel the world and see the northern lights.",
    category: "dream",
    createdAt: new Date(),
    x: 200,
    y: 50,
  },
  {
    id: "2",
    text: "Finish my novel this year.",
    category: "goal",
    createdAt: new Date(),
    x: 500,
    y: 150,
  },
  {
    id: "3",
    text: "Find more joy in the little things.",
    category: "feeling",
    createdAt: new Date(),
    x: 800,
    y: 100,
  },
];

const WISH_STORAGE_KEY = "wish-balloon-wishes";

function SiteHeader({
  onWishCreate,
  onClearWishes,
  hasWishes,
}: {
  onWishCreate: (wish: Omit<Wish, "id" | "createdAt">) => void;
  onClearWishes: () => void;
  hasWishes: boolean;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-transparent">
      <div className="flex items-center gap-2">
        <BalloonIcon
          className="w-8 h-8 text-primary"
          color="hsl(var(--primary))"
        />
        <h1 className="font-headline text-2xl font-bold text-hsl(var(--primary))">
          Wish balloon
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {hasWishes && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Release All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will release all your wishes from the sky. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    new Audio("/ballonrelease.mp3").play();
                    onClearWishes();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, Release Them All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <CreateWishDialog onWishCreate={onWishCreate}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Wish
          </Button>
        </CreateWishDialog>
      </div>
    </header>
  );
}

function Scenery() {
  return (
    <>
      <div className="moon"></div>
      <div
        className="cloud"
        style={{ top: "10%", left: "15%", width: "200px", height: "60px" }}
      ></div>
      <div
        className="cloud"
        style={{ top: "25%", right: "20%", width: "250px", height: "75px" }}
      ></div>
      <div
        className="cloud"
        style={{ bottom: "20%", left: "30%", width: "180px", height: "50px" }}
      ></div>
    </>
  );
}

function Instructions() {
  return (
    <div className="fixed bottom-4 left-4 z-20 w-[calc(100%-2rem)] max-w-xs rounded-lg bg-card/50 p-4 text-card-foreground shadow-lg backdrop-blur-sm md:w-auto">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">How to Wish</h3>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
        <li>
          Click <strong>New Wish</strong> to create a balloon.
        </li>
        <li>
          <strong>Drag</strong> balloons to arrange them in the sky.
        </li>
        <li>
          <strong>Double Click</strong> a balloon to see details.
        </li>
        <li>
          <strong>Release All</strong> to clear every wish at once.
        </li>
      </ul>
    </div>
  );
}

export default function WishBoard() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const storedWishes = localStorage.getItem(WISH_STORAGE_KEY);
      if (storedWishes) {
        setWishes(
          JSON.parse(storedWishes).map((w: Wish) => ({
            ...w,
            createdAt: new Date(w.createdAt),
          }))
        );
      } else {
        setWishes(initialWishes);
      }
    } catch (error) {
      console.error("Failed to parse wishes from localStorage", error);
      setWishes(initialWishes);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(WISH_STORAGE_KEY, JSON.stringify(wishes));
    }
  }, [wishes, isClient]);

  const addWish = (wish: Omit<Wish, "id" | "createdAt" | "x" | "y">) => {
    const isMobile = window.innerWidth < 768;
    const newWish: Wish = {
      ...wish,
      id: new Date().toISOString(),
      createdAt: new Date(),
      x: isMobile ? window.innerWidth / 2 - 60 : window.innerWidth / 2 - 64,
      y: isMobile ? window.innerHeight / 3 - 70 : window.innerHeight / 3 - 72,
    };
    setWishes((prev) => [...prev, newWish]);
    toast({
      title: "Wish created!",
      description: "Your new wish is now floating in the sky.",
    });
  };

  const releaseWish = (id: string, fulfilled: boolean) => {
    if (fulfilled) {
      setShowConfetti(true);
    }

    setTimeout(
      () => {
        setWishes((prev) => prev.filter((wish) => wish.id !== id));
        toast({
          title: fulfilled ? "Wish Fulfilled!" : "Wish Released",
          description: fulfilled
            ? "Congratulations on this milestone!"
            : "Your wish has floated away.",
        });
      },
      fulfilled ? 500 : 500
    );
  };

  const clearWishes = () => {
    setWishes([]);
    toast({
      title: "All wishes released!",
      description: "The sky is clear for new dreams.",
    });
  };

  const handlePositionChange = (id: string, pos: { x: number; y: number }) => {
    setWishes(
      wishes.map((w) => (w.id === id ? { ...w, x: pos.x, y: pos.y } : w))
    );
  };

  if (!isClient) {
    return null; // Render nothing on the server to avoid hydration mismatches
  }

  return (
    <TooltipProvider>
      {showConfetti && (
        <Confetti
          recycle={false}
          onConfettiComplete={() => setShowConfetti(false)}
          numberOfPieces={200}
        />
      )}
      <div className="flex flex-col h-screen bg-transparent overflow-hidden">
        <SiteHeader
          onWishCreate={addWish}
          onClearWishes={clearWishes}
          hasWishes={wishes.length > 0}
        />
        <main className="flex-1 pt-20 relative">
          <Scenery />
          <WishSky
            wishes={wishes}
            onReleaseWish={releaseWish}
            onPositionChange={handlePositionChange}
          />
        </main>
        <Instructions />
      </div>
    </TooltipProvider>
  );
}
