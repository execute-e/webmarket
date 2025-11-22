import { Outlet } from "react-router";

const Catalog = () => {
    return (
        <div className="container">
            <Outlet />
        </div>
    );
};

export default Catalog;