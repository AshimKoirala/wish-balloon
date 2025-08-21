export type Wish = {
  id: string;
  text: string;
  category: 'goal' | 'dream' | 'feeling';
  createdAt: Date;
  x?: number;
  y?: number;
};
