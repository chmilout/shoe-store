import { type FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import {
  fetchCategoriesThunk,
  selectCategories,
  selectCategoriesLoading,
  setSelectedCategoryId,
  selectSelectedCategoryId,
} from '../../store/catalogSlice';

interface CategoriesProps {
  onCategoryChange?: (categoryId: number | null) => void;
}

export const Categories: FC<CategoriesProps> = ({ onCategoryChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const selectedCategoryId = useSelector(selectSelectedCategoryId);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  if (loading) {
    return null;
  }

  const handleCategoryClick = (categoryId: number | null) => {
    dispatch(setSelectedCategoryId(categoryId));
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <ul className="catalog-categories nav justify-content-center flex-wrap">
      <li className="nav-item">
        <a
          className={`nav-link ${selectedCategoryId === null ? 'active' : ''}`}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleCategoryClick(null);
          }}
        >
          Все
        </a>
      </li>
      {categories.map((category) => (
        <li key={category.id} className="nav-item">
          <a
            className={`nav-link ${
              selectedCategoryId === category.id ? 'active' : ''
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleCategoryClick(category.id);
            }}
          >
            {category.title}
          </a>
        </li>
      ))}
    </ul>
  );
};
