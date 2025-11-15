import { useEffect } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import {
  fetchItemsThunk,
  selectCatalogItems,
  selectCatalogItemsLoading,
  selectCatalogItemsLoadingMore,
  selectCatalogError,
  selectHasMore,
  resetItems,
} from '../../store/catalogSlice';
import Loader from '../Loader/Loader';

function CatalogItems() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCatalogItems);
  const loading = useSelector(selectCatalogItemsLoading);
  const loadingMore = useSelector(selectCatalogItemsLoadingMore);
  const error = useSelector(selectCatalogError);
  const hasMore = useSelector(selectHasMore);
  const selectedCategoryId = useSelector(
    (state: { catalog: { selectedCategoryId: number | null } }) =>
      state.catalog.selectedCategoryId
  );
  const searchQuery = useSelector(
    (state: { catalog: { searchQuery: string } }) => state.catalog.searchQuery
  );

  useEffect(() => {
    dispatch(resetItems());
    dispatch(
      fetchItemsThunk({
        categoryId: selectedCategoryId || undefined,
        offset: 0,
        q: searchQuery || undefined,
        append: false,
      })
    );
  }, [dispatch, selectedCategoryId, searchQuery]);

  const handleLoadMore = () => {
    const currentOffset = items.length;
    dispatch(
      fetchItemsThunk({
        categoryId: selectedCategoryId || undefined,
        offset: currentOffset,
        q: searchQuery || undefined,
        append: true,
      })
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-center text-danger">Ошибка: {error}</p>;
  }

  return (
    <>
      {items.length === 0 ? (
        <p className="text-center">Товары не найдены</p>
      ) : (
        <div className="row">
          {items.map((item) => (
            <div
              key={item.id}
              className="col-12 col-md-6 col-lg-4 catalog-item-card mb-4"
            >
              <div className="card">
                <img
                  src={item.images[0] || '/img/products/placeholder.jpg'}
                  className="card-img-top img-fluid"
                  alt={item.title}
                />
                <div className="card-body">
                  <p className="card-text">{item.title}</p>
                  <p className="card-text">
                    {item.price.toLocaleString('ru-RU')} руб.
                  </p>
                  <Link
                    to={`/catalog/${item.id}`}
                    className="btn btn-outline-primary"
                  >
                    Заказать
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {hasMore && items.length > 0 && (
        <div className="text-center mt-4">
          {loadingMore && <Loader />}
          <button
            className="btn btn-outline-primary"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            Загрузить ещё
          </button>
        </div>
      )}
    </>
  );
}

export default CatalogItems;
