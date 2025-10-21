import clsx from "clsx";
import { Loader2 } from "lucide-react";

type PropsType = {
  size?: number;
  className?: string;
};

export function Loader({ size, className }: PropsType) {
  return <Loader2 className={clsx("animate-spin", className)} size={size} />;
}
