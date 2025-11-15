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

  // Получаем поисковый запрос из URL
  const searchQueryFromUrl = searchParams.get('q') || '';

  // Локальное состояние для поля ввода (не live-поиск)
  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);

  // Синхронизируем локальное состояние с URL при изменении параметров извне
  useEffect(() => {
    setSearchQuery(searchQueryFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleSearchChange = (query: string) => {
    // Только обновляем локальное состояние, не обновляем URL
    setSearchQuery(query);
  };

  const handleSearchSubmit = (query: string) => {
    // Обновляем URL с параметром поиска только при отправке формы
    const newParams = new URLSearchParams(searchParams);
    if (query.trim()) {
      newParams.set('q', query.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
    // Синхронизируем локальное состояние с URL после обновления
    setSearchQuery(query.trim());
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    // При смене категории данные перезагружаются с учетом строки поиска
    // Это происходит автоматически через useEffect в CatalogItems
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
