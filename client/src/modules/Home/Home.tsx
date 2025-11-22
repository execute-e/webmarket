import Catalog from "./Catalog/Catalog";
import Sales from "./Sales/Sales";
import Slider from "./Slider/Slider";

const Home = () => {
    return (
        <div>
            <Slider />
            <Catalog />
            <Sales />
        </div>
    );
};

export default Home;