import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiSurvey from "../apis/ApiSurvey.js";

const initialState = {
  SurveysByStudentList: [],
  SurveysByStudentTotal: 0,
  SurveyForTeacherStudentList: [],
  TemplateSurveyForClientList: [],
  SurveysForAdministratorList: [],
  SurveysForAdministratorTotal: 0,
};

export const getSurveySubjectByStudentID = createAsyncThunk(
  "survey/getSurveySubjectByStudentID",
  async ({ page, limit }, thunkAPI) => {
    const response = await ApiSurvey.getSurveySubjectByStudentIDApi(
      page,
      limit
    );
    return response.data;
  }
);

export const getSurveyForAdministrator = createAsyncThunk(
  "survey/getSurveyForAdministrator",
  async ({ typeTemplate, templateSurveyID, page, limit }, thunkAPI) => {
    const response = await ApiSurvey.getSurveyForAdministratorApi(
      typeTemplate,
      templateSurveyID,
      page,
      limit
    );
    return response.data;
  }
);

export const getTemplateSurveyForTeacherStudent = createAsyncThunk(
  "survey/getTemplateSurveyForTeacherStudent",
  async (thunkAPI) => {
    const response = await ApiSurvey.getTemplateSurveyForTeacherStudentApi();
    return response;
  }
);

export const getTemplateSurveyForClient = createAsyncThunk(
  "survey/getTemplateSurveyForClient",
  async (thunkAPI) => {
    const response = await ApiSurvey.getTemplateSurveyForClientApi();
    return response;
  }
);

const surveySlice = createSlice({
  name: "survey",
  initialState,

  reducers: {
    resetSurvey: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // getSurveySubjectByStudentID
    builder
      .addCase(getSurveySubjectByStudentID.pending, (state) => {})
      .addCase(getSurveySubjectByStudentID.fulfilled, (state, action) => {
        state.SurveysByStudentList = action.payload.data || [];
        state.SurveysByStudentTotal = action.payload.totals || 0;
      })
      .addCase(getSurveySubjectByStudentID.rejected, (state, action) => {});

    // getSurveyForAdministrator
    builder
      .addCase(getSurveyForAdministrator.pending, (state) => {})
      .addCase(getSurveyForAdministrator.fulfilled, (state, action) => {
        state.SurveysForAdministratorList = action.payload.data || [];
        state.SurveysForAdministratorTotal = action.payload.totals || 0;
      })
      .addCase(getSurveyForAdministrator.rejected, (state, action) => {});

    // getTemplateSurveyForTeacherStudent
    builder
      .addCase(getTemplateSurveyForTeacherStudent.pending, (state) => {})
      .addCase(
        getTemplateSurveyForTeacherStudent.fulfilled,
        (state, action) => {
          state.SurveyForTeacherStudentList = action.payload.data || [];
        }
      )
      .addCase(
        getTemplateSurveyForTeacherStudent.rejected,
        (state, action) => {}
      );

    // getTemplateSurveyForClient
    builder
      .addCase(getTemplateSurveyForClient.pending, (state) => {})
      .addCase(getTemplateSurveyForClient.fulfilled, (state, action) => {
        state.TemplateSurveyForClientList = action.payload.data || [];
      })
      .addCase(getTemplateSurveyForClient.rejected, (state, action) => {});
  },
});

// Export actions
export const { resetSurvey } = surveySlice.actions;

// Export reducer
export default surveySlice.reducer;
