import { type FC } from 'react';
import { TopSales } from '../../components/TopSales';
import { Categories } from '../../components/Categories';
import { CatalogItems } from '../../components/CatalogItems';

export const Home: FC = () => {
  return (
    <main className="container">
      <div className="row">
        <div className="col">
          <div className="banner">
            <img
              src="/img/banner.jpg"
              className="img-fluid"
              alt="К весне готовы!"
            />
            <h2 className="banner-header">К весне готовы!</h2>
          </div>
          <TopSales />
          <section className="catalog">
            <Categories />
            <CatalogItems />
          </section>
        </div>
      </div>
    </main>
  );
};
