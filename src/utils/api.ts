const API_URL = import.meta.env.VITE_API_URL;

export interface TopSaleItem {
  id: number;
  title: string;
  price: number;
  images: string[];
}

export interface Category {
  id: number;
  title: string;
}

export interface CatalogItem {
  id: number;
  title: string;
  price: number;
  images: string[];
}

export interface ProductSize {
  size: string;
  available: boolean;
}

export interface ProductItem {
  id: number;
  category: number;
  title: string;
  images: string[];
  sku: string;
  manufacturer: string;
  color: string;
  material: string;
  reason: string;
  season: string;
  heelSize?: string;
  price: number;
  oldPrice?: number;
  sizes: ProductSize[];
}

export async function fetchTopSales(): Promise<TopSaleItem[]> {
  const response = await fetch(`${API_URL}/api/top-sales`);
  if (!response.ok) {
    throw new Error('Failed to fetch top sales');
  }
  return response.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/api/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function fetchItems(params?: {
  categoryId?: number;
  offset?: number;
  q?: string;
}): Promise<CatalogItem[]> {
  const queryParams = new URLSearchParams();

  if (params?.categoryId !== undefined) {
    queryParams.append('categoryId', params.categoryId.toString());
  }
  if (params?.offset !== undefined) {
    queryParams.append('offset', params.offset.toString());
  }
  if (params?.q) {
    queryParams.append('q', params.q);
  }

  const url = `${API_URL}/api/items${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}

export async function fetchItem(id: number): Promise<ProductItem> {
  const response = await fetch(`${API_URL}/api/items/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Товар не найден');
    }
    throw new Error('Failed to fetch item');
  }
  return response.json();
}
