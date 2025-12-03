import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiPoint from "../apis/ApiPoint.js";

const initialState = {
  ExaminationList: [],
  ExaminationTotal: 0,
  ExaminationList2: [],
  ExaminationTotal2: 0,
  GraduateList: [],
  GraduateTotal: 0,
  GraduateList2: [],
  GraduateTotal2: 0,
  SearchPointList: [],
  SearchPointTotal: 0,
  SearchGraduationList: [],
  SearchGraduationTotal: 0,
  SearchStudentOutsiteList: [],
  SearchStudentOutsiteTotal: 0,
};

export const getListExamination = createAsyncThunk(
  "points/getListExamination",
  async ({ classID, subjectID, page, limit }, thunkAPI) => {
    const response = await ApiPoint.getListExaminationApi(
      classID,
      subjectID,
      page,
      limit
    );
    return response;
  }
);

export const getListExaminationsL2 = createAsyncThunk(
  "points/getListExaminationsL2",
  async ({ subjectID, page, limit }, thunkAPI) => {
    const response = await ApiPoint.getListExaminationsL2Api(
      subjectID,
      page,
      limit
    );
    return response;
  }
);

export const getListGraduateExamination = createAsyncThunk(
  "points/getListGraduateExamination",
  async ({ classID, subjectID, page, limit }, thunkAPI) => {
    const response = await ApiPoint.getListGraduateExaminationApi(
      classID,
      subjectID,
      page,
      limit
    );
    return response;
  }
);

export const getListGraduateExaminationsL2 = createAsyncThunk(
  "points/getListGraduateExaminationsL2",
  async ({ subjectID, page, limit }, thunkAPI) => {
    const response = await ApiPoint.getListGraduateExaminationsL2Api(
      subjectID,
      page,
      limit
    );
    return response;
  }
);

export const getSearchPoint = createAsyncThunk(
  "points/getSearchPoint",
  async ({ studentCode, subjectID, page, limit }, thunkAPI) => {
    const response = await ApiPoint.getSearchPointApi(
      studentCode,
      subjectID,
      page,
      limit
    );
    return response;
  }
);

export const getSearchPointGraduation = createAsyncThunk(
  "points/getSearchPointGraduation",
  async ({ studentCode, subjectID, page, limit }, thunkAPI) => {
    const response = await ApiPoint.getSearchPointGraduationApi(
      studentCode,
      subjectID,
      page,
      limit
    );
    return response;
  }
);

export const getSearchPointStudentOutsite = createAsyncThunk(
  "points/getSearchPointStudentOutsite",
  async ({ studentID, page, limit }, thunkAPI) => {
    const response = await ApiPoint.getSearchPointStudentOutsiteApi(
      studentID,
      page,
      limit
    );
    return response;
  }
);

const pointSlice = createSlice({
  name: "points",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // getListExamination
    builder
      .addCase(getListExamination.pending, (state) => {})
      .addCase(getListExamination.fulfilled, (state, action) => {
        state.ExaminationList = action.payload.data || [];
        state.ExaminationTotal = action.payload.totals || 0;
      })
      .addCase(getListExamination.rejected, (state, action) => {});

    // getListExaminationsL2
    builder
      .addCase(getListExaminationsL2.pending, (state) => {})
      .addCase(getListExaminationsL2.fulfilled, (state, action) => {
        state.ExaminationList2 = action.payload.data || [];
        state.ExaminationTotal2 = action.payload.totals || 0;
      })
      .addCase(getListExaminationsL2.rejected, (state, action) => {});

    // getListGraduateExamination
    builder
      .addCase(getListGraduateExamination.pending, (state) => {})
      .addCase(getListGraduateExamination.fulfilled, (state, action) => {
        state.GraduateList = action.payload.data || [];
        state.GraduateTotal = action.payload.totals || 0;
      })
      .addCase(getListGraduateExamination.rejected, (state, action) => {});

    // getListGraduateExaminationsL2
    builder
      .addCase(getListGraduateExaminationsL2.pending, (state) => {})
      .addCase(getListGraduateExaminationsL2.fulfilled, (state, action) => {
        state.GraduateList2 = action.payload.data || [];
        state.GraduateTotal2 = action.payload.totals || 0;
      })
      .addCase(getListGraduateExaminationsL2.rejected, (state, action) => {});

    // getSearchPoint
    builder
      .addCase(getSearchPoint.pending, (state) => {})
      .addCase(getSearchPoint.fulfilled, (state, action) => {
        state.SearchPointList = action.payload.data || [];
        state.SearchPointTotal = action.payload.totals || 0;
      })
      .addCase(getSearchPoint.rejected, (state, action) => {});

    // getSearchPointGraduation
    builder
      .addCase(getSearchPointGraduation.pending, (state) => {})
      .addCase(getSearchPointGraduation.fulfilled, (state, action) => {
        state.SearchGraduationList = action.payload.data || [];
        state.SearchGraduationTotal = action.payload.totals || 0;
      })
      .addCase(getSearchPointGraduation.rejected, (state, action) => {});

    // getSearchPointStudentOutsite
    builder
      .addCase(getSearchPointStudentOutsite.pending, (state) => {})
      .addCase(getSearchPointStudentOutsite.fulfilled, (state, action) => {
        state.SearchStudentOutsiteList = action.payload.data || [];
        state.SearchStudentOutsiteTotal = action.payload.totals || 0;
      })
      .addCase(getSearchPointStudentOutsite.rejected, (state, action) => {});
  },
});

// Export actions
export const {} = pointSlice.actions;

// Export reducer
export default pointSlice.reducer;
