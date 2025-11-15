import { type FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import {
  fetchProductThunk,
  selectProduct,
  selectProductLoading,
  selectProductError,
  selectSelectedSize,
  selectQuantity,
  setSelectedSize,
  incrementQuantity,
  decrementQuantity,
  resetProduct,
} from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';
import { Loader } from '../../components/Loader';

export const Product: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const product = useSelector(selectProduct);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const selectedSize = useSelector(selectSelectedSize);
  const quantity = useSelector(selectQuantity);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductThunk(Number(id)));
    }
    return () => {
      dispatch(resetProduct());
    };
  }, [dispatch, id]);

  const handleSizeClick = (size: string) => {
    dispatch(setSelectedSize(size));
  };

  const handleQuantityChange = (delta: number) => {
    if (delta > 0) {
      dispatch(incrementQuantity());
    } else {
      dispatch(decrementQuantity());
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        size: selectedSize,
        image: product.images[0] || '/img/products/placeholder.jpg',
        count: quantity,
      })
    );

    navigate('/cart');
  };

  if (loading) {
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
            <section className="catalog-item">
              <Loader />
            </section>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
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
            <section className="catalog-item">
              <p className="text-center text-danger">
                {error || 'Товар не найден'}
              </p>
            </section>
          </div>
        </div>
      </main>
    );
  }

  const availableSizes = product.sizes.filter((size) => size.available);
  const hasAvailableSizes = availableSizes.length > 0;

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
          <section className="catalog-item">
            <h2 className="text-center">{product.title}</h2>
            <div className="row">
              <div className="col-5">
                <img
                  src={product.images[0] || '/img/products/placeholder.jpg'}
                  className="img-fluid"
                  alt={product.title}
                />
              </div>
              <div className="col-7">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td>Артикул</td>
                      <td>{product.sku || ''}</td>
                    </tr>
                    <tr>
                      <td>Производитель</td>
                      <td>{product.manufacturer || ''}</td>
                    </tr>
                    <tr>
                      <td>Цвет</td>
                      <td>{product.color || ''}</td>
                    </tr>
                    <tr>
                      <td>Материалы</td>
                      <td>{product.material || ''}</td>
                    </tr>
                    <tr>
                      <td>Сезон</td>
                      <td>{product.season || ''}</td>
                    </tr>
                    <tr>
                      <td>Повод</td>
                      <td>{product.reason || ''}</td>
                    </tr>
                  </tbody>
                </table>
                {hasAvailableSizes && (
                  <>
                    <div className="text-center">
                      <p>
                        Размеры в наличии:{' '}
                        {availableSizes.map((sizeObj) => (
                          <span
                            key={sizeObj.size}
                            className={`catalog-item-size ${
                              selectedSize === sizeObj.size ? 'selected' : ''
                            }`}
                            onClick={() => handleSizeClick(sizeObj.size)}
                            style={{ cursor: 'pointer' }}
                          >
                            {sizeObj.size}
                          </span>
                        ))}
                      </p>
                      <p>
                        Количество:{' '}
                        <span className="btn-group btn-group-sm pl-2">
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span className="btn btn-outline-primary">
                            {quantity}
                          </span>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= 10}
                          >
                            +
                          </button>
                        </span>
                      </p>
                    </div>
                    <button
                      className="btn btn-danger btn-block btn-lg"
                      onClick={handleAddToCart}
                      disabled={!selectedSize}
                    >
                      В корзину
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
