import { useState } from 'react';
import TopSales from '../../components/TopSales/TopSales';
import Categories from '../../components/Categories/Categories';
import CatalogItems from '../../components/CatalogItems/CatalogItems';

function Home() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

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
            <Categories
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
            />
            <CatalogItems categoryId={selectedCategoryId} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default Home;

