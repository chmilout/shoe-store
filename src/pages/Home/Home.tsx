function Home() {
  return (
    <main className="container">
      <div className="row">
        <div className="col">
          <div className="banner">
            <img src="/img/banner.jpg" className="img-fluid" alt="К весне готовы!" />
            <h2 className="banner-header">К весне готовы!</h2>
          </div>
          <section className="top-sales">
            <h2 className="text-center">Хиты продаж!</h2>
            <p className="text-center">Скоро здесь будут хиты продаж</p>
          </section>
          <section className="catalog">
            <h2 className="text-center">Каталог</h2>
            <p className="text-center">Скоро здесь будет каталог</p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Home;

