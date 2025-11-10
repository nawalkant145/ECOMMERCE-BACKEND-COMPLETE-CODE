import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ✅ FETCH ALL ORDERS
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/order/admin/getall");
      return data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// ✅ UPDATE ORDER STATUS
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(
        `/order/admin/update/${orderId}`,
        { status }
      );
      toast.success(data.message || "Order status updated successfully");
      return data.updatedOrder || data.order || {};
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order status."
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order status."
      );
    }
  }
);

// ✅ DELETE ORDER
export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(
        `/order/admin/delete/${orderId}`
      );
      toast.success(data.message || "Order deleted successfully");
      return orderId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order.");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete order."
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    orders: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ FETCH ALL ORDERS
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ UPDATE ORDER STATUS
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ DELETE ORDER
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
