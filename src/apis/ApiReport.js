import { ApiManager } from "./ApiManager";

const ApiReport = {
    getReportTrackingTeacherApi: (templateSurveyID, teacherID, subjectID, page, limit) => ApiManager.get(`/report-tracking/report-tracking-teacher?templateSurveyID=${templateSurveyID}&teacherID=${teacherID}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getTemplateTrackingTeacherApi: (typeTemplate) => ApiManager.get(`/template-survey/get-template-survey-by-typetemplate?typeTemplate=${typeTemplate}`),
}

export default ApiReport;
