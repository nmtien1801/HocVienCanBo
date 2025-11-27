import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiSchedule from "../apis/ApiSchedule.js";

const initialState = {
  scheduleSlice: [],
  totalSchedule: 0,
  scheduleSubjectMonth: [],
  totalScheduleSubjectMonth: 0,
  subjectLearnAll: []
};

export const getScheduleMonth = createAsyncThunk(
  "schedule/getScheduleMonthApi",
  async ({ startDate, endDate, page, limit }, thunkAPI) => {
    const response = await ApiSchedule.getScheduleMonthApi(
      startDate,
      endDate,
      page,
      limit
    );
    return response;
  }
);

export const getScheduleSubjectMonth = createAsyncThunk(
  "schedule/getScheduleSubjectMonth",
  async ({ startDate, endDate, subjectID, page, limit }, thunkAPI) => {
    const response = await ApiSchedule.getScheduleSubjectMonthApi(
      startDate,
      endDate,
      subjectID,
      page,
      limit
    );
    return response;
  }
);

export const getSubjectLearnAll = createAsyncThunk(
  "schedule/getSubjectLearnAll",
  async (thunkAPI) => {
    const response = await ApiSchedule.getSubjectLearnAllApi();
    return response;
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // getScheduleMonth
    builder
      .addCase(getScheduleMonth.pending, (state) => {})
      .addCase(getScheduleMonth.fulfilled, (state, action) => {
        if (action.payload) {
          state.scheduleSlice = action.payload.data || [];
          state.totalSchedule = action.payload.totals || 0;
        }
      })
      .addCase(getScheduleMonth.rejected, (state, action) => {});

    // getScheduleSubjectMonth
    builder
      .addCase(getScheduleSubjectMonth.pending, (state) => {})
      .addCase(getScheduleSubjectMonth.fulfilled, (state, action) => {
        if (action.payload) {
          state.scheduleSubjectMonth = action.payload.data || [];
          state.totalScheduleSubjectMonth = action.payload.totals || 0;
        }
      })
      .addCase(getScheduleSubjectMonth.rejected, (state, action) => {});

    // getSubjectLearnAll
    builder
      .addCase(getSubjectLearnAll.pending, (state) => {})
      .addCase(getSubjectLearnAll.fulfilled, (state, action) => {
        if (action.payload) {
          state.subjectLearnAll = action.payload.data || [];
        }
      })
      .addCase(getSubjectLearnAll.rejected, (state, action) => {});
  },
});

// Export actions
export const {} = scheduleSlice.actions;

// Export reducer
export default scheduleSlice.reducer;
