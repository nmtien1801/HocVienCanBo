import { ApiManager } from "./ApiManager";

const ApiTemplateSurveys = {
    getTemplateSurveyApi: (key, typeTemplate, statusID, page, limit) => ApiManager.get(`/template-survey/get-list?key=${key}&typeTemplate=${typeTemplate}&statusID=${statusID}&page=${page}&limit=${limit}`),
    getTemplateSurveyActiveApi: () => ApiManager.get(`/template-survey/get-list-active`),
    getTemplateSurveyByIDApi: (templateSurveyID) => ApiManager.get(`/template-survey/get-by-id?templateSurveyID=${templateSurveyID}`),
    CreateTemplateSurveyApi: (model) => ApiManager.post(`/template-survey/create`, model),
    UpdateTemplateSurveyApi: (model) => ApiManager.post(`/template-survey/update`, model),
    DeleteTemplateSurveyApi: (model) => ApiManager.post(`/template-survey/delete`, model),
    
    // SurveySubject
    getSurveySubjectByTemlateSurveyIDApi: (templateSurveyID) => ApiManager.get(`/survey-subject/get-by-templatesurveyID?templateSurveyID=${templateSurveyID}`),
    CreateSurveySubjectApi: (model) => ApiManager.post(`/survey-subject/create`, model),
    DeleteSurveySubjectApi: (model) => ApiManager.post(`/survey-subject/delete`, model),
    
    CopyTemplateSurveyApi: (model) => ApiManager.post(`/template-survey/copy`, model),
}

export default ApiTemplateSurveys;
