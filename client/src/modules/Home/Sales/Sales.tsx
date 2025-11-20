import ArrowButton from '@/components/ui/ArrowButton/ArrowButton';
import s from './index.module.scss';
import SalesCard from './SalesCard/SalesCard';
import { useCanScroll } from '@/hooks/useCanScroll';

const SALES_EXAMPLE = [
  {
    id: '1',
    webpSrc: null,
    fallbackSrc: null,
    salePercent: 0.1,
    price: 50000,
    name: 'Смартфон Apple iPhone 13 128GB',
    isInStock: true,
    isLiked: false,
  },
  {
    id: '2',
    webpSrc: null,
    fallbackSrc: null,
    salePercent: 0.1,
    price: 50000,
    name: 'Смартфон Apple iPhone 13 128GB',
    isInStock: false,
    isLiked: true,
  },
  {
    id: '3',
    webpSrc: null,
    fallbackSrc: null,
    salePercent: 0.1,
    price: 50000,
    name: 'Смартфон Apple iPhone 13 128GB',
    isInStock: true,
    isLiked: false,
  },
  {
    id: '4',
    webpSrc: null,
    fallbackSrc: null,
    salePercent: 0.1,
    price: 50000,
    name: 'Смартфон Apple iPhone 13 128GB',
    isInStock: true,
    isLiked: false,
  },
  {
    id: '5',
    webpSrc: null,
    fallbackSrc: null,
    salePercent: 0.1,
    price: 50000,
    name: 'Смартфон Apple iPhone 13 128GB',
    isInStock: true,
    isLiked: false,
  },
  {
    id: '6',
    webpSrc: null,
    fallbackSrc: null,
    salePercent: 0.1,
    price: 50000,
    name: 'Смартфон Apple iPhone 13 128GB',
    isInStock: true,
    isLiked: false,
  },
];

const Sales = () => {
  const { canScroll, listRef, scrollNext, scrollPrev } = useCanScroll(220);

  return (
    <section className={`container ${s.section}`} aria-labelledby="sales-section-id">
      <h2 id="sales-section-id">Акции</h2>
      <div className={s.overlay}>
        {canScroll.left && (
          <ArrowButton
            direction="left"
            onClick={scrollPrev}
            className={s.leftArrow}
            style={{ color: 'var(--color-purple)', borderColor: 'var(--color-purple)' }}
            aria-label="Предыдущая акция"
            aria-controls="sales-list"
          />
        )}
        <ul id="sales-list" className={s.list} ref={listRef} tabIndex={0} aria-label="Список товаров со скидками. Прокрутка горизонтальная.">
          {SALES_EXAMPLE.map((item) => {
            return (
              <li key={item.id} className={s.item}>
                <SalesCard data={item} />
              </li>
            );
          })}
        </ul>
        {canScroll.right && (
          <ArrowButton
            direction="right"
            onClick={scrollNext}
            className={s.rightArrow}
            style={{ color: 'var(--color-purple)', borderColor: 'var(--color-purple)' }}
            aria-label="Следующая акция"
            aria-controls="sales-list"
          />
        )}
      </div>
    </section>
  );
};

export default Sales;
