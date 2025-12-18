import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiTeacher from "../apis/ApiTeacher.js";

const initialState = {
  teacherList: [],
};

export const getAllTeacher = createAsyncThunk(
  "teacher/getAllTeacher",
  async (thunkAPI) => {
    const response = await ApiTeacher.getAllTeacherApi();
    return response;
  }
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState,

  reducers: {
    resetTeacher: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // getAllTeacher
    builder
      .addCase(getAllTeacher.pending, (state) => {})
      .addCase(getAllTeacher.fulfilled, (state, action) => {
        state.teacherList = action.payload.data || [];
      })
      .addCase(getAllTeacher.rejected, (state, action) => {});
  },
});

// Export actions
export const { resetTeacher } = teacherSlice.actions;

// Export reducer
export default teacherSlice.reducer;
