// câu hỏi
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiCriteriaEvaluation from "../apis/ApiCriteriaEvaluation.js";

const initialState = {
  CriteriaEvaluationList: [],
  CriteriaEvaluationTotal: 0,
  CriteriaEvaluationActive: []
};

export const getCriteriaEvaluation = createAsyncThunk(
  "criteriaEvaluations/getCriteriaEvaluation",
  async ({ key, TypeCriteria, statusID, page, limit }, thunkAPI) => {
    const response = await ApiCriteriaEvaluation.getCriteriaEvaluationApi(
      key,
      TypeCriteria,
      statusID,
      page,
      limit
    );
    return response.data;
  }
);

export const getCriteriaEvaluationActive = createAsyncThunk(
  "criteriaEvaluations/getCriteriaEvaluationActive",
  async (thunkAPI) => {
    const response =
      await ApiCriteriaEvaluation.getCriteriaEvaluationActiveApi();
    return response;
  }
);

const CriteriaEvaluationSlice = createSlice({
  name: "criteriaEvaluations",
  initialState,

  reducers: {
    resetCriteriaEvaluation: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // getCriteriaEvaluation
    builder
      .addCase(getCriteriaEvaluation.pending, (state) => {})
      .addCase(getCriteriaEvaluation.fulfilled, (state, action) => {
        state.CriteriaEvaluationList = action.payload.data || [];
        state.CriteriaEvaluationTotal = action.payload.totals || 0;
      })
      .addCase(getCriteriaEvaluation.rejected, (state, action) => {});

    // getCriteriaEvaluationActive
    builder
      .addCase(getCriteriaEvaluationActive.pending, (state) => {})
      .addCase(getCriteriaEvaluationActive.fulfilled, (state, action) => {
        state.CriteriaEvaluationActive = action.payload.data || [];
      })
      .addCase(getCriteriaEvaluationActive.rejected, (state, action) => {});
  },
});

// Export actions
export const { resetCriteriaEvaluation } = CriteriaEvaluationSlice.actions;

// Export reducer
export default CriteriaEvaluationSlice.reducer;
