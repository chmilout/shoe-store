import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchItem, type ProductItem } from '../utils/api';

interface ProductState {
  product: ProductItem | null;
  loading: boolean;
  error: string | null;
  selectedSize: string | null;
  quantity: number;
}

const initialState: ProductState = {
  product: null,
  loading: false,
  error: null,
  selectedSize: null,
  quantity: 1,
};

export const fetchProductThunk = createAsyncThunk<
  ProductItem,
  number,
  { rejectValue: string }
>('product/fetch', async (id, { rejectWithValue }) => {
  try {
    const data = await fetchItem(id);
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка загрузки товара'
    );
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    setQuantity: (state, action) => {
      const quantity = action.payload;
      if (quantity >= 1 && quantity <= 10) {
        state.quantity = quantity;
      }
    },
    incrementQuantity: (state) => {
      if (state.quantity < 10) {
        state.quantity += 1;
      }
    },
    decrementQuantity: (state) => {
      if (state.quantity > 1) {
        state.quantity -= 1;
      }
    },
    resetProduct: (state) => {
      state.product = null;
      state.selectedSize = null;
      state.quantity = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.selectedSize = null;
        state.quantity = 1;
      })
      .addCase(fetchProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки товара';
      });
  },
});

export const {
  setSelectedSize,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  resetProduct,
} = productSlice.actions;

export const selectProduct = (state: { product: ProductState }) =>
  state.product.product;
export const selectProductLoading = (state: { product: ProductState }) =>
  state.product.loading;
export const selectProductError = (state: { product: ProductState }) =>
  state.product.error;
export const selectSelectedSize = (state: { product: ProductState }) =>
  state.product.selectedSize;
export const selectQuantity = (state: { product: ProductState }) =>
  state.product.quantity;

export const productReducer = productSlice.reducer;

