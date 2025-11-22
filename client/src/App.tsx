import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Home from './modules/Home/Home';
import Header from './components/layout/Header/Header';
import Catalog from './modules/Catalog/Catalog';
import CategoryPage from './modules/Catalog/CategoryPage/CategoryPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route index path="/" element={<Navigate to={'/home'} />} />
          <Route path='home' element={<Home />}   />
          <Route path='/catalog' element={<Catalog />}>
            <Route index element={<Navigate to={'phones'} replace />} />
            <Route path=':category' element={<CategoryPage />}/>
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
