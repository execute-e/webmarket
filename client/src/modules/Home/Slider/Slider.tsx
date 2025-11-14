import ArrowButton from '@/components/ui/ArrowButton/ArrowButton';
import s from './index.module.scss';
import { useInfinitySlider } from './useInfinitySlider';

const items = [
  <div>
    <div>item 1</div>
  </div>,
  <div>
    <div>item 2</div>
  </div>,
  <div>
    <div>item 3</div>
  </div>,
];

const Slider = () => {
  const { listRef, extended, translateX, animate, next, prev, handleTransitionEnd } =
    useInfinitySlider(items, 20);

  return (
    <section className={s.window + ' container'}>
      <div className={s.overlay}>
        <ArrowButton direction="left" onClick={prev} className={s.leftArrow} />
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
        <ArrowButton direction="right" onClick={next} className={s.rightArrow} />
      </div>
    </section>
  );
};

export default Slider;
