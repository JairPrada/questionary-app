"use client";
import { cn } from "@/lib/utils";
import React, {
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "motion/react";

const ContainerRefContext = createContext<React.RefObject<HTMLDivElement> | null>(
  null,
);

export const DraggableCardBody = ({
  className,
  children,
  draggable,
  drag = true,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: {
  className?: string;
  children?: React.ReactNode;
  draggable?: boolean;
  drag?: boolean;
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  onDragEnd?: React.DragEventHandler<HTMLDivElement>;
  onDrop?: React.DragEventHandler<HTMLDivElement>;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  // physics biatch
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [25, -25]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-25, 25]),
    springConfig,
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]),
    springConfig,
  );

  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]),
    springConfig,
  );

  useEffect(() => {
    // Update constraints when component mounts or window resizes
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setConstraints({
          top: -window.innerHeight / 2,
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          bottom: window.innerHeight / 2,
        });
      }
    };

    updateConstraints();

    // Add resize listener
    window.addEventListener("resize", updateConstraints);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateConstraints);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerRef = useContext(ContainerRefContext);

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={cn(
        "rounded-lg border border-slate-800 bg-slate-900/50 p-3",
        className,
      )}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        drag={drag}
        dragConstraints={(containerRef as React.RefObject<HTMLDivElement>) ?? constraints}
        onDragStart={() => {
          document.body.style.cursor = "grabbing";
        }}
        onDragEnd={(_event, info) => {
          document.body.style.cursor = "default";

          controls.start({
            rotateX: 0,
            rotateY: 0,
            transition: {
              type: "spring",
              ...springConfig,
            },
          });
          const currentVelocityX = velocityX.get();
          const currentVelocityY = velocityY.get();

          const velocityMagnitude = Math.sqrt(
            currentVelocityX * currentVelocityX +
              currentVelocityY * currentVelocityY,
          );
          const bounce = Math.min(0.8, velocityMagnitude / 1000);

          animate(info.point.x, info.point.x + currentVelocityX * 0.3, {
            duration: 0.8,
            ease: [0.2, 0, 0, 1],
            bounce,
            type: "spring",
            stiffness: 50,
            damping: 15,
            mass: 0.8,
          });

          animate(info.point.y, info.point.y + currentVelocityY * 0.3, {
            duration: 0.8,
            ease: [0.2, 0, 0, 1],
            bounce,
            type: "spring",
            stiffness: 50,
            damping: 15,
            mass: 0.8,
          });
        }}
        style={{
          rotateX,
          rotateY,
          opacity,
          willChange: "transform",
        }}
        animate={controls}
        whileHover={{ scale: 1.02 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full w-full"
      >
        {children}
        <motion.div
          style={{
            opacity: glareOpacity,
          }}
          className="pointer-events-none absolute inset-0 bg-white/10 select-none"
        />
      </motion.div>
    </div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ContainerRefContext.Provider value={ref}>
      <div ref={ref} className={cn("[perspective:3000px]", className)}>
        {children}
      </div>
    </ContainerRefContext.Provider>
  );
};
