import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiAuth from "../apis/ApiAuth.js";

const initialState = {
  userInfo: {},
  isLoading: false,
  hasCheckedAuth: false,
};

export const Login = createAsyncThunk("auth/Login", async (data, thunkAPI) => {
  const response = await ApiAuth.LoginApi(data);
  return response;
});

export const GetAccount = createAsyncThunk(
  "auth/GetAccount",
  async (thunkAPI) => {
    const userString = sessionStorage.getItem("fr");
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.isLoading = false;
      state.hasCheckedAuth = false;
    },
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(Login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.userInfo = action.payload.data || {};
          sessionStorage.setItem("fr", JSON.stringify(action.payload.data));
        }
      })
      .addCase(Login.rejected, (state, action) => {
        state.isLoading = false;
      });

    // GetAccount
    builder
      .addCase(GetAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAccount.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isLoading = false;
        state.hasCheckedAuth = true;
      })
      .addCase(GetAccount.rejected, (state, action) => {
        state.userInfo = null;
        state.isLoading = false;
        state.hasCheckedAuth = true;
        sessionStorage.removeItem("fr");
      });
  },
});

// Export actions
export const { logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
