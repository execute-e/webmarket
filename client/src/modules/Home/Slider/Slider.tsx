import ArrowButton from '@/components/ui/ArrowButton/ArrowButton';
import s from './index.module.scss';
import { useInfinitySlider } from './useInfinitySlider';
import Picture from '@/utils/Picture';
import tvPng from './images/tv.png';
import tvWebp from './images/tv.webp';

const items = [
  <div className={s.element}>
    <div className={s.elementText}>
      <p className={s.elementDesc}>Суперцены на все телевизоры.</p>
      <h2 className={s.elementTitle}>СКИДКА 20%</h2>
    </div>
    <Picture webp={tvWebp} fallback={tvPng} width={400} height={260} alt='Телевизор Samsung' className={s.image} />
  </div>,

];

const Slider = () => {
  const { listRef, extended, translateX, animate, next, prev, handleTransitionEnd } =
    useInfinitySlider(items, 20);

  return (
    <section className={s.window + ' container'}>
      <div className={s.overlay}>
        <ArrowButton direction="left" onClick={prev} className={s.leftArrow} aria-label='Предыдущий баннер' />
        <ul
          className={s.list}
          ref={listRef}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: animate ? '0.3s ease' : 'none',
          }}>
          {extended.map((node, i) => (
            <li className={s.item} key={i}>
              {node}
            </li>
          ))}
        </ul>
        <ArrowButton direction="right" onClick={next} className={s.rightArrow} aria-label='Следующий баннер' />
      </div>
    </section>
  );
};

export default Slider;
