import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiReport from "../apis/ApiReport.js";

const initialState = {
  EvaluationList: [],
  SurveyReportList: [],
  SurveyReportTotal: 0,
  TemplateTrackingTeacherList: [],
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
    return response;
  }
);

export const getTemplateTrackingTeacher = createAsyncThunk(
  "report/getTemplateTrackingTeacher",
  async ({ typeTemplate }, thunkAPI) => {
    const response = await ApiReport.getTemplateTrackingTeacherApi(
      typeTemplate
    );
    return response;
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
        state.EvaluationList = action.payload.data.lstEvalution || [];
        state.SurveyReportList = action.payload.data.data || [];
        state.SurveyReportTotal = action.payload.totals || 0;
      })
      .addCase(getReportTrackingTeacher.rejected, (state, action) => {});

    // getTemplateTrackingTeacher
    builder
      .addCase(getTemplateTrackingTeacher.pending, (state) => {})
      .addCase(getTemplateTrackingTeacher.fulfilled, (state, action) => {
        state.TemplateTrackingTeacherList = action.payload.data || [];
      })
      .addCase(getTemplateTrackingTeacher.rejected, (state, action) => {});
  },
});

// Export actions
export const { resetReport } = reportSlice.actions;

// Export reducer
export default reportSlice.reducer;
