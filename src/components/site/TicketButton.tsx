import { Link } from "@tanstack/react-router";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TicketButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

export function TicketButton({
  children,
  className,
  variant = "editorial",
  size = "editorial",
}: TicketButtonProps) {
  return (
    <Link
      to="/register"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  );
}
