import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, CheckCircle2, Search, FileDown, Users, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { getReportTrackingTeacher } from '../../redux/reportSlice.js';
import { useSelector, useDispatch } from "react-redux";
import DropdownSearch from '../../components/FormFields/DropdownSearch.jsx';
import { getSubjectLearnAll } from '../../redux/scheduleSlice.js';
import { getAllTeacher } from '../../redux/teacherSlice.js';
import { getTemplateTrackingTeacher } from '../../redux/reportSlice.js'

const ReportSurvey = () => {
    const dispatch = useDispatch();

    // Lấy dữ liệu từ Redux (Giả sử cấu trúc slice của bạn)
    const { TemplateTrackingTeacherList, EvaluationList, SurveyReportList, SurveyReportTotal } = useSelector((state) => state.report);
    const { teacherList } = useSelector((state) => state.teacher);
    const { subjectLearnAll } = useSelector((state) => state.schedule);
    const [selectedSubject, setSelectedSubject] = useState(0);
    const [selectedTeacher, setSelectedTeacher] = useState(0);
    const [selectedTemplateSurvey, setSelectedTemplateSurvey] = useState(0);

    // ---------------------------------------------------  PHÂN TRANG
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [isLoading, setIsLoading] = useState(false);

    // ----------------------------------- FETCH DATA
    const fetchReport = async () => {
        setIsLoading(true); // Bật loading
        try {
            const res = await dispatch(
                getReportTrackingTeacher({
                    templateSurveyID: selectedTemplateSurvey,
                    teacherID: selectedTeacher,
                    subjectID: selectedSubject,
                    page,
                    limit
                })
            );

            if (res.payload?.Message) {
                toast.error(res.payload?.Message || "Lỗi tải dữ liệu");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsLoading(false); // Tắt loading dù thành công hay lỗi
        }
    };

    // Gọi lại API khi filter hoặc phân trang thay đổi
    useEffect(() => {
        const fetchSubjectLearnAll = async () => {
            let res = await dispatch(getSubjectLearnAll());
            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message || 'Không thể tải danh sách môn học');
            }
        };

        const fetchPendingSurveys = async () => {
            const res = await dispatch(getTemplateTrackingTeacher({ typeTemplate: 1 }));

            if (res.message) {
                toast.error(res.message);
            }
        };

        const fetchTeacher = async () => {
            const res = await dispatch(getAllTeacher());

            if (res.message) {
                toast.error(res.message);
            }
        };


        if (subjectLearnAll.length === 0) {
            fetchSubjectLearnAll();
        }
        fetchPendingSurveys();
        fetchTeacher();
    }, [dispatch]);

    // ----------------------------------------------------------- CRUD
    useEffect(() => {
        if (selectedTemplateSurvey !== 0) { // Chỉ gọi khi đã chọn mẫu
            fetchReport();
        }
    }, [page, limit]);

    const handleCheckboxChange = (id) => {
        setSelectedCriteria(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSearch = () => {
        setPage(1);
        fetchReport();
    };

    const handleExportExcel = () => {
        // TODO: Implement Excel export functionality
        toast.info('Chức năng xuất Excel đang được phát triển');
    };

    // --------------------------------------------------------- LOGIC HIỂN THỊ CỘT
    const [selectedCriteria, setSelectedCriteria] = useState([]);

    useEffect(() => {
        if (EvaluationList.length > 0) {
            setSelectedCriteria(EvaluationList.map(item => item.EvaluationID));
        }
    }, [EvaluationList]);



    const calculateRowTotal = (lstEvalutionTracking) => {
        if (!lstEvalutionTracking) return 0;
        return lstEvalutionTracking.reduce((sum, item) => {
            if (selectedCriteria.includes(item.EvaluationID)) {
                return sum + (item.NumberTracking || 0);
            }
            return sum;
        }, 0);
    };

    // Gộp các câu hỏi trùng nhau
    const groupedReportList = useMemo(() => {
        if (!SurveyReportList || SurveyReportList.length === 0) return [];

        const groups = SurveyReportList.reduce((acc, current) => {
            // Lấy tiêu đề làm khóa để gộp
            const key = current.TitleCriteriaEvaluation;

            if (!acc[key]) {
                // Nếu chưa có thì khởi tạo
                acc[key] = {
                    ...current,
                    lstEvalutionTracking: JSON.parse(JSON.stringify(current.lstEvalutionTracking || []))
                };
            } else {
                // Nếu đã có thì cộng dồn NumberTracking của từng EvaluationID
                current.lstEvalutionTracking?.forEach(currEval => {
                    const targetEval = acc[key].lstEvalutionTracking.find(e => e.EvaluationID === currEval.EvaluationID);
                    if (targetEval) {
                        targetEval.NumberTracking += (currEval.NumberTracking || 0);
                    }
                });
            }
            return acc;
        }, {});

        return Object.values(groups);
    }, [SurveyReportList]);

    // Tính tổng số trang
    const totalPages = Math.ceil(SurveyReportTotal / limit);
    console.log('sssss ', groupedReportList);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <BarChart3 className="text-[#0081cd]" />
                            Báo cáo kết quả khảo sát
                        </h1>
                        <p className="text-gray-500 text-sm">Xem thống kê chi tiết theo các tiêu chí đánh giá</p>
                    </div>
                </div>

                {/* BỘ LỌC */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200 items-end">
                    <div className="flex flex-col gap-1 md:col-span-3">
                        <label className="text-xs font-bold text-gray-600 uppercase">Mẫu khảo sát</label>
                        <DropdownSearch
                            options={TemplateTrackingTeacherList}
                            placeholder="------ chọn mẫu khảo sát ------"
                            labelKey="Title"
                            valueKey="TemplateSurveyID"
                            onChange={(e) => setSelectedTemplateSurvey(e.TemplateSurveyID)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-3">
                        <label className="text-xs font-bold text-gray-600 uppercase">Giảng viên</label>
                        <DropdownSearch
                            options={teacherList}
                            placeholder="------ chọn giảng viên ------"
                            labelKey="TeacherName"
                            valueKey="TeacherID"
                            onChange={(e) => setSelectedTeacher(e.TeacherID)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-3">
                        <label className="text-xs font-bold text-gray-600 uppercase">Môn học</label>
                        <DropdownSearch
                            options={subjectLearnAll}
                            placeholder="------ chọn môn học ------"
                            labelKey="SubjectName"
                            valueKey="SubjectID"
                            onChange={(e) => setSelectedSubject(e.SubjectID)}
                        />
                    </div>

                    <div className="md:col-span-3 flex gap-2">
                        <button
                            className="bg-[#0081cd] hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors flex-1"
                            onClick={handleSearch}
                        >
                            <Search size={16} />
                            Tìm kiếm
                        </button>
                        <button
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                            onClick={handleExportExcel}
                            title="Xuất Excel"
                        >
                            <FileDown size={16} /> Xuất Excel
                        </button>
                    </div>
                </div>

                {/* SECTION 2: CHỌN TIÊU CHÍ HIỂN THỊ */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        Chọn tiêu chí hiển thị trên bảng:
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {EvaluationList.map(item => (
                            <label key={item.EvaluationID} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedCriteria.includes(item.EvaluationID)}
                                    onChange={() => handleCheckboxChange(item.EvaluationID)}
                                    className="w-4 h-4 text-[#0081cd] rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                    {item.EvaluationName}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* SECTION 3: BẢNG DỮ LIỆU */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-sm font-bold text-gray-700 w-16">STT</th>
                                    <th className="p-4 text-sm font-bold text-gray-700">Nội dung câu hỏi</th>
                                    {EvaluationList.filter(c => selectedCriteria.includes(c.EvaluationID)).map(c => (
                                        <th key={c.EvaluationID} className="p-4 text-sm font-bold text-center text-[#026aa8] bg-blue-50/50 w-20">
                                            {c.EvaluationName}
                                        </th>
                                    ))}
                                    <th className="p-4 text-sm font-bold text-center text-gray-700 bg-gray-100 w-28">Tổng cộng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={selectedCriteria.length + 3} className="p-20 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-10 h-10 border-4 border-[#0081cd] border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-500 font-medium">Đang lấy dữ liệu báo cáo...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    groupedReportList.length > 0 ? groupedReportList.map((row, index) => (
                                        <tr key={row.EvaluationID || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-sm text-gray-600">{(page - 1) * limit + index + 1}</td>
                                            <td className="p-4 text-sm text-gray-800 font-medium">{row.TitleCriteriaEvaluation}</td>
                                            {EvaluationList.filter(c => selectedCriteria.includes(c.EvaluationID)).map(c => {
                                                const evaluationData = row.lstEvalutionTracking?.find(e => e.EvaluationID === c.EvaluationID);
                                                return (
                                                    <td key={c.EvaluationID} className="p-4 text-sm text-center text-gray-600">
                                                        {evaluationData ? evaluationData.NumberTracking : 0}
                                                    </td>
                                                );
                                            })}
                                            <td className="p-4 text-sm text-center font-bold text-gray-900 bg-gray-50">
                                                {calculateRowTotal(row.lstEvalutionTracking)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={EvaluationList.length + 3} className="p-8 text-center text-gray-400 italic">
                                                Không có dữ liệu hiển thị.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* SECTION 4: PHÂN TRANG */}
                    <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${page === i + 1
                                        ? 'bg-[#0081cd] text-white shadow-md'
                                        : 'hover:bg-white border border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages || totalPages === 0}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Hiển thị</span>
                            <select
                                value={limit}
                                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                                className="border border-gray-300 rounded p-1 text-sm outline-none"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm text-gray-600">trên tổng số {SurveyReportTotal} dòng</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportSurvey;