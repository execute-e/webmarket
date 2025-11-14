import Search from '@/components/ui/Search/Search';
import Logo from '../../ui/Logo/Logo';
import s from './index.module.scss';
import Navigation from '@/components/ui/Navigation/Navigation';

const Header = () => {
  return (
    <header className={`container ${s.header}`}>
      <Logo />
      <Search />
      <Navigation type='desktop' />
      <Navigation type='mobile' />
    </header>
  );
};

export default Header;
