import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiLearningClass from "../apis/ApiLearningClass.js";

const initialState = {
  ClassLearn: []
};

export const getClassLearnByUserID = createAsyncThunk(
  "learningClass/getClassLearnByUserID",
  async (thunkAPI) => {
    const response = await ApiLearningClass.getClassLearnByUserIDApi();
    return response;
  }
);

const learningClassSlice = createSlice({
  name: "learningClass",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // getClassLearnByUserID
    builder
      .addCase(getClassLearnByUserID.pending, (state) => {})
      .addCase(getClassLearnByUserID.fulfilled, (state, action) => {
        if (action.payload) {
          state.ClassLearn = action.payload.data || [];
        }
      })
      .addCase(getClassLearnByUserID.rejected, (state, action) => {});
  },
});

// Export actions
export const {} = learningClassSlice.actions;

// Export reducer
export default learningClassSlice.reducer;
