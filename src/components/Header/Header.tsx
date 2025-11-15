import { Link, useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItemsCount } from '../../store/cartSlice';
import {
  selectIsSearchOpen,
  selectIsMenuOpen,
  selectHeaderSearchQuery,
  toggleSearch,
  closeSearch,
  setHeaderSearchQuery,
  clearHeaderSearchQuery,
  toggleMenu,
} from '../../store/uiSlice';
import './Header.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemsCount = useSelector(selectCartItemsCount);
  const isSearchOpen = useSelector(selectIsSearchOpen);
  const isMenuOpen = useSelector(selectIsMenuOpen);
  const searchQuery = useSelector(selectHeaderSearchQuery);

  const handleSearchClick = () => {
    if (isSearchOpen && searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
      dispatch(closeSearch());
      dispatch(clearHeaderSearchQuery());
    } else {
      dispatch(toggleSearch());
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
      dispatch(closeSearch());
      dispatch(clearHeaderSearchQuery());
    } else {
      dispatch(closeSearch());
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
              onClick={() => dispatch(toggleMenu())}
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
                    onChange={(e) => dispatch(setHeaderSearchQuery(e.target.value))}
                    onBlur={() => {
                      if (!searchQuery.trim()) {
                        dispatch(closeSearch());
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
