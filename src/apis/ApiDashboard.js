import { ApiManager } from "./ApiManager";

const ApiDashboard = {
    DashboardTotalApi: () => ApiManager.get(`/dashboard/dashboard-total`),
    ScheduleByMonthApi: () => ApiManager.get(`/dashboard/schedule-by-month`),
    ScheduleByExaminationApi: () => ApiManager.get(`/dashboard/schedule-by-examination`),
    ListInformationApi: () => ApiManager.get(`/dashboard/list-information`),
    ScheduleClassSubjectApi: () => ApiManager.get(`/dashboard/schedule-class-subject`),
}

export default ApiDashboard;
