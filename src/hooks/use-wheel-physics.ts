import { useCallback, useEffect, useRef, useState } from "react";
import { clockAudio } from "../utils/clock-audio";
import { ITEM_HEIGHT } from "../components/mobile-time-picker/constants";


// --- Configuration Constants ---
const FRICTION = 0.95;
const MIN_VELOCITY = 0.1;

interface UseWheelPhysicsProps {
  value: number;
  max: number;
  inertiaCoefficient: number;
  onChange: (value: number, loopDelta: number) => void;
  onStartAnimating: () => boolean;
  onStopAnimating: () => void;
}

export function useWheelPhysics({
  value,
  max,
  inertiaCoefficient,
  onChange,
  onStartAnimating,
  onStopAnimating,
}: UseWheelPhysicsProps) {
  // --- Input & Boundary Tracking Refs ---
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const scrollIndexRef = useRef(value);
  const accumulatedOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // --- Component Local UI State ---
  const [visualOffset, setVisualOffset] = useState(0);
  const [renderValue, setRenderValue] = useState(value);
  const [isSnapping, setIsSnapping] = useState(false);

  // Preserve mutable reference to incoming callback to prevent inertia loop tearing
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Synchronize internal wheel track index with upstream model changes
  useEffect(() => {
    if (isAnimatingRef.current) { return; }

    const currentLoop = Math.floor(scrollIndexRef.current / max);
    scrollIndexRef.current = currentLoop * max + value;
    setRenderValue(value);
  }, [value, max]);

  /**
   * Evaluates indexing tracks and dispatches mathematically safe delta updates upstream
   */
  const handleIndexChange = useCallback((nextIndex: number) => {
    const prevIndex = scrollIndexRef.current;
    if (nextIndex === prevIndex) { return; }

    const prevValue = ((prevIndex % max) + max) % max;
    const nextValue = ((nextIndex % max) + max) % max;

    let loopDelta = 0;
    if (nextIndex > prevIndex && nextValue < prevValue) {
      loopDelta = 1;
    } else if (nextIndex < prevIndex && nextValue > prevValue) {
      loopDelta = -1;
    }

    scrollIndexRef.current = nextIndex;
    setRenderValue(nextValue);

    clockAudio.playTick();
    onChangeRef.current(nextValue, loopDelta);
  }, [max]);

  /**
   * Resets active acceleration bounds and transitions to magnetic slot snap
   */
  const snapToNearest = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = null;

    setIsSnapping(true);
    accumulatedOffsetRef.current = 0;
    setVisualOffset(0);

    isAnimatingRef.current = false;
    onStopAnimating();
  }, [onStopAnimating]);

  /**
   * Recursive requestAnimationFrame physics tick executor loop
   */
  const runInertia = useCallback((initialVelocity: number) => {
    let velocity = initialVelocity;

    const step = () => {
      velocity *= FRICTION;

      if (Math.abs(velocity) < MIN_VELOCITY) {
        snapToNearest();
        return;
      }

      accumulatedOffsetRef.current += velocity;

      if (Math.abs(accumulatedOffsetRef.current) >= ITEM_HEIGHT) {
        const steps = Math.trunc(accumulatedOffsetRef.current / ITEM_HEIGHT);
        accumulatedOffsetRef.current -= steps * ITEM_HEIGHT;

        handleIndexChange(scrollIndexRef.current - steps);
      }

      setVisualOffset(accumulatedOffsetRef.current);
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, [snapToNearest, handleIndexChange]);

  // --- Interaction Event Pipeline Handlers ---
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const canStart = onStartAnimating();
    if (!canStart) { return; }

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    isDraggingRef.current = true;
    isAnimatingRef.current = true;
    setIsSnapping(false);
    startYRef.current = e.clientY;
    lastTimestampRef.current = e.timeStamp;
    velocityRef.current = 0;
  }, [onStartAnimating]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) { return; }

    const now = e.timeStamp;
    const dt = now - lastTimestampRef.current;
    const deltaY = e.clientY - startYRef.current;

    if (dt > 0) {
      velocityRef.current = deltaY / dt;
    }

    startYRef.current = e.clientY;
    lastTimestampRef.current = now;
    accumulatedOffsetRef.current += deltaY;

    if (Math.abs(accumulatedOffsetRef.current) >= ITEM_HEIGHT) {
      const steps = Math.trunc(accumulatedOffsetRef.current / ITEM_HEIGHT);
      accumulatedOffsetRef.current -= steps * ITEM_HEIGHT;

      handleIndexChange(scrollIndexRef.current - steps);
    }

    setVisualOffset(accumulatedOffsetRef.current);
  }, [handleIndexChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) { return; }
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;

    if (Math.abs(velocityRef.current) > MIN_VELOCITY) {
      runInertia(velocityRef.current * inertiaCoefficient);
    } else {
      snapToNearest();
    }
  }, [inertiaCoefficient, runInertia, snapToNearest]);

  return {
    renderValue,
    visualOffset,
    isSnapping,
    pointerHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  };
}
