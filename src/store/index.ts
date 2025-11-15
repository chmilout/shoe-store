import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './cartSlice';
import { topSalesReducer } from './topSalesSlice';
import { catalogReducer } from './catalogSlice';
import { productReducer } from './productSlice';
import { uiReducer } from './uiSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    topSales: topSalesReducer,
    catalog: catalogReducer,
    product: productReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
