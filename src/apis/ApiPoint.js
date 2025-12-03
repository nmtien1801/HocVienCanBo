import { ApiManager } from "./ApiManager";

const ApiPoint = {
    getListExaminationApi: (classID, subjectID, page, limit) => ApiManager.get(`/point-search/get-list-examinations-l1?classID=${classID}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getListExaminationsL2Api: (subjectID, page, limit) => ApiManager.get(`/point-search/get-list-examinations-l2?subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getListGraduateExaminationApi: (classID, subjectID, page, limit) => ApiManager.get(`/point-search/get-list-graduate-examinations-l1?classID=${classID}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getListGraduateExaminationsL2Api: (subjectID, page, limit) => ApiManager.get(`/point-search/get-list-graduate-examinations-l2?subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getSearchPointApi: (studentCode, subjectID, page, limit) => ApiManager.get(`/point-search/search-point?studentCode=${studentCode}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getSearchPointGraduationApi: (studentCode, subjectID, page, limit) => ApiManager.get(`/point-search/search-point-graduation?studentCode=${studentCode}&subjectID=${subjectID}&page=${page}&limit=${limit}`),
    getSearchPointStudentOutsiteApi: (studentID, page, limit) => ApiManager.get(`/point-search/search-point-student-outsite?studentID=${studentID}&page=${page}&limit=${limit}`),
}

export default ApiPoint;
