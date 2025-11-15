import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  submitOrder,
  type OrderRequest,
  type OrderResponse,
} from '../utils/api';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  size: string;
  count: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  orderSuccess: boolean;
}

const CART_STORAGE_KEY = 'cart';

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  loading: false,
  error: null,
  orderSuccess: false,
};

export const submitOrderThunk = createAsyncThunk<
  OrderResponse,
  OrderRequest,
  { rejectValue: string }
>('cart/submitOrder', async (orderData, { rejectWithValue }) => {
  try {
    const response = await submitOrder(orderData);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка оформления заказа'
    );
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, 'count'> & { count?: number }>
    ) => {
      const { id, size, count = 1, ...rest } = action.payload;

      const existingItemIndex = state.items.findIndex(
        (item) => item.id === id && item.size === size
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].count += count;
      } else {
        state.items.push({
          ...rest,
          id,
          size,
          count,
        });
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ id: number; size: string }>
    ) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size)
      );
      saveCartToStorage(state.items);
    },

    updateItemCount: (
      state,
      action: PayloadAction<{ id: number; size: string; count: number }>
    ) => {
      const { id, size, count } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size === size
      );
      if (item) {
        if (count <= 0) {
          state.items = state.items.filter(
            (item) => !(item.id === id && item.size === size)
          );
        } else {
          item.count = count;
        }
        saveCartToStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },

    resetOrderStatus: (state) => {
      state.orderSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(submitOrderThunk.fulfilled, (state) => {
        state.loading = false;
        state.orderSuccess = true;
        state.items = [];
        saveCartToStorage(state.items);
      })
      .addCase(submitOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка оформления заказа';
        state.orderSuccess = false;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateItemCount,
  clearCart,
  resetOrderStatus,
} = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartItemsCount = (state: { cart: CartState }) =>
  state.cart.items.length;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.price * item.count, 0);
export const selectCartLoading = (state: { cart: CartState }) =>
  state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectOrderSuccess = (state: { cart: CartState }) =>
  state.cart.orderSuccess;

export default cartSlice.reducer;
