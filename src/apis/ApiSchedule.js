import { ApiManager } from "./ApiManager";

const ApiDashboard = {
    getScheduleMonthApi: (startDate, endDate, page, limit) => ApiManager.get(`/schedule/get-schedule-month?dtFrom=${startDate}&dtTo=${endDate}&page=${page}&limit=${limit}`),
    getScheduleGraduationMonthApi: (startDate, endDate, page, limit) => ApiManager.get(`/schedule/get-schedule-graduation-month?dtFrom=${startDate}&dtTo=${endDate}&page=${page}&limit=${limit}`),
    getScheduleSubjectMonthApi: (startDate, endDate, subjectID, page, limit) => ApiManager.get(`/schedule/get-schedule-subject-month?dtFrom=${startDate}&dtTo=${endDate}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getScheduleClassApi: (classLearnID, page, limit) => ApiManager.get(`/schedule/get-schedule-class?classLearnID=${classLearnID}&page=${page}&limit=${limit}`),
    getScheduleLessonApi: (classLearnID, subjectID, page, limit) => ApiManager.get(`/schedule/get-schedule-lesson?classLearnID=${classLearnID}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
    printPointSumApi: (classID, studentID, page, limit) => ApiManager.get(`/schedule/print-point-sum?classID=${classID}&studentID=${studentID}&page=${page}&limit=${limit}`),
    getSubjectLearnAllApi: () => ApiManager.get(`/subject-learn/get-subject-learn`),
    getScheduleDailyApi: () => ApiManager.get(`/schedule/get-schedule-daily`),
}

export default ApiDashboard;
