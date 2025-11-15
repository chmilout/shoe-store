import { type FC } from 'react';

interface CatalogSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const CatalogSearch: FC<CatalogSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  return (
    <form className="catalog-search-form" onSubmit={handleSubmit}>
      <input
        className="form-control"
        type="text"
        placeholder="Поиск"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </form>
  );
};
