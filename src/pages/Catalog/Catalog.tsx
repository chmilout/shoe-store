import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchQuery,
  selectSearchQuery,
} from '../../store/catalogSlice';
import Categories from '../../components/Categories/Categories';
import CatalogItems from '../../components/CatalogItems/CatalogItems';
import CatalogSearch from '../../components/CatalogSearch/CatalogSearch';

function Catalog() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = useSelector(selectSearchQuery);

  const searchQueryFromUrl = searchParams.get('q') || '';

  useEffect(() => {
    dispatch(setSearchQuery(searchQueryFromUrl));
  }, [dispatch, searchQueryFromUrl]);

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleSearchSubmit = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query.trim()) {
      newParams.set('q', query.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
    dispatch(setSearchQuery(query.trim()));
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
            <Categories />
            <CatalogItems />
          </section>
        </div>
      </div>
    </main>
  );
}

export default Catalog;
