import { useRef, useState, useCallback, useEffect } from 'react';

export const useCanScroll = (scroll: number = 200) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = listRef.current;
    if (!el) return;

    const left = el.scrollLeft > 0;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;

    setCanScroll((prev) => (prev.left !== left || prev.right !== right ? { left, right } : prev));
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };

    update();

    el.addEventListener('scroll', onScroll);
    window.addEventListener('resize', update);

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scrollNext = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    list.scrollBy({ left: scroll, behavior: 'smooth' });
  }, [scroll]);

  const scrollPrev = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    list.scrollBy({ left: -scroll, behavior: 'smooth' });
  }, [scroll]);

  return {
    canScroll,
    listRef,
    scrollNext,
    scrollPrev,
  }
};
