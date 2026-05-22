"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Menu, X, Home, Info, Sun, Moon, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { AppsGridIcon } from "@/components/apps/apps-grid-icon";
import { HOME_CIRCLE_FOCUS_KEY } from "@/lib/home-images";
import { cn } from "@/lib/utils";

const CONSTANTS = {
  itemSize: 48,
  containerSize: 230,
  openStagger: 0.03,
  closeStagger: 0.05,
};

const STYLES: Record<string, Record<string, string>> = {
  trigger: {
    container:
      "z-50 flex cursor-pointer items-center justify-center rounded-full bg-foreground text-background outline-none ring-0 transition-all duration-200 ease-out hover:brightness-110",
    active: "bg-foreground",
  },
  item: {
    wrapper: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    container:
      "flex items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--foreground)_8%,var(--background))] text-foreground hover:bg-[color-mix(in_srgb,var(--foreground)_14%,var(--background))] cursor-pointer",
    label:
      "absolute left-1/2 top-full mt-1 -translate-x-1/2 text-xs text-foreground/80",
  },
};

const pointOnCircle = (i: number, n: number, r: number, cx = 0, cy = 0) => {
  const theta = (2 * Math.PI * i) / n - Math.PI / 2;
  const x = cx + r * Math.cos(theta);
  const y = cy + r * Math.sin(theta);
  return { x, y };
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  index: number;
  totalItems: number;
  isOpen: boolean;
  spinOnClick?: boolean;
}

const MenuItem = ({
  icon,
  label,
  href,
  onClick,
  index,
  totalItems,
  isOpen,
  spinOnClick,
}: MenuItemProps) => {
  const { x, y } = pointOnCircle(index, totalItems, CONSTANTS.containerSize / 2);
  const [hovering, setHovering] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const runSpin = async (action: () => void) => {
    if (spinOnClick) {
      setSpinning(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSpinning(false);
    }
    action();
  };

  const iconContent = (
    <motion.span
      animate={{ rotate: spinning ? 360 : 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="inline-flex items-center justify-center"
    >
      {icon}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className={STYLES.item.wrapper}>
        <motion.div
          animate={{ x: isOpen ? x : 0, y: isOpen ? y : 0 }}
          whileHover={{ scale: 1.1, transition: { duration: 0.1, delay: 0 } }}
          transition={{
            delay: isOpen ? index * CONSTANTS.openStagger : index * CONSTANTS.closeStagger,
            type: "spring",
            stiffness: 260,
            damping: 28,
          }}
          style={{ height: CONSTANTS.itemSize - 2, width: CONSTANTS.itemSize - 2 }}
          className={STYLES.item.container}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {iconContent}
          {hovering && <p className={STYLES.item.label}>{label}</p>}
        </motion.div>
      </Link>
    );
  }

  return (
    <div className={STYLES.item.wrapper}>
      <motion.button
        animate={{ x: isOpen ? x : 0, y: isOpen ? y : 0 }}
        whileHover={{ scale: 1.1, transition: { duration: 0.1, delay: 0 } }}
        transition={{
          delay: isOpen ? index * CONSTANTS.openStagger : index * CONSTANTS.closeStagger,
          type: "spring",
          stiffness: 260,
          damping: 28,
        }}
        style={{ height: CONSTANTS.itemSize - 2, width: CONSTANTS.itemSize - 2 }}
        className={STYLES.item.container}
        onClick={() => {
          if (!onClick) return;
          void runSpin(onClick);
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        type="button"
      >
        {iconContent}
        {hovering && <p className={STYLES.item.label}>{label}</p>}
      </motion.button>
    </div>
  );
};

interface MenuTriggerProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  itemsLength: number;
  closeAnimationCallback: () => void;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
}

const MenuTrigger = ({
  setIsOpen,
  isOpen,
  itemsLength,
  closeAnimationCallback,
  openIcon,
  closeIcon,
}: MenuTriggerProps) => {
  const animate = useAnimationControls();
  const shakeAnimation = useAnimationControls();

  const scaleTransition = Array.from({ length: itemsLength - 1 })
    .map((_, index) => index + 1)
    .reduce((acc, _, index) => {
      const increasedValue = index * 0.15;
      acc.push(1 + increasedValue);
      return acc;
    }, [] as number[]);

  const closeAnimation = async () => {
    shakeAnimation.start({
      translateX: [0, 2, -2, 0, 2, -2, 0],
      transition: {
        duration: CONSTANTS.closeStagger,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });
    for (let i = 0; i < scaleTransition.length; i++) {
      await animate.start({
        height: Math.min(
          CONSTANTS.itemSize * scaleTransition[i],
          CONSTANTS.itemSize + CONSTANTS.itemSize / 2,
        ),
        width: Math.min(
          CONSTANTS.itemSize * scaleTransition[i],
          CONSTANTS.itemSize + CONSTANTS.itemSize / 2,
        ),
        backgroundColor: `color-mix(in srgb, var(--foreground) ${Math.max(
          100 - i * 10,
          40,
        )}%, var(--background))`,
        transition: { duration: CONSTANTS.closeStagger / 2, ease: "linear" },
      });
      if (i !== scaleTransition.length - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, CONSTANTS.closeStagger * 1000),
        );
      }
    }

    shakeAnimation.stop();
    shakeAnimation.start({ translateX: 0, transition: { duration: 0 } });

    animate.start({
      height: CONSTANTS.itemSize,
      width: CONSTANTS.itemSize,
      backgroundColor: "var(--foreground)",
      transition: { duration: 0.1, ease: "backInOut" },
    });
  };

  return (
    <motion.div animate={shakeAnimation} className="z-50">
      <motion.button
        animate={animate}
        style={{ height: CONSTANTS.itemSize, width: CONSTANTS.itemSize }}
        className={cn(STYLES.trigger.container, isOpen && STYLES.trigger.active)}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            closeAnimationCallback();
            closeAnimation();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {isOpen ? (
            <motion.span
              key="menu-close"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {closeIcon}
            </motion.span>
          ) : (
            <motion.span
              key="menu-open"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {openIcon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

function CircleMenu({
  openIcon = <Menu size={18} className="text-background" />,
  closeIcon = <X size={18} className="text-background" />,
  onOpenChange,
}: {
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const animate = useAnimationControls();

  const applyTheme = (nextTheme: "light" | "dark") => {
    const htmlEl = document.documentElement;
    htmlEl.classList.remove("light", "dark");
    htmlEl.classList.add(nextTheme);
  };

  const setThemePreference = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const navigateToHomeCircle = () => {
    setIsOpen(false);
    sessionStorage.setItem(HOME_CIRCLE_FOCUS_KEY, "1");
    router.push("/home/explore");
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push("/home");
  };

  const authItem = isAuthenticated
    ? { label: "Logout", icon: <LogOut size={16} />, onClick: handleLogout }
    : { label: "Login", icon: <LogIn size={16} />, href: "/login" };

  const items = [
    { label: "Home", icon: <Home size={16} />, href: "/home" },
    {
      label: "Apps",
      icon: <AppsGridIcon />,
      onClick: navigateToHomeCircle,
      spinOnClick: true,
    },
    { label: "About", icon: <Info size={16} />, href: "/about" },
    authItem,
    {
      label: theme === "dark" ? "Light" : "Dark",
      icon: theme === "dark" ? <Sun size={16} /> : <Moon size={16} />,
      onClick: () => setThemePreference(theme === "dark" ? "light" : "dark"),
    },
  ];

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const closeAnimationCallback = async () => {
    await animate.start({
      rotate: -360,
      filter: "blur(1px)",
      transition: {
        duration: CONSTANTS.closeStagger * (items.length + 2),
        ease: "linear",
      },
    });
    await animate.start({
      rotate: 0,
      filter: "blur(0px)",
      transition: { duration: 0 },
    });
  };

  return (
    <div
      style={{ width: CONSTANTS.containerSize, height: CONSTANTS.containerSize }}
      className="relative flex items-center justify-center place-self-center"
    >
      <MenuTrigger
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        itemsLength={items.length}
        closeAnimationCallback={closeAnimationCallback}
        openIcon={openIcon}
        closeIcon={closeIcon}
      />
      <motion.div
        animate={animate}
        className="absolute inset-0 z-0 flex items-center justify-center"
      >
        {items.map((item, index) => (
          <MenuItem
            key={`menu-item-${item.label}-${isAuthenticated ? "in" : "out"}-${authLoading ? "loading" : "ready"}`}
            icon={item.icon}
            label={item.label}
            href={item.href}
            onClick={item.onClick}
            spinOnClick={"spinOnClick" in item ? item.spinOnClick : false}
            index={index}
            totalItems={items.length}
            isOpen={isOpen}
          />
        ))}
      </motion.div>
    </div>
  );
}

export { CircleMenu };
