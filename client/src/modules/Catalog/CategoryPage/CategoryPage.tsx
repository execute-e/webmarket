import { Link, useParams } from 'react-router';
import s from './index.module.scss';
import ArrowIcon from '@/components/ui/ArrowButton/icons/ArrowIcon';
import SortIcon from './icons/SortIcon';
import GridIcon from './icons/GridIcon';
import ColumnIcon from './icons/ColumnIcon';
import { useState } from 'react';

const CategoryPage = () => {
  const { category } = useParams();
  const [mode, setMode] = useState<'grid' | 'column'>('grid');

  return (
    <div className={s.parent}>
      <header className={s.header}>
        <Link to={'/home'}>
          <ArrowIcon direction="left" />
        </Link>
        <h2 className={s.title}>{category}</h2>
      </header>
      <div className={s.category}>
        <section className={s.extra}>
          <button type="button" aria-live="polite" className={s.sort}>
            <SortIcon />
            <span>{'По популярности'}</span>
          </button>
          <div className={s.mode} data-current-mode={mode}>
            <button
              className={`${s.modeGrid} ${mode === 'grid' ? s.active : ''}`}
              type="button"
              onClick={() => setMode('grid')}>
              <GridIcon />
            </button>
            <button
              className={`${s.modeColumn} ${mode === 'column' ? s.active : ''}`}
              type="button"
              onClick={() => setMode('column')}>
              <ColumnIcon />
            </button>
          </div>
        </section>
        <main className={s.main}>
          <div className={s.filters}></div>
          <ul className={s.list}></ul>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
