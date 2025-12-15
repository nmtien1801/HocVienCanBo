import { ApiManager } from "./ApiManager";

const ApiEvaluations = {
    getEvaluationByTemplateSurveyIDApi: (templateSurveyID) => ApiManager.get(`/evaluation/get-by-template-survey-id?templateSurveyID=${templateSurveyID}`),
    getEvaluationByIDApi: (EvaluationID) => ApiManager.get(`/evaluation/get-by-id?EvaluationID=${EvaluationID}`),
    CreateEvaluationApi: (model) => ApiManager.post(`/evaluation/create`, model),
    UpdateEvaluationApi: (model) => ApiManager.post(`/evaluation/update`, model),
    DeleteEvaluationApi: (model) => ApiManager.post(`/evaluation/delete`, model),
}

export default ApiEvaluations;
