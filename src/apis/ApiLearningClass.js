import { ApiManager } from "./ApiManager";

const ApiDashboard = {
    getClassLearnByUserIDApi: () => ApiManager.get(`/class-learn/get-list-by-userid`),
    getTrainingSystemAddressByUserID: (classID) => ApiManager.get(`/class-learn/get-training-system-address-by-classid?classID=${classID}`),
    getListByTypeApi: (classTypeID) => ApiManager.get(`/class-learn/get-list-by-type?classTypeID=${classTypeID}`),
}

export default ApiDashboard;
