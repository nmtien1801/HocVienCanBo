import { ApiManager } from "./ApiManager";

const TemplateSurveyCriterias = {
    getTemplateSurveyCriteriaByTemlateSurveyCateIDApi: (templateSurveyCateID) => ApiManager.get(`/template-survey-criteria/get-by-templatesurveycateID?templateSurveyCateID=${templateSurveyCateID}`),
    getTemplateSurveyCriteriaByIDApi: (templateSurveyCriteriaID) => ApiManager.get(`/template-survey-criteria/get-by-id?templateSurveyCriteriaID=${templateSurveyCriteriaID}`),
    CreateTemplateSurveyCriteriaApi: (model) => ApiManager.post(`/template-survey-criteria/create`, model),
    UpdateTemplateSurveyCriteriaApi: (model) => ApiManager.post(`/template-survey-criteria/update`, model),
    DeleteTemplateSurveyCriteriaApi: (model) => ApiManager.post(`/template-survey-criteria/delete`, model),
}

export default TemplateSurveyCriterias;
