import { ApiManager } from "./ApiManager";

const ApiSurvey = {
    getSurveySubjectByStudentIDApi: (page, limit) => ApiManager.get(`/survey/get-list-survey-subject-by-studentid?page=${page}&limit=${limit}`),
    getSurveyByIDApi: (surveyID) => ApiManager.get(`/survey/get-by-id?surveyID=${surveyID}`),
}

export default ApiSurvey;
