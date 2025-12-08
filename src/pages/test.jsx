// Ví dụ: file MyPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Search, Loader2, AlertCircle } from 'lucide-react';
import StudentGroupedTable from '../components/Table';
import DropdownSearch from '../components/FormFields/DropdownSearch.jsx';
import { getClassLearnByUserID } from '../redux/learningClassSlice.js';
import { getSubjectLearnAll, getScheduleLesson } from '../redux/scheduleSlice.js';
import { TypeUserIDCons } from "../utils/constants";

const STYLE_CLASSES = {
    COLLAPSE: "px-4 py-2 text-sm text-gray-700 border text-center",
    STUDENT_ID: "px-4 py-2 text-sm text-gray-700 border text-center",
    STUDENT_NAME: "px-4 py-2 text-sm text-gray-700 border",
    DATE: "px-4 py-2 text-sm text-gray-600 border text-center",
    PERIOD: "px-4 py-2 text-sm text-gray-600 border text-center",
    LESSON: "px-4 py-2 text-sm text-gray-900 border",
    TEACHER: "px-4 py-2 text-sm text-gray-900 border",
    NUMBER_CALCULATOR: "px-4 py-2 text-sm text-gray-900 border text-center",
    ROOM: "px-4 py-2 text-sm text-gray-900 border text-center",
};

function MyPage() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const IS_STUDENT = userInfo?.TypeUserID !== TypeUserIDCons.Teacher;
    const { ClassLearn } = useSelector((state) => state.learningClass);
    const { subjectLearnAll } = useSelector((state) => state.schedule);
    const { scheduleLesson, totalScheduleLesson } = useSelector((state) => state.schedule);

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(0);
    const [isLoadingClassLearn, setIsLoadingClassLearn] = useState(false);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false); // Thêm state để theo dõi đã tìm kiếm chưa

    useEffect(() => {
        const fetchClassLearn = async () => {
            setIsLoadingClassLearn(true);
            try {
                let res = await dispatch(getClassLearnByUserID());
                if (!res.payload || !res.payload.data) {
                    toast.error(res.payload?.message);
                }

                if (IS_STUDENT && Array.isArray(res.payload.data) && res.payload.data.length === 1) {
                    const singleClass = res.payload.data[0];
                    const classID = Number(singleClass.ClassID);
                    setSelectedClass(classID);
                } else if (!IS_STUDENT) {
                    setSelectedClass(0);
                }
            } catch (err) {
                toast.error('Đã có lỗi xảy ra khi tải danh sách lớp học');
            } finally {
                setIsLoadingClassLearn(false);
            }
        };

        const fetchSubjectLearnAll = async () => {
            setIsLoadingSubjects(true);
            try {
                let res = await dispatch(getSubjectLearnAll());
                if (!res.payload || !res.payload.data) {
                    toast.error(res.payload?.message || 'Không thể tải danh sách môn học');
                }
            } catch (err) {
                toast.error('Đã có lỗi xảy ra khi tải danh sách môn học');
            } finally {
                setIsLoadingSubjects(false);
            }
        };

        if (subjectLearnAll.length === 0) {
            fetchSubjectLearnAll();
        }
        if (ClassLearn.length === 0) {
            fetchClassLearn();
        }
    }, [dispatch, ClassLearn.length, subjectLearnAll.length, IS_STUDENT]);

    const fetchScheduleClass = async () => {
        if (!selectedClass) {
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            let res = await dispatch(getScheduleLesson({
                classLearnID: selectedClass,
                subjectID: selectedSubject,
                page: currentPage,
                limit: pageSize
            }));

            if (!res.payload || !res.payload.data) {
                const errorMsg = res.payload?.message || 'Không thể tải dữ liệu';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = 'Đã có lỗi xảy ra khi tải dữ liệu';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Chỉ fetch khi đã hasSearched và có thay đổi phân trang
    useEffect(() => {
        if (hasSearched && selectedClass) {
            fetchScheduleClass();
        }
    }, [currentPage, pageSize]);

    const handleSearch = async () => {
        if (!selectedClass) {
            toast.warning('Vui lòng chọn lớp học');
            return;
        }
        setHasSearched(true); // Đánh dấu đã thực hiện tìm kiếm
        setCurrentPage(1);
        fetchScheduleClass();
    };



    const COLUMN_MAPPING = [
        { key: 'cot', header: '', dataField: 'collapseControl', styleClass: STYLE_CLASSES.COLLAPSE },
        { key: 'cot2', header: 'STT', dataField: 'subjectIndex', styleClass: STYLE_CLASSES.DATE },
        { key: 'cot3', header: 'Ngày học', dataField: 'DateAir', styleClass: STYLE_CLASSES.DATE },
        { key: 'cot4', header: 'Buổi học', dataField: 'Period', styleClass: STYLE_CLASSES.PERIOD },
        { key: 'cot5', header: 'Bài giảng', dataField: 'LessonName', styleClass: STYLE_CLASSES.LESSON },
        { key: 'cot6', header: 'Giảng viên', dataField: 'TeacherName', styleClass: STYLE_CLASSES.TEACHER },
        { key: 'cot7', header: 'Số tiết', dataField: 'NumberCaculator', styleClass: STYLE_CLASSES.NUMBER_CALCULATOR },
        { key: 'cot8', header: 'Phòng học', dataField: 'RoomID', styleClass: STYLE_CLASSES.ROOM },
    ];

    // nhóm data 
    const dataForTable = useMemo(() => {
        if (!scheduleLesson || !Array.isArray(scheduleLesson) || scheduleLesson.length === 0) {
            return [];
        }

        const classObject = ClassLearn.find(c => c.ClassID === selectedClass);
        const className = classObject ? classObject.ClassName : `Lớp ID: ${selectedClass}`;

        return [
            {
                id: className, // Hiện ở cột 1 [+]
                name: "", // Hiện ở cột 2 [+]
                subjects: scheduleLesson, // Đặt tất cả buổi học vào mảng subjects
            },
        ];
    }, [scheduleLesson, selectedClass, ClassLearn]);

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-[1400px] mx-auto">
                <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-6">Bảng Điểm Học Viên (Lịch Học Demo)</h1>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-3 flex-1 min-w-[200px] md:min-w-0">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Lớp</label>
                            <DropdownSearch
                                options={ClassLearn}
                                placeholder="------ chọn lớp học ------"
                                labelKey="ClassName"
                                valueKey="ClassID"
                                onChange={(e) => setSelectedClass(e.ClassID)}
                            />
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-[200px] md:min-w-0">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Môn học</label>
                            <DropdownSearch
                                options={subjectLearnAll}
                                placeholder="------ chọn môn học ------"
                                labelKey="SubjectName"
                                valueKey="SubjectID"
                                onChange={(e) => setSelectedSubject(e.SubjectID)}
                            />
                        </div>

                        <button
                            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-1 md:flex-none"
                            onClick={handleSearch}
                        >
                            <Search size={16} />
                            <span className='whitespace-nowrap'>Tìm kiếm</span>
                        </button>
                    </div>
                </div>

                {/* Hiển thị message khi chưa tìm kiếm */}
                {!hasSearched && (
                    <div className="bg-white rounded-lg shadow-sm p-12">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-medium">Vui lòng chọn lớp học</p>
                            <p className="text-gray-500 text-sm">Chọn lớp học và nhấn "Tìm kiếm" để xem Thời khóa biểu</p>
                        </div>
                    </div>
                )}

                {/* Hiển thị loading */}
                {hasSearched && isLoading && (
                    <div className="bg-white rounded-lg shadow-sm p-12">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 size={32} className="text-gray-400 animate-spin" />
                            <p className="text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                )}

                {/* Hiển thị error */}
                {hasSearched && !isLoading && error && (
                    <div className="bg-white rounded-lg shadow-sm p-12">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle size={32} className="text-red-500" />
                            </div>
                            <p className="text-red-600 font-medium">Lỗi: {error}</p>
                        </div>
                    </div>
                )}

                {/* Hiển thị bảng khi đã tìm kiếm và không có lỗi */}
                {hasSearched && !isLoading && !error && (
                    <StudentGroupedTable
                        data={dataForTable}
                        COLUMN_MAPPING={COLUMN_MAPPING}
                        defaultPageSize={pageSize}
                        showPagination={true}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        totalItems={totalScheduleLesson || 0}
                    />
                )}
            </div>
        </div>
    );
}

export default MyPage;