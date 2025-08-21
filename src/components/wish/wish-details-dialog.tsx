'use client';

import type { Wish } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Sparkles, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type WishDetailsDialogProps = {
  wish: Wish;
  color: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRelease: (fulfilled: boolean) => void;
};

const categoryLabels: Record<Wish['category'], string> = {
  goal: 'Goal',
  dream: 'Dream',
  feeling: 'Feeling',
};

export default function WishDetailsDialog({
  wish,
  color,
  open,
  onOpenChange,
  onRelease,
}: WishDetailsDialogProps) {
  const handleRelease = (fulfilled: boolean) => {
    onRelease(fulfilled);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            Your Wish
          </DialogTitle>
          <DialogDescription>
            A {categoryLabels[wish.category].toLowerCase()} wished for{' '}
            {formatDistanceToNow(wish.createdAt, { addSuffix: true })}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-lg font-body leading-relaxed text-foreground">
          {wish.text}
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => handleRelease(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Fulfilled
          </Button>
          <Button variant="destructive" onClick={() => handleRelease(false)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Release
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
