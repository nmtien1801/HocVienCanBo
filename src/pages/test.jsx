// Ví dụ: file MyPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Search } from 'lucide-react';
import StudentGroupedTable from '../components/Table';
import DropdownSearch from '../components/FormFields/DropdownSearch.jsx';
import { getClassLearnByUserID } from '../redux/learningClassSlice.js';
import { getSubjectLearnAll } from '../redux/scheduleSlice.js';
import { TypeUserIDCons } from "../utils/constants";

function MyPage() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const IS_STUDENT = userInfo?.TypeUserID !== TypeUserIDCons.Teacher;
    const { ClassLearn } = useSelector((state) => state.learningClass);
    const { subjectLearnAll } = useSelector((state) => state.schedule);

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(0);
    const [isLoadingClassLearn, setIsLoadingClassLearn] = useState(false);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

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

    const handleSearch = () => {
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    };

    const STYLE_CLASSES = {
        STT: "px-4 py-2 text-sm text-gray-600 border text-center",
        NGAY_HOC: "px-4 py-2 text-sm text-gray-600 border text-center",
        BUOI_HOC: "px-4 py-2 text-sm text-gray-600 border text-center", 
        BAI_GIANG: "px-4 py-2 text-sm text-gray-900 border",
        GIANG_VIEN: "px-4 py-2 text-sm text-gray-900 border",
        SO_TIET: "px-4 py-2 text-sm text-gray-900 border text-center",
        PHONG_HOC: "px-4 py-2 text-sm text-gray-900 border text-center",
    };

    const COLUMN_MAPPING = [
        { key: 'cot1', header: 'STT', dataField: 'subjectIndex', styleClass: STYLE_CLASSES.STT },
        { key: 'cot2', header: 'Ngày học', dataField: 'DateAir', styleClass: STYLE_CLASSES.NGAY_HOC },
        { key: 'cot3', header: 'Buổi học', dataField: 'Period', styleClass: STYLE_CLASSES.BUOI_HOC },
        { key: 'cot4', header: 'Bài giảng', dataField: 'LessonName', styleClass: STYLE_CLASSES.BAI_GIANG },
        { key: 'cot5', header: 'Giảng viên', dataField: 'TeacherName', styleClass: STYLE_CLASSES.GIANG_VIEN },
        { key: 'cot6', header: 'Số tiết', dataField: 'NumberCaculator', styleClass: STYLE_CLASSES.SO_TIET },
        { key: 'cot7', header: 'Phòng học', dataField: 'RoomID', styleClass: STYLE_CLASSES.PHONG_HOC },
    ];

    // Dữ liệu mẫu lịch học (tương tự Lesson.jsx)
    const data = [
        {
            id: '2321233001',
            name: 'Lớp A - Năm học 2024',
            subjects: [
                { DateAir: '2024-12-09', Period: 'Sáng', LessonName: 'Lịch sử Đảng', TeacherName: 'Thầy Nguyễn Văn A', NumberCaculator: 3, RoomID: 'A101' },
                { DateAir: '2024-12-10', Period: 'Chiều', LessonName: 'Triết học', TeacherName: 'Cô Trần Thị B', NumberCaculator: 2, RoomID: 'A102' },
                { DateAir: '2024-12-11', Period: 'Sáng', LessonName: 'Kinh tế chính trị', TeacherName: 'Thầy Hoàng Văn C', NumberCaculator: 2, RoomID: 'A103' },
            ]
        },
        {
            id: '2321233005',
            name: 'Lớp B - Năm học 2024',
            subjects: [
                { DateAir: '2024-12-09', Period: 'Chiều', LessonName: 'Lý luận Đảng', TeacherName: 'Cô Lê Thị D', NumberCaculator: 2, RoomID: 'B101' },
                { DateAir: '2024-12-12', Period: 'Sáng', LessonName: 'Chính sách xã hội', TeacherName: 'Thầy Dương Văn E', NumberCaculator: 3, RoomID: 'B102' },
            ]
        },
        {
            id: '2321233010',
            name: 'Lớp C - Năm học 2024',
            subjects: [
                { DateAir: '2024-12-13', Period: 'Sáng', LessonName: 'Pháp luật cơ bản', TeacherName: 'Thầy Võ Văn F', NumberCaculator: 2, RoomID: 'C101' },
                { DateAir: '2024-12-14', Period: 'Chiều', LessonName: 'Kỹ năng lãnh đạo', TeacherName: 'Cô Bùi Thị G', NumberCaculator: 3, RoomID: 'C102' },
                { DateAir: '2024-12-15', Period: 'Sáng', LessonName: 'Tư tưởng Hồ Chí Minh', TeacherName: 'Thầy Phạm Văn H', NumberCaculator: 2, RoomID: 'C103' },
            ]
        },
        {
            id: '2321233015',
            name: 'Lớp D - Năm học 2024',
            subjects: [
                { DateAir: '2024-12-16', Period: 'Sáng', LessonName: 'Quản lý công', TeacherName: 'Cô Vũ Thị I', NumberCaculator: 3, RoomID: 'D101' },
                { DateAir: '2024-12-17', Period: 'Chiều', LessonName: 'Giao tiếp hiệu quả', TeacherName: 'Thầy Trương Văn K', NumberCaculator: 2, RoomID: 'D102' },
            ]
        },
        {
            id: '2321233020',
            name: 'Lớp E - Năm học 2024',
            subjects: [
                { DateAir: '2024-12-18', Period: 'Sáng', LessonName: 'Đạo đức công vụ', TeacherName: 'Cô Chu Thị L', NumberCaculator: 2, RoomID: 'E101' },
                { DateAir: '2024-12-19', Period: 'Sáng', LessonName: 'Luật hành chính', TeacherName: 'Thầy Đinh Văn M', NumberCaculator: 3, RoomID: 'E102' },
                { DateAir: '2024-12-20', Period: 'Chiều', LessonName: 'Thực hành công vụ', TeacherName: 'Cô Ngô Thị N', NumberCaculator: 4, RoomID: 'E103' },
            ]
        },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng Điểm Học Viên</h1>
                <p className="text-gray-600 mb-6">
                    Ví dụ về component Table với phân trang. Click vào hàng để mở rộng chi tiết môn học.
                </p>

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
                
                {/* Table với phân trang: mỗi trang 2 mục */}
                <StudentGroupedTable 
                    data={data} 
                    COLUMN_MAPPING={COLUMN_MAPPING}
                    defaultPageSize={2}
                    showPagination={true}
                />
            </div>
        </div>
    );
}
export default MyPage;