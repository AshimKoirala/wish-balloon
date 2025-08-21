import { cn } from "@/lib/utils";

type BalloonIconProps = {
  className?: string;
  color?: string;
};

export default function BalloonIcon({ className, color }: BalloonIconProps) {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
      >
        <path
          d="M85.4,34.3C94.2,50,91.5,69.5,78.5,82.5S50,94.2,34.3,85.4,14.8,57,21.5,40.4,40.4,8.5,56.1,14.8,76.5,18.7,85.4,34.3Z"
          fill={color || "currentColor"}
        />
        <path
          d="M50.4,89.5c-6.8,0-6.8,5.8,0,5.8,6.1,0.5,6.1-5.8,0-5.8Z"
          fill={color || "currentColor"}
          transform="translate(0, 10)"
        />
      </svg>
      <div
        className="absolute bottom-0 left-1/2 h-16 w-px -translate-x-1/2"
        style={{ background: `linear-gradient(to top, ${color || 'currentColor'}00, ${color || 'currentColor'}FF)` }}
      />
    </div>
  );
}
