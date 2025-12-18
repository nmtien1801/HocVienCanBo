import { ApiManager } from "./ApiManager";

const ApiTeacher = {
    getAllTeacherApi: () => ApiManager.get(`/Teacher/get-list`),
}

export default ApiTeacher;
