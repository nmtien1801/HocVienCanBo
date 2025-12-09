// câu hỏi
import { ApiManager } from "./ApiManager";

const ApiCriteriaEvaluation = {
    getCriteriaEvaluationApi: (key, typeTemplate, statusID, page, limit) => ApiManager.get(`/criteria-evaluation/get-list?key=${key}&typeTemplate=${typeTemplate}&statusID=${statusID}&page=${page}&limit=${limit}`),
    getCriteriaEvaluationActiveApi: () => ApiManager.get(`/criteria-evaluation/get-list-active`),
    getTemplateSurveyByIDApi: (templateSurveyID) => ApiManager.get(`/criteria-evaluation/get-by-id?templateSurveyID=${templateSurveyID}`),
    CreateTemplateSurveyApi: (model) => ApiManager.post(`/criteria-evaluation/create`, model),
    UpdateTemplateSurveyApi: (model) => ApiManager.post(`/criteria-evaluation/update`, model),
    DeleteTemplateSurveyApi: (model) => ApiManager.post(`/criteria-evaluation/delete`, model),
}

export default ApiCriteriaEvaluation;
