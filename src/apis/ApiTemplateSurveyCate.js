// câu hỏi
import { ApiManager } from "./ApiManager";

const ApiTemplateSurveyCate = {
    getTemplateSurveyCateByTemplateSurveyIDApi: (templateSurveyID) => ApiManager.get(`/template-survey-cate/get-by-template-survey-id?templateSurveyID=${templateSurveyID}`),
    getTemplateSurveyCateByIDApi: (templateSurveyCateID) => ApiManager.get(`/template-survey-cate/get-by-id?templateSurveyCateID=${templateSurveyCateID}`),
    CreateTemplateSurveyCateApi: (model) => ApiManager.post(`/template-survey-cate/create`, model),
    UpdateTemplateSurveyCateApi: (model) => ApiManager.post(`/template-survey-cate/update`, model),
    DeleteTemplateSurveyCateApi: (model) => ApiManager.post(`/template-survey-cate/delete`, model),
}

export default ApiTemplateSurveyCate;
