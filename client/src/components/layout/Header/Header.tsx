import Search from "@/components/ui/Search/Search";
import Logo from "../../ui/Logo/Logo";
import s from './index.module.scss';
import { Link } from "react-router";

const Header = () => {
    return (
        <header className={`container ${s.header}`}>
            <Logo />
            <Search />
            <nav>
                <ul>
                    <li>
                        <Link to="/catalog"></Link>
                    </li>
                    <li>
                        <Link to="/cart"></Link>
                    </li>
                    <li>
                        <Link to="/profile"></Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;