import SearchIcon from './icons/SearchIcon';
import s from './index.module.scss';

const Search = () => {
  return (
    <div className={s.overlay}>
      <form className={s.form}>
        <fieldset className={s.fieldset}>
          <legend className="visually-hidden">Поиск...</legend>

          <label htmlFor="search-input" className="visually-hidden">
            Search
          </label>
          <SearchIcon className={s.icon} />
          <input
            type="text"
            name="search"
            id="search-input"
            className={s.search}
            placeholder="Поиск"
          />
        </fieldset>
      </form>
      <div></div> {/* Результаты поиска */}
    </div>
  );
};

export default Search;
