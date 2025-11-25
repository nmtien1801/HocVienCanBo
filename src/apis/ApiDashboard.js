import { ApiManager } from "./ApiManager";

const ApiDashboard = {
    DashboardTotalApi: () => ApiManager.get(`/dashboard/dashboard-total`),
    ScheduleByMonthApi: () => ApiManager.get(`/dashboard/schedule-by-month`),
}

export default ApiDashboard;
