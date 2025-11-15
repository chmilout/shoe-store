import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { selectCartItemsCount } from '../../store/cartSlice';
import './Header.css';

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemsCount = useSelector(selectCartItemsCount);

  const handleSearchClick = () => {
    if (isSearchOpen && searchQuery.trim()) {
      // Если поиск открыт и есть текст, перенаправляем на каталог
      navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    } else {
      // Иначе просто открываем/закрываем поиск
      setIsSearchOpen(!isSearchOpen);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    } else {
      setIsSearchOpen(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="container">
      <div className="row">
        <div className="col">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
              <img src="/img/header-logo.png" alt="Bosa Noga" />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-controls="navbarMain"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
              id="navbarMain"
            >
              <ul className="navbar-nav mr-auto">
                <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                  <Link className="nav-link" to="/">
                    Главная
                  </Link>
                </li>
                <li
                  className={`nav-item ${isActive('/catalog') ? 'active' : ''}`}
                >
                  <Link className="nav-link" to="/catalog">
                    Каталог
                  </Link>
                </li>
                <li
                  className={`nav-item ${isActive('/about') ? 'active' : ''}`}
                >
                  <Link className="nav-link" to="/about">
                    О магазине
                  </Link>
                </li>
                <li
                  className={`nav-item ${
                    isActive('/contacts') ? 'active' : ''
                  }`}
                >
                  <Link className="nav-link" to="/contacts">
                    Контакты
                  </Link>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                <div className="header-controls-pics">
                  <div
                    data-id="search-expander"
                    className="header-controls-pic header-controls-search"
                    onClick={handleSearchClick}
                  ></div>
                  <Link
                    to="/cart"
                    className="header-controls-pic header-controls-cart"
                  >
                    {cartItemsCount > 0 && (
                      <div className="header-controls-cart-full">
                        {cartItemsCount}
                      </div>
                    )}
                    <div className="header-controls-cart-menu"></div>
                  </Link>
                </div>
                <form
                  data-id="search-form"
                  className={`header-controls-search-form form-inline ${
                    isSearchOpen ? '' : 'invisible'
                  }`}
                  onSubmit={handleSearchSubmit}
                >
                  <input
                    className="form-control"
                    placeholder="Поиск"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery.trim()) {
                        setIsSearchOpen(false);
                      }
                    }}
                    autoFocus={isSearchOpen}
                  />
                </form>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
