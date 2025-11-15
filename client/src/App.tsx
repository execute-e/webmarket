import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './modules/Home/Home';
import Header from './components/layout/Header/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route index path="/" element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
