import { ApiManager } from "./ApiManager";

const ApiDashboard = {
    getScheduleMonthApi: (startDate, endDate, page, limit) => ApiManager.get(`/schedule/get-schedule-month?dtFrom=${startDate}&dtTo=${endDate}&page=${page}&limit=${limit}`),
    getScheduleSubjectMonthApi: (startDate, endDate, subjectID, page, limit) => ApiManager.get(`/schedule/get-schedule-subject-month?dtFrom=${startDate}&dtTo=${endDate}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getScheduleClassApi: (classLearnID, page, limit) => ApiManager.get(`/schedule/get-schedule-class?classLearnID=${classLearnID}&page=${page}&limit=${limit}`),
    getSubjectLearnAllApi: () => ApiManager.get(`/subject-learn/get-subject-learn`),
}

export default ApiDashboard;
