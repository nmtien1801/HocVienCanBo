import { ApiManager } from "./ApiManager";

const ApiReport = {
    getReportTrackingTeacherApi: (templateSurveyID, teacherID, subjectID, page, limit) => ApiManager.get(`/report-tracking/report-tracking-teacher?templateSurveyID=${templateSurveyID}&teacherID=${teacherID}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
}

export default ApiReport;
