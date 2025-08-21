'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Wish } from '@/types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Target, Cloud, Heart, WandSparkles } from 'lucide-react';

const wishSchema = z.object({
  text: z.string().min(3, 'Your wish must be at least 3 characters long.').max(280, 'Your wish is too long!'),
  category: z.enum(['goal', 'dream', 'feeling'], {
    required_error: 'Please select a category for your wish.',
  }),
});

type WishFormValues = z.infer<typeof wishSchema>;

type CreateWishDialogProps = {
  children: React.ReactNode;
  onWishCreate: (wish: Omit<Wish, 'id' | 'createdAt'>) => void;
};

const categoryInfo = {
    goal: { icon: Target, color: "hsl(var(--primary))", label: "A Goal" },
    dream: { icon: Cloud, color: "hsl(var(--accent))", label: "A Dream" },
    feeling: { icon: Heart, color: "#F472B6", label: "A Feeling" },
}

export default function CreateWishDialog({ children, onWishCreate }: CreateWishDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<WishFormValues>({
    resolver: zodResolver(wishSchema),
    defaultValues: {
        text: "",
    },
  });

  const onSubmit = (data: WishFormValues) => {
    onWishCreate(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WandSparkles className="text-primary"/>
            Make a New Wish
          </DialogTitle>
          <DialogDescription>
            What is your heart's desire? Write it down, choose its color, and send it to the sky.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Wish</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="I wish to..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Choose a color for your wish</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                            >
                                {Object.entries(categoryInfo).map(([key, {icon: Icon, color, label}]) => (
                                    <FormItem key={key} className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={key} style={{ color }} id={key}/>
                                        </FormControl>
                                        <FormLabel htmlFor={key} className="flex items-center gap-2 font-normal cursor-pointer">
                                            <Icon className="h-4 w-4" style={{ color }}/>
                                            {label}
                                        </FormLabel>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="submit">Send to Sky</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
