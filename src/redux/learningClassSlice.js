import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiLearningClass from "../apis/ApiLearningClass.js";

const initialState = {
  ClassLearn: [],
  ClassSurveyList: [],
  TrainingSystemAddress: {},
};

export const getClassLearnByUserID = createAsyncThunk(
  "learningClass/getClassLearnByUserID",
  async (thunkAPI) => {
    const response = await ApiLearningClass.getClassLearnByUserIDApi();
    return response;
  },
);

export const getListByType = createAsyncThunk(
  "learningClass/getListByType",
  async (classTypeID) => {
    const response = await ApiLearningClass.getListByTypeApi(classTypeID);
    return response;
  },
);

export const getTrainingSystemAddressByUserID = createAsyncThunk(
  "learningClass/getTrainingSystemAddressByUserID",
  async (classID) => {
    const response = await ApiLearningClass.getTrainingSystemAddressByUserIDApi(
      classID,
    );
    return response;
  },
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

    // getListByType
    builder
      .addCase(getListByType.pending, (state) => {})
      .addCase(getListByType.fulfilled, (state, action) => {
        if (action.payload) {
          state.ClassSurveyList = action.payload.data || [];
        }
      })
      .addCase(getListByType.rejected, (state, action) => {});

    // getTrainingSystemAddressByUserID
    builder
      .addCase(getTrainingSystemAddressByUserID.pending, (state) => {})
      .addCase(getTrainingSystemAddressByUserID.fulfilled, (state, action) => {
        if (action.payload) {
          state.TrainingSystemAddress = action.payload.data || [];
        }
      })
      .addCase(
        getTrainingSystemAddressByUserID.rejected,
        (state, action) => {},
      );
  },
});

export const { resetLearningClass } = learningClassSlice.actions;
export default learningClassSlice.reducer;
