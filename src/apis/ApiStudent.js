import { ApiManager } from "./ApiManager";

const ApiStudent = {
    getStudentByClassApi: (classID) => ApiManager.get(`/student/get-student-by-classid/?classID=${classID}`),
    getStudentOutsiteApi: () => ApiManager.get(`/student/get-student-outsite`),
}

export default ApiStudent;
