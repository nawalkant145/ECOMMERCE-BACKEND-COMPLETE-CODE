import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import {
  toggleCreateProductModel,
  toggleUpdateProductModel,
} from "./extraSlice";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    totalProducts: 0,
  },
  reducers: {
    // ✅ Create Product
    createProductRequest(state) {
      state.loading = true;
    },
    createProductSuccess(state, action) {
      state.loading = false;
      state.products = [action.payload, ...state.products];
    },
    createProductFailed(state) {
      state.loading = false;
    },

    // ✅ Get All Products
    getAllProductsRequest(state) {
      state.loading = true;
    },
    getAllProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload.products || [];
      state.totalProducts = action.payload.totalProducts || 0;
    },
    getAllProductsFailed(state) {
      state.loading = false;
    },

    // ✅ Update Product
    updateProductRequest(state) {
      state.loading = true;
    },
    updateProductSuccess(state, action) {
      state.loading = false;
    state.products = state.products.map((product) =>
  product.id === action.payload.id ? action.payload : product
);

    },
    updateProductFailed(state) {
      state.loading = false;
    },

    // ✅ Delete Product
    deleteProductRequest(state) {
      state.loading = true;
    },
    deleteProductSuccess(state, action) {
      state.loading = false;
      state.products = state.products.filter(
  (product) => product.id !== action.payload
);

      state.totalProducts = Math.max(0, state.totalProducts - 1);
    },
    deleteProductFailed(state) {
      state.loading = false;
    },
  },
});

// ✅ CREATE PRODUCT
export const createNewProduct = (data) => async (dispatch) => {
  dispatch(productSlice.actions.createProductRequest());
  await axiosInstance
    .post("/product/admin/create", data)
    .then((res) => {
      dispatch(productSlice.actions.createProductSuccess(res.data.product));
      toast.success(res.data.message || "Product created successfully.");
      dispatch(toggleCreateProductModel());
    })
    .catch((error) => {
      dispatch(productSlice.actions.createProductFailed());
      toast.error(error.response?.data?.message || "Failed to create product.");
    });
};

// ✅ FETCH PRODUCTS
export const fetchAllProducts = (page = 1) => async (dispatch) => {
  dispatch(productSlice.actions.getAllProductsRequest());
  await axiosInstance
    .get(`/product?page=${page}`)
    .then((res) => {
      dispatch(productSlice.actions.getAllProductsSuccess(res.data));
    })
    .catch((error) => {
      dispatch(productSlice.actions.getAllProductsFailed());
      toast.error(error.response?.data?.message || "Failed to fetch products.");
    });
};

// ✅ UPDATE PRODUCT
export const updateProduct = (data, id) => async (dispatch) => {
  dispatch(productSlice.actions.updateProductRequest());
  await axiosInstance
    .put(`/product/admin/update/${id}`, data)
    .then((res) => {
dispatch(productSlice.actions.updateProductSuccess(res.data.updatedProduct));
      toast.success(res.data.message || "Product updated successfully.");
      dispatch(toggleUpdateProductModel());
    })
    .catch((error) => {
      dispatch(productSlice.actions.updateProductFailed());
      toast.error(error.response?.data?.message || "Failed to update product.");
    });
};

// ✅ DELETE PRODUCT
export const deleteProduct = (id,page) => async(dispatch,getState) => {
  dispatch(productSlice.actions.deleteProductRequest());
  await axiosInstance
  .delete(`/product/admin/delete/${id}`)
  .then((res) => {
    dispatch(productSlice.actions.deleteProductSuccess(id));
    toast.success(res.data.message || "Product deleted successfully.");

    const state = getState();
    const updatedTotal = state.product.totalProducts;
    const updateMaxPage = Math.ceil(updatedTotal/10 ) || 1;
    const validPage = Math.min(page ,updateMaxPage);
    dispatch(fetchAllProducts(validPage));

  })
  .catch((error) => {
    dispatch(productSlice.actions.deleteProductFailed());
    toast.error(error.response?.data?.message || "Failed to delete product.");

  });
};


export default productSlice.reducer;
