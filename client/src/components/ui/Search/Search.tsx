import SearchIcon from './icons/SearchIcon';
import s from './index.module.scss';

const Search = () => {
  return (
    <section role="search" aria-label="Поиск товаров" className={s.overlay}>
      <form className={s.form} role="search" aria-labelledby="search-label">
        <fieldset className={s.fieldset}>
          <legend id="search-label" className="visually-hidden">
            Поиск...
          </legend>

          <label htmlFor="search-input" className="visually-hidden">
            Search
          </label>
          <button type="submit" className={s.icon} aria-label="Найти" title="Найти">
            <SearchIcon />
          </button>
          <input
            type="text"
            name="search"
            id="search-input"
            className={s.search}
            placeholder="Поиск"
            aria-label="Введите запрос для поиска"
            autoComplete="off"
          />
        </fieldset>
      </form>
      <div role="region" aria-live="polite" aria-label="Результаты поиска">
        {/* Результаты поиска */}
      </div>
    </section>
  );
};

export default Search;
