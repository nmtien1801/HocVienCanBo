import { ApiManager } from "./ApiManager";

const ApiSurvey = {
    getSurveySubjectByStudentIDApi: (page, limit) => ApiManager.get(`/survey/get-list-survey-subject-by-studentid?page=${page}&limit=${limit}`),
    getSurveyByIDApi: (surveyID) => ApiManager.get(`/survey/get-by-id?surveyID=${surveyID}`),
    CreateSurveyTeacherApi: (model) => ApiManager.post(`/survey/create-teacher`, model),
    UpdateTemplateSurveyApi: (model) => ApiManager.post(`/survey/update-teacher`, model),
    UpdateSurveyAnswerClientApi: (model) => ApiManager.post(`/survey/update-survey-answer-client`, model),
    DeleteSurveyApi: (model) => ApiManager.post(`/survey-admin/delete`, model),

    getTemplateSurveyForTeacherStudentApi: () => ApiManager.get(`/template-survey/get-list-for-teacher-student`),
    CreateSurveyLocalApi: (model) => ApiManager.post(`/survey/create-local`, model),
    getTemplateSurveyForClientApi: () => ApiManager.get(`/template-survey/get-list-for-client`),
    CreateSurveyClientApi: (model) => ApiManager.post(`/survey/create-client`, model),

    getSurveyForAdministratorApi: (page, limit) => ApiManager.get(`/survey/get-list-survey-for-administrator?page=${page}&limit=${limit}`),
}

export default ApiSurvey;
