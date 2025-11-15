import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { fetchItem, type ProductItem } from '../../utils/api';
import Loader from '../../components/Loader/Loader';
import './Product.css';

function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('ID товара не указан');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchItem(Number(id));
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки товара');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (newQuantity > 10) return 10;
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    // TODO: Добавить товар в корзину (будет реализовано позже)
    // Пока просто переходим на страницу корзины
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
}

export default Product;
