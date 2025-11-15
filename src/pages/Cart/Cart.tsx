import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import type { AppDispatch } from '../../store';
import {
  selectCartItems,
  selectCartTotal,
  selectCartLoading,
  selectCartError,
  selectOrderSuccess,
  removeFromCart,
  updateItemCount,
  submitOrderThunk,
  resetOrderStatus,
} from '../../store/cartSlice';
import Loader from '../../components/Loader/Loader';
import './Cart.css';

function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const orderSuccess = useSelector(selectOrderSuccess);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    phone?: string;
    address?: string;
    agreement?: string;
  }>({});

  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetOrderStatus());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess, dispatch]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const handleRemoveItem = (id: number, size: string) => {
    dispatch(removeFromCart({ id, size }));
  };

  const handleQuantityChange = (id: number, size: string, delta: number) => {
    const item = cartItems.find((item) => item.id === id && item.size === size);
    if (item) {
      const newCount = item.count + delta;
      if (newCount > 0) {
        dispatch(updateItemCount({ id, size, count: newCount }));
      } else {
        dispatch(removeFromCart({ id, size }));
      }
    }
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};

    if (!phone.trim()) {
      errors.phone = 'Введите телефон';
    } else if (!/^\+7\d{10}$/.test(phone.replace(/\s/g, ''))) {
      errors.phone = 'Телефон должен быть в формате +7xxxxxxxxxx';
    }

    if (!address.trim()) {
      errors.address = 'Введите адрес доставки';
    }

    if (!agreement) {
      errors.agreement = 'Необходимо согласие с правилами доставки';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const orderData = {
      owner: {
        phone: phone.replace(/\s/g, ''),
        address: address.trim(),
      },
      items: cartItems.map((item) => ({
        id: item.id,
        price: item.price,
        count: item.count,
      })),
    };

    dispatch(submitOrderThunk(orderData));
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

          {orderSuccess && (
            <div className="alert alert-success text-center" role="alert">
              <h4>Заказ успешно оформлен!</h4>
              <p>Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              <h4>Ошибка оформления заказа</h4>
              <p>{error}</p>
            </div>
          )}

          <section className="cart">
            <h2 className="text-center">Корзина</h2>
            {cartItems.length === 0 ? (
              <p className="text-center">Корзина пуста</p>
            ) : (
              <>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Название</th>
                      <th scope="col">Размер</th>
                      <th scope="col">Кол-во</th>
                      <th scope="col">Стоимость</th>
                      <th scope="col">Итого</th>
                      <th scope="col">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={`${item.id}-${item.size}`}>
                        <td scope="row">{index + 1}</td>
                        <td>
                          <Link to={`/catalog/${item.id}`}>{item.title}</Link>
                        </td>
                        <td>{item.size}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-secondary"
                              onClick={() =>
                                handleQuantityChange(item.id, item.size, -1)
                              }
                              disabled={loading}
                            >
                              -
                            </button>
                            <span className="btn btn-outline-primary">
                              {item.count}
                            </span>
                            <button
                              className="btn btn-secondary"
                              onClick={() =>
                                handleQuantityChange(item.id, item.size, 1)
                              }
                              disabled={loading}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>{formatPrice(item.price)} руб.</td>
                        <td>{formatPrice(item.price * item.count)} руб.</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveItem(item.id, item.size)}
                            disabled={loading}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={5} className="text-right">
                        <strong>Общая стоимость</strong>
                      </td>
                      <td>
                        <strong>{formatPrice(cartTotal)} руб.</strong>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

                <div className="cart-items-mobile">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="cart-item-card"
                    >
                      <div className="cart-item-header">
                        <h5 className="cart-item-title">
                          <Link to={`/catalog/${item.id}`}>{item.title}</Link>
                        </h5>
                        <button
                          className="btn btn-outline-danger btn-sm cart-item-remove"
                          onClick={() => handleRemoveItem(item.id, item.size)}
                          disabled={loading}
                          aria-label="Удалить товар"
                        >
                          ×
                        </button>
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-detail">
                          <span className="cart-item-detail-label">Размер</span>
                          <span className="cart-item-detail-value">
                            {item.size}
                          </span>
                        </div>
                        <div className="cart-item-detail">
                          <span className="cart-item-detail-label">
                            Цена за шт.
                          </span>
                          <span className="cart-item-detail-value">
                            {formatPrice(item.price)} руб.
                          </span>
                        </div>
                      </div>
                      <div className="cart-item-quantity">
                        <span className="cart-item-detail-label">
                          Количество:
                        </span>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              handleQuantityChange(item.id, item.size, -1)
                            }
                            disabled={loading}
                            aria-label="Уменьшить количество"
                          >
                            -
                          </button>
                          <span className="btn btn-outline-primary">
                            {item.count}
                          </span>
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              handleQuantityChange(item.id, item.size, 1)
                            }
                            disabled={loading}
                            aria-label="Увеличить количество"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-total">
                        <span className="cart-item-total-label">Итого:</span>
                        <span className="cart-item-total-value">
                          {formatPrice(item.price * item.count)} руб.
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="cart-total-mobile">
                    <span className="cart-total-mobile-label">
                      Общая стоимость:
                    </span>
                    <span className="cart-total-mobile-value">
                      {formatPrice(cartTotal)} руб.
                    </span>
                  </div>
                </div>
              </>
            )}
          </section>

          {cartItems.length > 0 && (
            <section className="order">
              <h2 className="text-center">Оформить заказ</h2>
              <div
                className="card"
                style={{ maxWidth: '30rem', margin: '0 auto' }}
              >
                <form className="card-body" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="phone">Телефон</label>
                    <input
                      className={`form-control ${
                        formErrors.phone ? 'is-invalid' : ''
                      }`}
                      id="phone"
                      placeholder="+7xxxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={loading}
                    />
                    {formErrors.phone && (
                      <div className="invalid-feedback">{formErrors.phone}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Адрес доставки</label>
                    <input
                      className={`form-control ${
                        formErrors.address ? 'is-invalid' : ''
                      }`}
                      id="address"
                      placeholder="Адрес доставки"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={loading}
                    />
                    {formErrors.address && (
                      <div className="invalid-feedback">
                        {formErrors.address}
                      </div>
                    )}
                  </div>
                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className={`form-check-input ${
                        formErrors.agreement ? 'is-invalid' : ''
                      }`}
                      id="agreement"
                      checked={agreement}
                      onChange={(e) => setAgreement(e.target.checked)}
                      disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="agreement">
                      Согласен с правилами доставки
                    </label>
                    {formErrors.agreement && (
                      <div className="invalid-feedback d-block">
                        {formErrors.agreement}
                      </div>
                    )}
                  </div>
                  {loading ? (
                    <div className="text-center">
                      <Loader />
                    </div>
                  ) : (
                    <button type="submit" className="btn btn-outline-secondary">
                      Оформить
                    </button>
                  )}
                </form>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default Cart;
