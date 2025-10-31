import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiAuth from "../apis/ApiAuth.js";

const initialState = {
  userInfo: {},
};

export const Login = createAsyncThunk(
  "auth/Login",
  async ({ user }, thunkAPI) => {
    const response = await ApiAuth.LoginApi(user);
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(Login.pending, (state) => {})
      .addCase(Login.fulfilled, (state, action) => {
        // if (action.payload.EC === 0) {
        //   state.userInfo = action.payload.DT || {};
        // }
      })
      .addCase(Login.rejected, (state, action) => {});
  },
});

// Export actions
export const {} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
