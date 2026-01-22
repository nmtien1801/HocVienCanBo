import { ApiManager } from "./ApiManager";

const ApiReport = {
    getReportTrackingTeacherApi: (templateSurveyID, teacherID, subjectID, page, limit) => ApiManager.get(`/report-tracking/report-tracking-teacher?templateSurveyID=${templateSurveyID}&teacherID=${teacherID}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getTemplateTrackingTeacherApi: (typeTemplate) => ApiManager.get(`/template-survey/get-template-survey-by-typetemplate?typeTemplate=${typeTemplate}`),
    getReportTrackingOtherApi: (page, limit) => ApiManager.get(`/survey/get-list-survey-other?page=${page}&limit=${limit}`),
    getReportTrackingOrderApi: (templateSurveyID, classTypeID, page, limit) => ApiManager.get(`/report-tracking/report-tracking-other?templateSurveyID=${templateSurveyID}&classTypeID=${classTypeID}&page=${page}&limit=${limit}`),
}

export default ApiReport;
