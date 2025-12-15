// câu hỏi
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiTemplateSurveys from "../apis/ApiTemplateSurveys.js";

const initialState = {
  TemplateSurveysList: [],
  TemplateSurveysTotal: 0,
  TemplateSurveysOtherList: [],
  TemplateSurveysOtherTotal: 0,
  TemplateSurveysActive: [],
};

export const getTemplateSurvey = createAsyncThunk(
  "templateSurveys/getTemplateSurvey",
  async ({ key, typeTemplate, statusID, page, limit }, thunkAPI) => {
    const response = await ApiTemplateSurveys.getTemplateSurveyApi(
      key,
      typeTemplate,
      statusID,
      page,
      limit
    );
    return response.data;
  }
);

export const getTemplateSurveyActive = createAsyncThunk(
  "templateSurveys/getTemplateSurveyActive",
  async (thunkAPI) => {
    const response = await ApiTemplateSurveys.getTemplateSurveyActiveApi();
    return response;
  }
);

const TemplateSurveysSlice = createSlice({
  name: "templateSurveys",
  initialState,

  reducers: {
    resetTemplateSurveys: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // getTemplateSurvey
    builder
      .addCase(getTemplateSurvey.pending, (state) => {})
      .addCase(getTemplateSurvey.fulfilled, (state, action) => {
        const { typeTemplate } = action.meta.arg;
        if (typeTemplate === 1) {
          // Phiếu giảng viên khảo sát
          state.TemplateSurveysList = action.payload.data || [];
          state.TemplateSurveysTotal = action.payload.totals || 0;
        } else if (typeTemplate === 2) {
          // Phiếu khảo sát khác
          state.TemplateSurveysOtherList = action.payload.data || [];
          state.TemplateSurveysOtherTotal = action.payload.totals || 0;
        }
      })
      .addCase(getTemplateSurvey.rejected, (state, action) => {});

    // getTemplateSurveyActive
    builder
      .addCase(getTemplateSurveyActive.pending, (state) => {})
      .addCase(getTemplateSurveyActive.fulfilled, (state, action) => {
        state.TemplateSurveysActive = action.payload.data || [];
      })
      .addCase(getTemplateSurveyActive.rejected, (state, action) => {});
  },
});

// Export actions
export const { resetTemplateSurveys } = TemplateSurveysSlice.actions;

// Export reducer
export default TemplateSurveysSlice.reducer;
