import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTopSales, type TopSaleItem } from '../utils/api';

interface TopSalesState {
  items: TopSaleItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TopSalesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTopSalesThunk = createAsyncThunk<
  TopSaleItem[],
  void,
  { rejectValue: string }
>('topSales/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchTopSales();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка загрузки'
    );
  }
});

const topSalesSlice = createSlice({
  name: 'topSales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopSalesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSalesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTopSalesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки';
      });
  },
});

export const selectTopSalesItems = (state: { topSales: TopSalesState }) =>
  state.topSales.items;
export const selectTopSalesLoading = (state: { topSales: TopSalesState }) =>
  state.topSales.loading;
export const selectTopSalesError = (state: { topSales: TopSalesState }) =>
  state.topSales.error;

export const topSalesReducer = topSalesSlice.reducer;

