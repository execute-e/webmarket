import Picture from '@/utils/Picture';
import s from './index.module.scss';
import { Link } from 'react-router';
import { CATEGORIES } from './catalog.config';
import ArrowButton from '@/components/ui/ArrowButton/ArrowButton';
import { useCallback, useEffect, useRef, useState } from 'react';

const Catalog = () => {
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

    list.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  const scrollPrev = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    list.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  return (
    <section className={`container ${s.section}`} aria-labelledby="catalog-section-title">
      <h2 id="catalog-section-title">Каталог</h2>
      <div className={s.overlay}>
        {canScroll.left && (
          <ArrowButton
            direction="left"
            className={s.leftArrow}
            style={{ color: 'var(--color-purple)', borderColor: 'var(--color-purple)' }}
            onClick={scrollPrev}
            aria-label="Предыдущая категория"
          />
        )}
        <ul ref={listRef} className={s.window}>
          {CATEGORIES.map((item) => (
            <li key={item.id} className={s.item}>
              <article>
                <Link to="categories/" className={s.link}>
                  <div className={s.card}>
                    <img
                      src={item.fallbackSrc}
                      alt=""
                      className={s.image}
                      width=""
                      height=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <span className={s.itemText}>{item.name}</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
        {canScroll.right && (
          <ArrowButton
            direction="right"
            className={s.rightArrow}
            style={{ color: 'var(--color-purple)', borderColor: 'var(--color-purple)' }}
            aria-label="Следующая категория"
            onClick={scrollNext}
          />
        )}
      </div>
    </section>
  );
};

export default Catalog;
