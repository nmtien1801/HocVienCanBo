import { ApiManager } from "./ApiManager";

const ApiDashboard = {
    getClassLearnByUserIDApi: () => ApiManager.get(`/class-learn/get-list-by-userid`),
}

export default ApiDashboard;
