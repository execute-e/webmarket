import CartIcon from '@/components/ui/Navigation/icons/CartIcon';
import CatalogIcon from '@/components/ui/Navigation/icons/CatalogIcon';
import ProfileIcon from '@/components/ui/Navigation/icons/ProfileIcon';
import { Link, useLocation } from 'react-router';
import s from './index.module.scss';
import HomeIcon from './icons/HomeIcon';
import { useCallback } from 'react';
import { createPortal } from 'react-dom';

interface IProps {
  type: 'mobile' | 'desktop';
}

const Navigation = ({ type }: IProps) => {
  const location = useLocation();

  const isMobile = type === 'mobile';
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const nav = (
    <nav
      className={s.nav}
      data-type={type}
      aria-label={isMobile ? 'Мобильная навигация' : 'Основная навигация'}>
      <ul className={s.list + " " + (isMobile ? "container" : "")}>
        {type === 'mobile' && (
          <li className={s.listItem}>
            <Link
              to="/"
              className={`${s.link} ${isActive('/') ? s.active : ''}`}
              aria-current={isActive('/') ? 'page' : undefined}>
              <HomeIcon className={s.icon} />
              <span>Главная</span>
            </Link>
          </li>
        )}
        <li className={s.listItem}>
          <Link
            to="/catalog"
            className={`${s.link} ${isActive('/catalog') ? s.active : ''}`}
            aria-current={isActive('/catalog') ? 'page' : undefined}>
            <CatalogIcon className={s.icon} />
            <span>Каталог</span>
          </Link>
        </li>
        <li className={s.listItem}>
          <Link
            to="/cart"
            className={`${s.link} ${isActive('/cart') ? s.active : ''}`}
            aria-current={isActive('/cart') ? 'page' : undefined}>
            <CartIcon className={s.icon} />
            <span>Корзина</span>
          </Link>
        </li>
        <li className={s.listItem}>
          <Link
            to="/profile"
            className={`${s.link} ${isActive('/profile') ? s.active : ''}`}
            aria-current={isActive('/profile') ? 'page' : undefined}>
            <ProfileIcon className={s.icon} />
            <span>Профиль</span>
          </Link>
        </li>
      </ul>
    </nav>
  );

  if (isMobile) {
    return createPortal(nav, document.body);
  }

  return nav;
};

export default Navigation;
