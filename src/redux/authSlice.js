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
    let user = JSON.parse(localStorage.getItem("fr"));
    return user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {},

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
          localStorage.setItem("fr", JSON.stringify(action.payload.data));
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
        if (action.payload) {
          state.userInfo = action.payload || null;
        }
        state.isLoading = false;
        state.hasCheckedAuth = true;
      })
      .addCase(GetAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.hasCheckedAuth = true;
      });
  },
});

// Export actions
export const {} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
