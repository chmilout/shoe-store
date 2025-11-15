import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { fetchTopSales, type TopSaleItem } from '../../utils/api';
import Loader from '../Loader/Loader';
import './TopSales.css';

function TopSales() {
  const [items, setItems] = useState<TopSaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTopSales();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    loadTopSales();
  }, []);

  if (loading) {
    return (
      <section className="top-sales">
        <h2 className="text-center">Хиты продаж!</h2>
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section className="top-sales">
        <h2 className="text-center">Хиты продаж!</h2>
        <p className="text-center text-danger">Ошибка: {error}</p>
      </section>
    );
  }

  // Если нет хитов продаж, не отображаем компонент
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="top-sales">
      <h2 className="text-center">Хиты продаж!</h2>
      <div className="row">
        {items.map((item) => (
          <div key={item.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card catalog-item-card">
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
    </section>
  );
}

export default TopSales;

