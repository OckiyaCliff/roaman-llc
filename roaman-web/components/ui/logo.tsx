import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const heights: Record<NonNullable<LogoProps["size"]>, string> = {
    sm: "h-5",
    md: "h-6",
    lg: "h-8",
  };

  const imgClass = heights[size];

  return (
    <div className={cn("inline-flex items-center", className)}>
      {/* Icon only on small screens */}
      <img
        src="/iconlogo.svg"
        alt="Roaman"
        className={cn("block md:hidden", imgClass)}
      />
      {/* Full wordmark on medium and up */}
      <img
        src="/iconlogofull.svg"
        alt="Roaman"
        className={cn("hidden md:block", imgClass)}
      />
    </div>
  );
}
