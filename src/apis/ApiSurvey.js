import { ApiManager } from "./ApiManager";

const ApiSurvey = {
    getSurveySubjectByStudentIDApi: (page, limit) => ApiManager.get(`/survey/get-list-survey-subject-by-studentid?page=${page}&limit=${limit}`),
    getSurveyByIDApi: (surveyID) => ApiManager.get(`/survey/get-by-id?surveyID=${surveyID}`),
    CreateSurveyTeacherApi: (model) => ApiManager.post(`/survey/create-teacher`, model),
    UpdateTemplateSurveyApi: (model) => ApiManager.post(`/survey/update-teacher`, model),
    DeleteSurveyApi: (model) => ApiManager.post(`/survey-admin/delete`, model),

    getTemplateSurveyForTeacherStudentApi: () => ApiManager.get(`/template-survey/get-list-for-teacher-student`),
    CreateSurveyLocalApi: (model) => ApiManager.post(`/survey/create-local`, model),
}

export default ApiSurvey;
