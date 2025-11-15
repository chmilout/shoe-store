import { type FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { About } from './pages/About';
import { Contacts } from './pages/Contacts';
import { Product } from './pages/Product';
import { Cart } from './pages/Cart';
import { NotFound } from './pages/NotFound';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/catalog/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
