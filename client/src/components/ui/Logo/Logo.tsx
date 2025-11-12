import { Link } from "react-router";
import s from "./index.module.scss";

const Logo = () => {
    return (
        <Link to="/" className={s.link} aria-label="GLANCE - На главную" >
            <span className="logo" role="img" aria-hidden="true">glance</span>
        </Link>
    );
};

export default Logo;