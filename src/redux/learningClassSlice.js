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
  initialState: initialState,
  reducers: {
    resetLearningClass: (state) => {
      return initialState;
    },
  },

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

export const { resetLearningClass } = learningClassSlice.actions;
export default learningClassSlice.reducer;
