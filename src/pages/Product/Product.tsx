import { useParams } from 'react-router';

function Product() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="container">
      <div className="row">
        <div className="col">
          <div className="banner">
            <img src="/img/banner.jpg" className="img-fluid" alt="К весне готовы!" />
            <h2 className="banner-header">К весне готовы!</h2>
          </div>
          <section className="top-sales">
            <h2 className="text-center">Страница товара</h2>
            <p className="text-center">Скоро здесь будет информация о товаре с ID: {id}</p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Product;

