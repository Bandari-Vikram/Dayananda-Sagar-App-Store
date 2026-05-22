"use client";

import { CircleMenu } from "@/components/ui/circle-menu";
import { cn } from "@/lib/utils";

function PageMenuShell({
  center = false,
  onOpenChange,
}: {
  center?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "fixed z-50 scale-75 sm:scale-90 md:scale-100",
        center
          ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          : "right-4 top-4 sm:right-6 sm:top-6",
      )}
    >
      <CircleMenu onOpenChange={onOpenChange} />
    </div>
  );
}

export { PageMenuShell };
