"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MENU_CARD_COUNT = 8;
const CIRCLE_RADIUS = 12;

function MenuOrbitIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-full text-foreground",
        className,
      )}
      aria-hidden
    >
      <motion.span
        className="relative h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: MENU_CARD_COUNT }).map((_, i) => {
          const circleAngle = (i / MENU_CARD_COUNT) * 360;
          const circleRad = (circleAngle * Math.PI) / 180;
          const x = Math.cos(circleRad) * CIRCLE_RADIUS;
          const y = Math.sin(circleRad) * CIRCLE_RADIUS;

          return (
            <motion.span
              key={`orbit-dot-${i}`}
              className="absolute left-1/2 top-1/2 block h-[10px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-foreground shadow-sm"
              animate={{
                x,
                y,
                rotate: circleAngle + 90,
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                opacity: {
                  duration: 1.6,
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: "easeInOut",
                },
              }}
            />
          );
        })}
      </motion.span>
    </span>
  );
}

export { MenuOrbitIcon };
