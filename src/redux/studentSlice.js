import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiStudent from "../apis/ApiStudent.js";

const initialState = {};

const studentSlice = createSlice({
  name: "student",
  initialState,

  reducers: {},

  extraReducers: (builder) => {},
});

// Export actions
export const {} = studentSlice.actions;

// Export reducer
export default studentSlice.reducer;
