import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiSchedule from "../apis/ApiSchedule.js";

const initialState = {
  scheduleSlice: [],
  totalSchedule: 0,
  scheduleSubjectMonth: [],
  totalScheduleSubjectMonth: 0,
  subjectLearnAll: [],
  scheduleClass: [],
  totalScheduleClass: 0,
  scheduleLesson: [],
  totalScheduleLesson: 0,
  scheduleDaily: [],
  pointSum: [],
  totalPointSum: 0,
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

export const getScheduleClass = createAsyncThunk(
  "schedule/getScheduleClass",
  async ({ classLearnID, page, limit }, thunkAPI) => {
    const response = await ApiSchedule.getScheduleClassApi(
      classLearnID,
      page,
      limit
    );
    return response;
  }
);

export const getScheduleLesson = createAsyncThunk(
  "schedule/getScheduleLesson",
  async ({ classLearnID, subjectID, page, limit }, thunkAPI) => {
    const response = await ApiSchedule.getScheduleLessonApi(
      classLearnID,
      subjectID,
      page,
      limit
    );
    return response;
  }
);

export const getScheduleDaily = createAsyncThunk(
  "schedule/getScheduleDaily",
  async (thunkAPI) => {
    const response = await ApiSchedule.getScheduleDailyApi();
    return response;
  }
);

export const printPointSum = createAsyncThunk(
  "schedule/printPointSum",
  async ({ classID, studentID, page, limit }, thunkAPI) => {
    const response = await ApiSchedule.printPointSumApi(
      classID,
      studentID,
      page,
      limit
    );
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

    // getScheduleClass
    builder
      .addCase(getScheduleClass.pending, (state) => {})
      .addCase(getScheduleClass.fulfilled, (state, action) => {
        if (action.payload) {
          state.scheduleClass = action.payload.data || [];
          state.totalScheduleClass = action.payload.totals || 0;
        }
      })
      .addCase(getScheduleClass.rejected, (state, action) => {});

    // getScheduleLesson
    builder
      .addCase(getScheduleLesson.pending, (state) => {})
      .addCase(getScheduleLesson.fulfilled, (state, action) => {
        if (action.payload) {
          state.scheduleLesson = action.payload.data || [];
          state.totalScheduleLesson = action.payload.totals || 0;
        }
      })
      .addCase(getScheduleLesson.rejected, (state, action) => {});

    // getScheduleDaily
    builder
      .addCase(getScheduleDaily.pending, (state) => {})
      .addCase(getScheduleDaily.fulfilled, (state, action) => {
        if (action.payload) {
          state.scheduleDaily = action.payload.data || [];
        }
      })
      .addCase(getScheduleDaily.rejected, (state, action) => {});

    // printPointSum
    builder
      .addCase(printPointSum.pending, (state) => {})
      .addCase(printPointSum.fulfilled, (state, action) => {
        if (action.payload) {
          state.pointSum = action.payload.data || [];
          state.totalPointSum = action.payload.totals || 0;
        }
      })
      .addCase(printPointSum.rejected, (state, action) => {});
  },
});

// Export actions
export const {} = scheduleSlice.actions;

// Export reducer
export default scheduleSlice.reducer;
