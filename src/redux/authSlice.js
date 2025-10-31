import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
  },

  extraReducers: (builder) => {
    
  },
});

// Export actions
export const { } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
