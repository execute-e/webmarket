import Picture from '@/utils/Picture';
import s from './index.module.scss';
import { Link } from 'react-router';
import { CATEGORIES } from './catalog.config';
import ArrowButton from '@/components/ui/ArrowButton/ArrowButton';
import { useCanScroll } from '@/hooks/useCanScroll';

const Catalog = () => {
  const { canScroll, listRef, scrollNext, scrollPrev } = useCanScroll(200);

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
              <Link to="categories/" className={s.link}>
                <div className={s.card}>
                  <Picture
                    webp={item.webpSrc}
                    fallback={item.fallbackSrc}
                    width={200}
                    height={200}
                    alt={item.name}
                    className={s.image}
                  />
                </div>
                <span className={s.itemText}>{item.name}</span>
              </Link>
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
