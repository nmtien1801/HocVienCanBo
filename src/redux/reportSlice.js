import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiReport from "../apis/ApiReport.js";

const initialState = {
  EvaluationList: [],
  SurveyReportList: [],
  SurveyReportTotal: 0,
  ReportOtherList: [],
  ReportOtherTotal: 0,
  EvaluationOtherList: [],
  TemplateTrackingTeacherList: [],
  TrackingOrderList: [],
  TrackingOrderTotal: 0,
  EvaluationOrderList: [],
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

export const getReportTrackingOrder = createAsyncThunk(
  "report/getReportTrackingOrder",
  async ({ templateSurveyID, page, limit }, thunkAPI) => {
    const response = await ApiReport.getReportTrackingOrderApi(
      templateSurveyID,
      page,
      limit
    );
    return response;
  }
);

export const getReportTrackingOther = createAsyncThunk(
  "report/getReportTrackingOther",
  async ({ page, limit }, thunkAPI) => {
    const response = await ApiReport.getReportTrackingOtherApi(page, limit);

    return response.data;
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
      .addCase(getReportTrackingTeacher.pending, (state) => {
        state.SurveyReportList = [];
        state.SurveyReportTotal = 0;
      })
      .addCase(getReportTrackingTeacher.fulfilled, (state, action) => {
        state.EvaluationList = action.payload?.data?.lstEvalution || [];
        state.SurveyReportList = action.payload?.data?.data || [];
        state.SurveyReportTotal = action.payload?.data?.totals || 0;
      })
      .addCase(getReportTrackingTeacher.rejected, (state, action) => {});

    // getTemplateTrackingTeacher
    builder
      .addCase(getTemplateTrackingTeacher.pending, (state) => {})
      .addCase(getTemplateTrackingTeacher.fulfilled, (state, action) => {
        state.TemplateTrackingTeacherList = action.payload.data || [];
      })
      .addCase(getTemplateTrackingTeacher.rejected, (state, action) => {});

    // getReportTrackingOther
    builder
      .addCase(getReportTrackingOther.pending, (state) => {
        state.ReportOtherList = [];
        state.ReportOtherTotal = 0;
      })
      .addCase(getReportTrackingOther.fulfilled, (state, action) => {
        // state.EvaluationOtherList = action.payload.lstEvalution || [];
        state.ReportOtherList = action.payload.data || [];
        state.ReportOtherTotal = action.payload.totals || 0;
      })
      .addCase(getReportTrackingOther.rejected, (state, action) => {});

    // getReportTrackingOrder
    builder
      .addCase(getReportTrackingOrder.pending, (state) => {
        state.TrackingOrderList = [];
        state.TrackingOrderTotal = 0;
      })
      .addCase(getReportTrackingOrder.fulfilled, (state, action) => {
        state.EvaluationOrderList = action.payload?.data?.lstEvalution || [];
        state.TrackingOrderList = action.payload?.data?.data || [];
        state.TrackingOrderTotal = action.payload?.data?.totals || 0;
      })
      .addCase(getReportTrackingOrder.rejected, (state, action) => {});
  },
});

// Export actions
export const { resetReport } = reportSlice.actions;

// Export reducer
export default reportSlice.reducer;
