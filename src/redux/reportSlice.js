import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiReport from "../apis/ApiReport.js";

const initialState = {
  SurveyReportList: [],
  SurveyReportTotal: 0,
};

export const getReportTrackingTeacher = createAsyncThunk(
  "report/getReportTrackingTeacher",
  async ({ templateSurveyID, teacherID, subjectID, page, limit }, thunkAPI) => {
    const response = await ApiReport.getReportTrackingTeacherApi(
      templateSurveyID,
      teacherID,
      subjectID,
      page,
      limit
    );
    return response.data;
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,

  reducers: {
    resetReport: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // getReportTrackingTeacher
    builder
      .addCase(getReportTrackingTeacher.pending, (state) => {})
      .addCase(getReportTrackingTeacher.fulfilled, (state, action) => {
        state.SurveyReportList = action.payload.data || [];
        state.SurveyReportTotal = action.payload.totals || 0;
      })
      .addCase(getReportTrackingTeacher.rejected, (state, action) => {});
  },
});

// Export actions
export const { resetReport } = reportSlice.actions;

// Export reducer
export default reportSlice.reducer;
