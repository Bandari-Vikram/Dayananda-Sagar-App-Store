"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { PageMenuShell } from "@/components/ui/page-menu-shell";
import { AppCircleSearch, findAppIndex } from "@/components/home/app-circle-search";
import {
  APP_CARDS,
  HOME_CIRCLE_FOCUS_KEY,
  pseudoRandom,
  TOTAL_APP_COUNT,
  type AppCard,
} from "@/lib/home-images";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  app: AppCard;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
  isPopped: boolean;
  isDimmed: boolean;
}

const IMG_SIZE = 64;
const POP_SCALE = 1.55;

function FlipCard({ app, target, isPopped, isDimmed }: FlipCardProps) {
  return (
    <motion.a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: isPopped ? target.scale * POP_SCALE : target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: isPopped ? 280 : 40,
        damping: isPopped ? 18 : 15,
      }}
      style={{
        position: "absolute",
        width: IMG_SIZE,
        height: IMG_SIZE,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className={`group pointer-events-auto cursor-pointer ${isPopped ? "z-50" : "z-20"} ${isDimmed ? "pointer-events-none" : ""}`}
      aria-label={`Open ${app.name}`}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={isDimmed ? undefined : { rotateY: 180 }}
        animate={isPopped ? { rotateY: 0 } : undefined}
      >
        <div
          className={`absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full shadow-lg ${
            isPopped
              ? "ring-4 ring-indigo-400 ring-offset-2 ring-offset-transparent shadow-indigo-500/40"
              : "ring-2 ring-white/30"
          }`}
          style={{ backfaceVisibility: "hidden", backgroundColor: app.brandColor }}
        >
          <img
            src={app.icon}
            alt={app.name}
            className="size-9 object-contain sm:size-10"
            loading="lazy"
          />
        </div>

        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-2 shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-blue-400">Open</p>
            <p className="text-[10px] font-semibold leading-tight text-white">{app.name}</p>
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
}

const TOTAL_IMAGES = TOTAL_APP_COUNT;
const MAX_SCROLL = 3000;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function HomeExplorePage() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const matchedIndex = useMemo(() => findAppIndex(searchQuery), [searchQuery]);
  const matchedApp = matchedIndex !== null ? APP_CARDS[matchedIndex] : null;

  useEffect(() => {
    if (searchQuery.trim() && introPhase !== "circle") {
      setIntroPhase("circle");
    }
  }, [searchQuery, introPhase]);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  useEffect(() => {
    const fromAppsMenu = sessionStorage.getItem(HOME_CIRCLE_FOCUS_KEY) === "1";
    if (fromAppsMenu) {
      sessionStorage.removeItem(HOME_CIRCLE_FOCUS_KEY);
      scrollRef.current = 0;
      virtualScroll.set(0);
      setIntroPhase("circle");
      return;
    }

    const timer1 = setTimeout(() => setIntroPhase("line"), 500);
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const scatterPositions = useMemo(() => {
    return APP_CARDS.map((_, i) => ({
      x: (pseudoRandom(i * 3 + 1) - 0.5) * 1500,
      y: (pseudoRandom(i * 3 + 2) - 0.5) * 1000,
      rotation: (pseudoRandom(i * 3 + 3) - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, []);

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
    const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
    const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
    return () => {
      unsubscribeMorph();
      unsubscribeRotate();
      unsubscribeParallax();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  const openMatchedApp = () => {
    if (matchedApp) {
      window.open(matchedApp.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <PageMenuShell />
      <div className="pointer-events-none absolute left-1/2 top-12 z-40 w-full -translate-x-1/2 px-4 sm:top-14">
        <AppCircleSearch
          query={searchQuery}
          onQueryChange={setSearchQuery}
          matchedApp={matchedApp}
          onOpenMatched={openMatchedApp}
        />
      </div>
      <div ref={containerRef} className="relative h-full w-full overflow-hidden">
        <div className="perspective-1000 flex h-full w-full flex-col items-center justify-center">
          <div className="pointer-events-none absolute top-1/2 z-0 flex -translate-y-1/2 flex-col items-center justify-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={
                introPhase === "circle" && morphValue < 0.5
                  ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, filter: "blur(10px)" }
              }
              transition={{ duration: 1 }}
              className="max-w-[92vw] px-4 text-xl font-medium tracking-tight text-foreground sm:text-2xl md:text-4xl"
            >
              Dayananda Sagar App Store.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mt-4 text-xs font-bold tracking-[0.2em] text-foreground/70"
            >
              SCROLL TO EXPLORE
            </motion.p>
          </div>

          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="pointer-events-none absolute top-[8%] z-10 flex flex-col items-center justify-center px-4 text-center sm:top-[10%]"
          >
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-5xl">
              Dayananda Sagar App Store
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-foreground/80 md:text-base">
              Department of Artificial Intelligence and Machine Learning .{" "}
              <br className="hidden md:block" />
              Tap any card in the circle to open apps like YouTube, Instagram, LinkedIn, and more.
            </p>
          </motion.div>

          <div className="relative flex h-full w-full items-center justify-center">
            {APP_CARDS.slice(0, TOTAL_IMAGES).map((app, i) => {
              let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

              if (introPhase === "scatter") {
                target = scatterPositions[i];
              } else if (introPhase === "line") {
                const lineSpacing = 70;
                const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                const lineX = i * lineSpacing - lineTotalWidth / 2;
                target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
              } else {
                const isMobile = containerSize.width < 768;
                const minDimension = Math.min(containerSize.width, containerSize.height);
                const cardMaxSize = IMG_SIZE;
                const centerSafeRadius = isMobile ? 170 : 220;
                const maxFittingRadius = Math.max(minDimension * 0.28, minDimension / 2 - cardMaxSize / 2 - 10);
                const preferredCircleRadius = Math.min(minDimension * 0.39, 390);
                const circleRadius = Math.min(
                  Math.max(preferredCircleRadius, centerSafeRadius),
                  maxFittingRadius,
                );
                const circleAngle = (i / TOTAL_IMAGES) * 360;
                const circleRad = (circleAngle * Math.PI) / 180;
                const circlePos = {
                  x: Math.cos(circleRad) * circleRadius,
                  y: Math.sin(circleRad) * circleRadius,
                  rotation: circleAngle + 90,
                };

                const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

                const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                const arcCenterY = arcApexY + arcRadius;

                const spreadAngle = isMobile ? 100 : 130;
                const startAngle = -90 - spreadAngle / 2;
                const step = spreadAngle / (TOTAL_IMAGES - 1);

                const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                const maxRotation = spreadAngle * 0.8;
                const boundedRotation = -scrollProgress * maxRotation;

                const currentArcAngle = startAngle + i * step + boundedRotation;
                const arcRad = (currentArcAngle * Math.PI) / 180;

                const arcPos = {
                  x: Math.cos(arcRad) * arcRadius + parallaxValue,
                  y: Math.sin(arcRad) * arcRadius + arcCenterY,
                  rotation: currentArcAngle + 90,
                  scale: isMobile ? 1.05 : 1.8,
                };

                target = {
                  x: lerp(circlePos.x, arcPos.x, morphValue),
                  y: lerp(circlePos.y, arcPos.y, morphValue),
                  rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                  scale: lerp(1, arcPos.scale, morphValue),
                  opacity: 1,
                };
              }

              const isPopped = matchedIndex === i;
              const hasSearch = matchedIndex !== null;

              if (isPopped && introPhase === "circle") {
                target = {
                  x: target.x * 0.2,
                  y: target.y * 0.2,
                  rotation: target.rotation,
                  scale: target.scale,
                  opacity: 1,
                };
              } else if (hasSearch) {
                target = {
                  ...target,
                  opacity: Math.min(target.opacity, 0.22),
                  scale: target.scale * 0.88,
                };
              }

              return (
                <FlipCard
                  key={app.name}
                  app={app}
                  index={i}
                  total={TOTAL_IMAGES}
                  phase={introPhase}
                  target={target}
                  isPopped={isPopped}
                  isDimmed={hasSearch && !isPopped}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
