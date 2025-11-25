import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiDashboard from "../apis/ApiDashboard.js";

const initialState = {
  dashboardTotal: [],
  scheduleByMonth: [],
};

export const DashboardTotal = createAsyncThunk(
  "dashboard/DashboardTotal",
  async (thunkAPI) => {
    const response = await ApiDashboard.DashboardTotalApi();
    return response;
  }
);

export const ScheduleByMonth = createAsyncThunk(
  "dashboard/ScheduleByMonth",
  async (thunkAPI) => {
    const response = await ApiDashboard.ScheduleByMonthApi();
    return response;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // DashboardTotal
    builder
      .addCase(DashboardTotal.pending, (state) => {})
      .addCase(DashboardTotal.fulfilled, (state, action) => {
        if (action.payload) {
          state.dashboardTotal = action.payload || [];
        }
      })
      .addCase(DashboardTotal.rejected, (state, action) => {});

    // ScheduleByMonth
    builder
      .addCase(ScheduleByMonth.pending, (state) => {})
      .addCase(ScheduleByMonth.fulfilled, (state, action) => {
        if (action.payload) {
          state.scheduleByMonth = action.payload || [];
        }
      })
      .addCase(ScheduleByMonth.rejected, (state, action) => {});
  },
});

// Export actions
export const {} = dashboardSlice.actions;

// Export reducer
export default dashboardSlice.reducer;
