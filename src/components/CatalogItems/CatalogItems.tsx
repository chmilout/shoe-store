import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { fetchItems, type CatalogItem } from '../../utils/api';
import Loader from '../Loader/Loader';
import './CatalogItems.css';

interface CatalogItemsProps {
  categoryId: number | null;
}

const ITEMS_PER_PAGE = 6;

function CatalogItems({ categoryId }: CatalogItemsProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        setOffset(0);
        const data = await fetchItems({
          categoryId: categoryId || undefined,
          offset: 0,
        });
        setItems(data);
        setHasMore(data.length === ITEMS_PER_PAGE);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [categoryId]);

  const handleLoadMore = async () => {
    const newOffset = offset + ITEMS_PER_PAGE;
    try {
      setLoadingMore(true);
      const data = await fetchItems({
        categoryId: categoryId || undefined,
        offset: newOffset,
      });

      if (data.length === 0 || data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setItems((prev) => [...prev, ...data]);
      setOffset(newOffset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <section className="catalog">
        <h2 className="text-center">Каталог</h2>
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section className="catalog">
        <h2 className="text-center">Каталог</h2>
        <p className="text-center text-danger">Ошибка: {error}</p>
      </section>
    );
  }

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>
      <div className="row">
        {items.map((item) => (
          <div
            key={item.id}
            className="col-12 col-md-6 col-lg-4 catalog-item-card mb-4"
          >
            <div className="card h-100">
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
      {hasMore && (
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
    </section>
  );
}

export default CatalogItems;
