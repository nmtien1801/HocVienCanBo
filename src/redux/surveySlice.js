import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiSurvey from "../apis/ApiSurvey.js";

const initialState = {
  SurveysByStudentList: [],
  SurveysByStudentTotal: 0,
};

export const getSurveySubjectByStudentID = createAsyncThunk(
  "survey/getSurveySubjectByStudentID",
  async ({ page, limit }, thunkAPI) => {
    const response = await ApiSurvey.getSurveySubjectByStudentIDApi(
      page,
      limit
    );
    return response.data;
  }
);

const surveySlice = createSlice({
  name: "survey",
  initialState,

  reducers: {
    resetSurvey: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // getSurveySubjectByStudentID
    builder
      .addCase(getSurveySubjectByStudentID.pending, (state) => {})
      .addCase(getSurveySubjectByStudentID.fulfilled, (state, action) => {
        state.SurveysByStudentList = action.payload.data || [];
        state.SurveysByStudentTotal = action.payload.totals || 0;
      })
      .addCase(getSurveySubjectByStudentID.rejected, (state, action) => {});
  },
});

// Export actions
export const { resetSurvey } = surveySlice.actions;

// Export reducer
export default surveySlice.reducer;
