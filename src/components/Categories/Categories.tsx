import { useEffect, useState } from 'react';
import { fetchCategories, type Category } from '../../utils/api';
import './Categories.css';

interface CategoriesProps {
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

function Categories({ selectedCategoryId, onCategoryChange }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return null;
  }

  const handleCategoryClick = (categoryId: number | null) => {
    onCategoryChange(categoryId);
  };

  return (
    <ul className="catalog-categories nav justify-content-center">
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
}

export default Categories;

