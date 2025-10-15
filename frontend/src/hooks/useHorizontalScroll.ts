import { useRef, useEffect } from 'react';

const LERP_FACTOR = 0.1;
const SCROLL_MULTIPLIER = 3;

export function useHorizontalScroll() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let targetScrollLeft = el.scrollLeft;
    let animationFrameId: number | null = null;

    const smoothScroll = () => {
      const diff = targetScrollLeft - el.scrollLeft;

      if (Math.abs(diff) < 0.5) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        return;
      }

      el.scrollLeft += diff * LERP_FACTOR;
      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      targetScrollLeft = el.scrollLeft + e.deltaY * SCROLL_MULTIPLIER;

      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(smoothScroll);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return elRef;
}
