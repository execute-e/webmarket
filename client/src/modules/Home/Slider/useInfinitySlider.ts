import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useInfinitySlider(items: ReactNode[], gap = 20) {
  const listRef = useRef<HTMLUListElement>(null);

  const extended = useMemo<ReactNode[]>(
    () => [items[items.length - 1], ...items, items[0]],
    [items],
  );

  const [index, setIndex] = useState(1);
  const [itemWidth, setItemWidth] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const calculateWidth = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const firstElement = list.children[0] as HTMLElement;
    if (!firstElement) return;

    const width = firstElement.getBoundingClientRect().width;
    setItemWidth((prev) => (prev !== width ? width : prev));
  }, []);

  useEffect(() => {
    calculateWidth();

    let timeout: ReturnType<typeof setTimeout>;

    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(calculateWidth, 120);
    };

    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
  }, [calculateWidth]);

  const next = useCallback(() => {
    if (isLocked) return;
    setIsLocked(true);
    setAnimate(true);
    setIndex((prev) => prev + 1);
  }, [isLocked]);

  const prev = useCallback(() => {
    if (isLocked) return;
    setIsLocked(true);
    setAnimate(true);
    setIndex((prev) => prev - 1);
  }, [isLocked]);

  const handleTransitionEnd = useCallback(() => {
    const total = extended.length;

    if (index === total - 1) {
      setAnimate(false);
      setIndex(1);
    }

    if (index === 0) {
      setAnimate(false);
      setIndex(total - 2);
    }

    setIsLocked(false);
  }, [index, extended.length]);

  const translateX = useMemo(() => {
    if (!itemWidth) return 0;
    return -(index * (itemWidth + gap));
  }, [index, itemWidth, gap]);

  return {
    listRef,
    extended,
    translateX,
    animate,
    next,
    prev,
    handleTransitionEnd,
  };
}
