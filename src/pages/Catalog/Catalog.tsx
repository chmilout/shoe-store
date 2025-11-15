import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Categories from '../../components/Categories/Categories';
import CatalogItems from '../../components/CatalogItems/CatalogItems';
import CatalogSearch from '../../components/CatalogSearch/CatalogSearch';

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const searchQueryFromUrl = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);

  useEffect(() => {
    setSearchQuery(searchQueryFromUrl);
  }, [searchParams.toString()]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query.trim()) {
      newParams.set('q', query.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
    setSearchQuery(query.trim());
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

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
          <section className="catalog">
            <h2 className="text-center">Каталог</h2>
            <CatalogSearch
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
            />
            <Categories
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={handleCategoryChange}
            />
            <CatalogItems
              categoryId={selectedCategoryId}
              searchQuery={searchQueryFromUrl.trim() || undefined}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

export default Catalog;
