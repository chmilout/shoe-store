import { type FC, useEffect } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import {
  fetchTopSalesThunk,
  selectTopSalesItems,
  selectTopSalesLoading,
  selectTopSalesError,
} from '../../store/topSalesSlice';
import { Loader } from '../Loader';

export const TopSales: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectTopSalesItems);
  const loading = useSelector(selectTopSalesLoading);
  const error = useSelector(selectTopSalesError);

  useEffect(() => {
    dispatch(fetchTopSalesThunk());
  }, [dispatch]);

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
};
