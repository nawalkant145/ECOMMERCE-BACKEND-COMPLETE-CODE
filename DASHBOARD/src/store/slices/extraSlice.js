import { createSlice } from "@reduxjs/toolkit";

const extraSlice = createSlice({
  name: "extra",
  initialState: {
    openedComponent: "Dashboard",
    isNavbarOpened: false,
    isViewProductModalOpened: false,
    isCreateProductModalOpened: false,
    isUpdateProductModalOpened: false,
  },
  reducers: {
    toggleComponent: (state, action) => {
      state.openedComponent = action.payload;
    },
    toggleNavbar: (state) => {
      state.isNavbarOpened = !state.isNavbarOpened;
    },
    toggleCreateProductModel: (state) => {
      state.isCreateProductModalOpened = !state.isCreateProductModalOpened;
    },
    toggleViewProductModel: (state) => {
      state.isViewProductModalOpened = !state.isViewProductModalOpened;
    },
    toggleUpdateProductModel: (state) => {
      state.isUpdateProductModalOpened = !state.isUpdateProductModalOpened;
    },
  },
});

export const {
  toggleComponent,
  toggleCreateProductModel,
  toggleNavbar,
  toggleUpdateProductModel,
  toggleViewProductModel,
  
} = extraSlice.actions;

export default extraSlice.reducer;
