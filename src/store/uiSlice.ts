import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  headerSearchQuery: string;
}

const initialState: UiState = {
  isSearchOpen: false,
  isMenuOpen: false,
  headerSearchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
    setHeaderSearchQuery: (state, action) => {
      state.headerSearchQuery = action.payload;
    },
    clearHeaderSearchQuery: (state) => {
      state.headerSearchQuery = '';
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
  },
});

export const {
  toggleSearch,
  closeSearch,
  setHeaderSearchQuery,
  clearHeaderSearchQuery,
  toggleMenu,
  closeMenu,
} = uiSlice.actions;

export const selectIsSearchOpen = (state: { ui: UiState }) =>
  state.ui.isSearchOpen;
export const selectIsMenuOpen = (state: { ui: UiState }) => state.ui.isMenuOpen;
export const selectHeaderSearchQuery = (state: { ui: UiState }) =>
  state.ui.headerSearchQuery;

export const uiReducer = uiSlice.reducer;

