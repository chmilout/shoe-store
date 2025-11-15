import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCategories,
  fetchItems,
  type Category,
  type CatalogItem,
} from '../utils/api';

interface CatalogState {
  categories: Category[];
  categoriesLoading: boolean;
  items: CatalogItem[];
  itemsLoading: boolean;
  itemsLoadingMore: boolean;
  error: string | null;
  selectedCategoryId: number | null;
  searchQuery: string;
  offset: number;
  hasMore: boolean;
}

const ITEMS_PER_PAGE = 6;

const initialState: CatalogState = {
  categories: [],
  categoriesLoading: false,
  items: [],
  itemsLoading: false,
  itemsLoadingMore: false,
  error: null,
  selectedCategoryId: null,
  searchQuery: '',
  offset: 0,
  hasMore: true,
};

export const fetchCategoriesThunk = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>('catalog/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchCategories();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка загрузки категорий'
    );
  }
});

export const fetchItemsThunk = createAsyncThunk<
  CatalogItem[],
  { categoryId?: number; offset?: number; q?: string; append?: boolean },
  { rejectValue: string }
>(
  'catalog/fetchItems',
  async ({ categoryId, offset = 0, q }, { rejectWithValue }) => {
    try {
      const data = await fetchItems({
        categoryId,
        offset,
        q,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки товаров'
      );
    }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setSelectedCategoryId: (state, action) => {
      state.selectedCategoryId = action.payload;
      state.offset = 0;
      state.hasMore = true;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetItems: (state) => {
      state.items = [];
      state.offset = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesThunk.rejected, (state) => {
        state.categoriesLoading = false;
      })
      .addCase(fetchItemsThunk.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.itemsLoadingMore = true;
        } else {
          state.itemsLoading = true;
          state.error = null;
        }
      })
      .addCase(fetchItemsThunk.fulfilled, (state, action) => {
        const { append } = action.meta.arg;
        const data = action.payload;

        if (append) {
          state.items = [...state.items, ...data];
          state.itemsLoadingMore = false;
        } else {
          state.items = data;
          state.itemsLoading = false;
          state.offset = 0;
        }

        state.hasMore = data.length === ITEMS_PER_PAGE;
        if (append) {
          state.offset += ITEMS_PER_PAGE;
        }
      })
      .addCase(fetchItemsThunk.rejected, (state, action) => {
        state.itemsLoading = false;
        state.itemsLoadingMore = false;
        state.error = action.payload || 'Ошибка загрузки';
      });
  },
});

export const { setSelectedCategoryId, setSearchQuery, resetItems } =
  catalogSlice.actions;

export const selectCategories = (state: { catalog: CatalogState }) =>
  state.catalog.categories;
export const selectCategoriesLoading = (state: { catalog: CatalogState }) =>
  state.catalog.categoriesLoading;
export const selectCatalogItems = (state: { catalog: CatalogState }) =>
  state.catalog.items;
export const selectCatalogItemsLoading = (state: { catalog: CatalogState }) =>
  state.catalog.itemsLoading;
export const selectCatalogItemsLoadingMore = (state: {
  catalog: CatalogState;
}) => state.catalog.itemsLoadingMore;
export const selectCatalogError = (state: { catalog: CatalogState }) =>
  state.catalog.error;
export const selectSelectedCategoryId = (state: { catalog: CatalogState }) =>
  state.catalog.selectedCategoryId;
export const selectSearchQuery = (state: { catalog: CatalogState }) =>
  state.catalog.searchQuery;
export const selectHasMore = (state: { catalog: CatalogState }) =>
  state.catalog.hasMore;

export const catalogReducer = catalogSlice.reducer;
