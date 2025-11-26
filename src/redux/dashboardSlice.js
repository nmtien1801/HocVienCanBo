import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiDashboard from "../apis/ApiDashboard.js";

const initialState = {
  dashboardTotal: [],
  scheduleByMonth: [],
  scheduleByExamination: [],
  listInformation: [],
  scheduleClassSubject: [],
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

export const ScheduleByExamination = createAsyncThunk(
  "dashboard/ScheduleByExamination",
  async (thunkAPI) => {
    const response = await ApiDashboard.ScheduleByExaminationApi();
    return response;
  }
);

export const ListInformation = createAsyncThunk(
  "dashboard/ListInformation",
  async (thunkAPI) => {
    const response = await ApiDashboard.ListInformationApi();
    return response;
  }
);

export const ScheduleClassSubject = createAsyncThunk(
  "dashboard/ScheduleClassSubject",
  async (thunkAPI) => {
    const response = await ApiDashboard.ScheduleClassSubjectApi();
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

    // ScheduleByExamination
    builder
      .addCase(ScheduleByExamination.pending, (state) => {})
      .addCase(ScheduleByExamination.fulfilled, (state, action) => {
        if (action.payload) {
          state.scheduleByExamination = action.payload || [];
        }
      })
      .addCase(ScheduleByExamination.rejected, (state, action) => {});

    // ListInformation
    builder
      .addCase(ListInformation.pending, (state) => {})
      .addCase(ListInformation.fulfilled, (state, action) => {
        if (action.payload) {
          state.listInformation = action.payload || [];
        }
      })
      .addCase(ListInformation.rejected, (state, action) => {});

    // ScheduleClassSubject
    builder
      .addCase(ScheduleClassSubject.pending, (state) => {})
      .addCase(ScheduleClassSubject.fulfilled, (state, action) => {
        if (action.payload) {
          state.scheduleClassSubject = action.payload || [];
        }
      })
      .addCase(ScheduleClassSubject.rejected, (state, action) => {});
  },
});

// Export actions
export const {} = dashboardSlice.actions;

// Export reducer
export default dashboardSlice.reducer;
