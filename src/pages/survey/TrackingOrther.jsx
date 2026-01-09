import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, CheckCircle2, Search, FileDown, Users, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { getReportTrackingOrder } from '../../redux/reportSlice.js';
import { useSelector, useDispatch } from "react-redux";
import DropdownSearch from '../../components/FormFields/DropdownSearch.jsx';
import { getTemplateTrackingTeacher } from '../../redux/reportSlice.js'
import * as XLSX from 'xlsx';

const TrackingOrder = () => {
    const dispatch = useDispatch();

    const { TemplateTrackingTeacherList, EvaluationOrderList, TrackingOrderList, TrackingOrderTotal } = useSelector((state) => state.report);
    const [selectedTemplateSurvey, setSelectedTemplateSurvey] = useState(0);
    const [totalParticipants, setTotalParticipants] = useState(0);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const [showCommentModal, setShowCommentModal] = useState(false); // modal câu hỏi tự luận
    const [currentComments, setCurrentComments] = useState([]);
    const [selectedQuestionTitle, setSelectedQuestionTitle] = useState("");

    // ----------------------------------- FETCH DATA
    const fetchReport = async (customPage = page, customLimit = limit) => {
        setIsLoading(true); // Bật loading
        const res = await dispatch(
            getReportTrackingOrder({
                templateSurveyID: selectedTemplateSurvey,
                page: customPage,
                limit: customLimit
            })
        );

        if (res.payload?.message) {
            toast.error(res.payload?.message || "Lỗi tải dữ liệu");
            setIsLoading(false);
            return null;
        } else {
            setTotalParticipants(res.payload.data.totalSurveys);
            setIsLoading(false);
            return res.payload.data;
        }
    };

    useEffect(() => {
        const fetchPendingSurveys = async () => {
            const res = await dispatch(getTemplateTrackingTeacher({ typeTemplate: 2 }));

            if (res.message) {
                toast.error(res.message);
            }
        };

        fetchPendingSurveys();
    }, [dispatch]);

    // ----------------------------------------------------------- CRUD
    useEffect(() => {
        if (selectedTemplateSurvey !== 0) {
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

    // Hàm mở modal tự luận
    const handleOpenComments = (row) => {
        setCurrentComments(row.lstComment || []);
        setSelectedQuestionTitle(row.TitleCriteriaEvaluation);
        setShowCommentModal(true);
    };

    // ----------------------------------- EXPORT EXCEL FULL DATA
    const handleExportExcel = async () => {
        if (!TrackingOrderTotal || TrackingOrderTotal === 0) {
            toast.warning("Không có dữ liệu để xuất");
            return;
        }

        setIsExporting(true);

        try {
            // 1. Lấy toàn bộ dữ liệu báo cáo
            const fullData = await fetchReport(1, TrackingOrderTotal);

            if (!fullData || !fullData.data || fullData.data.length === 0) {
                toast.warning("Không thể lấy dữ liệu đầy đủ");
                setIsExporting(false);
                return;
            }

            // 2. Nhóm dữ liệu và chuẩn bị danh sách tiêu chí đang chọn
            const fullGroupedData = groupDataByQuestion(fullData.data);
            const activeCriteria = EvaluationOrderList.filter(c => selectedCriteria.includes(c.EvaluationID));

            // 3. Xây dựng cấu trúc mảng các mảng (AOA) cho Excel
            // Header row
            const header = ["STT", "Nội dung câu hỏi", ...activeCriteria.map(c => c.EvaluationName)];
            const rows = [header];
            const merges = [];

            fullGroupedData.forEach((row, index) => {
                const rowIndex = rows.length; // Chỉ số dòng hiện tại (bắt đầu từ 0)
                const rowData = [
                    index + 1,
                    row.TitleCriteriaEvaluation
                ];

                if (row.TypeCriteria === 2) {
                    // TRƯỜNG HỢP TỰ LUẬN: Đưa thông báo vào cột C (index 2)
                    rowData.push(`Có ${row.lstComment?.length || 0} người khảo sát nội dung này`);

                    // Thêm lệnh merge: từ cột index 2 đến hết các cột tiêu chí
                    merges.push({
                        s: { r: rowIndex, c: 2 },
                        e: { r: rowIndex, c: 2 + activeCriteria.length - 1 }
                    });
                } else {
                    // TRƯỜNG HỢP TRẮC NGHIỆM: Điền số liệu từng cột
                    activeCriteria.forEach(c => {
                        const evalData = row.lstEvalutionTracking?.find(e => e.EvaluationID === c.EvaluationID);
                        rowData.push(evalData ? evalData.NumberTracking : 0);
                    });
                }
                rows.push(rowData);
            });

            // 4. Thêm dòng tổng kết quả
            rows.push([]); // Dòng trống cách quãng
            const totalRowIdx = rows.length;
            rows.push(["TỔNG SỐ NGƯỜI KHẢO SÁT:", "", fullData.totalSurveys || totalParticipants]);

            // Merge chữ "TỔNG SỐ..." ở 2 ô đầu của dòng cuối
            merges.push({
                s: { r: totalRowIdx, c: 0 },
                e: { r: totalRowIdx, c: 1 }
            });

            // 5. Khởi tạo Worksheet và Workbook
            const worksheet = XLSX.utils.aoa_to_sheet(rows);

            // Gán mảng merges vào worksheet
            worksheet['!merges'] = merges;

            // Định dạng độ rộng cột
            worksheet['!cols'] = [
                { wch: 6 },   // STT
                { wch: 60 },  // Nội dung câu hỏi
                ...activeCriteria.map(() => ({ wch: 15 })) // Các cột tiêu chí
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Báo cáo");

            // Xuất file
            const fileName = `Bao_cao_khao_sat_khac_${new Date().getTime()}.xlsx`;
            XLSX.writeFile(workbook, fileName);

            toast.success(`Đã xuất ${fullGroupedData.length} câu hỏi thành công`);
        } catch (error) {
            console.error("Export error:", error);
            toast.error('Lỗi khi xuất file Excel');
        } finally {
            setIsExporting(false);
        }
    };

    // Xuất các comment trong modal ra Excel
    const exportCommentsToExcel = async () => {
        if (!currentComments || currentComments.length === 0) {
            toast.warning("Không có phản hồi để xuất");
            return;
        }

        setIsExporting(true);
        try {
            const data = currentComments.map((c, i) => ({
                STT: i + 1,
                "Nội dung phản hồi": typeof c === 'object' ? (c.ContentAnswer || '') : c,
                "Người khảo sát": (c && c.UserComment) || '',
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            worksheet['!cols'] = [
                { wch: 5 },
                { wch: 80 },
                { wch: 30 },
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'PhanHoi');

            const safeTitle = (selectedQuestionTitle || 'phan_hoi').replace(/[\\/:*?"<>|]/g, '_').slice(0, 80);
            XLSX.writeFile(workbook, `${safeTitle}_phan_hoi_${new Date().getTime()}.xlsx`);
            toast.success(`Đã xuất ${data.length} phản hồi thành công`);
        } catch (err) {
            console.error('Export comments error:', err);
            toast.error('Lỗi khi xuất phản hồi');
        } finally {
            setIsExporting(false);
        }
    };

    // --------------------------------------------------------- LOGIC HIỂN THỊ CỘT
    const [selectedCriteria, setSelectedCriteria] = useState([]);

    useEffect(() => {
        if (EvaluationOrderList.length > 0) {
            setSelectedCriteria(EvaluationOrderList.map(item => item.EvaluationID));
        }
    }, [EvaluationOrderList]);

    // Hàm gộp dữ liệu (tách riêng để tái sử dụng)
    const groupDataByQuestion = (dataList) => {
        if (!dataList || dataList.length === 0) return [];

        const groups = dataList.reduce((acc, current) => {
            const key = current.TitleCriteriaEvaluation;

            if (!acc[key]) {
                acc[key] = {
                    ...current,
                    lstEvalutionTracking: JSON.parse(JSON.stringify(current.lstEvalutionTracking || []))
                };
            } else {
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
    };

    // Gộp các câu hỏi trùng nhau cho trang hiện tại
    const groupedReportList = useMemo(() => {
        return groupDataByQuestion(TrackingOrderList);
    }, [TrackingOrderList]);

    const totalPages = Math.ceil(TrackingOrderTotal / limit);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-0xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <BarChart3 className="text-[#0081cd]" />
                            Báo cáo kết quả khảo sát khác
                        </h1>
                        <p className="text-gray-500 text-sm">Xem thống kê chi tiết theo các tiêu chí đánh giá</p>
                    </div>
                </div>

                {/* BỘ LỌC */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200 items-end">
                    <div className="flex flex-col gap-1 md:col-span-6">
                        <label className="text-xs font-bold text-gray-600 uppercase">Mẫu khảo sát</label>
                        <DropdownSearch
                            options={TemplateTrackingTeacherList}
                            placeholder="------ chọn mẫu khảo sát ------"
                            labelKey="Title"
                            valueKey="TemplateSurveyID"
                            onChange={(e) => setSelectedTemplateSurvey(e.TemplateSurveyID)}
                        />
                    </div>

                    <div className="md:col-span-4 flex gap-2 h-full items-end">
                        <button
                            className="flex-1 bg-[#0081cd] hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-sm"
                            onClick={handleSearch}
                        >
                            <Search size={16} />
                            <span className="whitespace-nowrap">Tìm kiếm</span>
                        </button>

                        <button
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm
                                 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-teal-600"
                            onClick={handleExportExcel}
                            title="Xuất Excel"
                            disabled={isLoading || isExporting || selectedTemplateSurvey === 0 || TrackingOrderTotal === 0}
                        >
                            {isExporting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="whitespace-nowrap">Đang xuất...</span>
                                </>
                            ) : (
                                <>
                                    <FileDown size={16} />
                                    <span className="whitespace-nowrap">Xuất Excel</span>
                                </>
                            )}
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
                        {EvaluationOrderList.map(item => (
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
                                    {EvaluationOrderList.filter(c => selectedCriteria.includes(c.EvaluationID)).map(c => (
                                        <th key={c.EvaluationID} className="p-4 text-sm font-bold text-center text-[#026aa8] bg-blue-50/50 w-20">
                                            {c.EvaluationName}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={selectedCriteria.length + 2} className="p-20 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-10 h-10 border-4 border-[#0081cd] border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-500 font-medium">Đang lấy dữ liệu báo cáo...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {groupedReportList.length > 0 ? (
                                            <>
                                                {groupedReportList.map((row, index) => (
                                                    <tr key={row.EvaluationID || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                        <td className="p-4 text-sm text-gray-600">{(page - 1) * limit + index + 1}</td>
                                                        <td className="p-4 text-sm font-medium">
                                                            {row.TypeCriteria === 2 ? (
                                                                /* Nếu là tự luận -> Cho phép bấm vào để xem chi tiết */
                                                                <button
                                                                    onClick={() => handleOpenComments(row)}
                                                                    className="text-blue-600 hover:text-blue-800 hover:underline text-left flex items-center gap-1 group/link"
                                                                    title="Bấm để xem danh sách ý kiến phản hồi"
                                                                >
                                                                    {row.TitleCriteriaEvaluation}
                                                                </button>
                                                            ) : (
                                                                /* Nếu là trắc nghiệm -> Chỉ hiện text bình thường */
                                                                <span className="text-gray-800">{row.TitleCriteriaEvaluation}</span>
                                                            )}
                                                        </td>

                                                        {row.TypeCriteria === 2 ? (
                                                            /* TRƯỜNG HỢP CÂU HỎI TỰ LUẬN: Merge các cột đánh giá */
                                                            <td
                                                                colSpan={selectedCriteria.length}
                                                                className="p-4 text-sm text-center text-blue-600 bg-blue-50/40 italic font-semibold"
                                                            >
                                                                Có {row.lstComment.length} người khảo sát nội dung này
                                                            </td>
                                                        ) : (
                                                            /* TRƯỜNG HỢP CÂU HỎI TRẮC NGHIỆM */
                                                            <>
                                                                {EvaluationOrderList.filter(c => selectedCriteria.includes(c.EvaluationID)).map(c => {
                                                                    const evaluationData = row.lstEvalutionTracking?.find(e => e.EvaluationID === c.EvaluationID);
                                                                    return (
                                                                        <td key={c.EvaluationID} className="p-4 text-sm text-center text-gray-600">
                                                                            {evaluationData ? evaluationData.NumberTracking : 0}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}

                                                {/* HÀNG TỔNG SỐ NGƯỜI KHẢO SÁT */}
                                                <tr className="bg-blue-50 font-bold">
                                                    <td colSpan={2} className="p-4 text-sm text-[#0081cd] text-right uppercase">
                                                        Tổng số người khảo sát:
                                                    </td>
                                                    <td colSpan={selectedCriteria.length} className="p-4 text-lg text-[#0081cd] text-center">
                                                        {totalParticipants} <span className="text-sm font-normal text-gray-500">(người)</span>
                                                    </td>
                                                </tr>
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan={selectedCriteria.length + 2} className="p-8 text-center text-gray-400 italic">
                                                    Không có dữ liệu hiển thị.
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* SECTION 4: PHÂN TRANG */}
                    {totalPages > 0 && (
                        <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                    let pageNumber;
                                    if (totalPages <= 5) {
                                        pageNumber = i + 1;
                                    } else if (page <= 3) {
                                        pageNumber = i + 1;
                                    } else if (page >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + i;
                                    } else {
                                        pageNumber = page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setPage(pageNumber)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${page === pageNumber
                                                ? 'bg-[#0081cd] text-white shadow-md'
                                                : 'hover:bg-white border border-transparent hover:border-gray-300'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}

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
                                <span className="text-sm text-gray-600">trên tổng số {TrackingOrderTotal} dòng</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL CHI TIẾT CÂU TRẢ LỜI TỰ LUẬN */}
            {showCommentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">

                        {/* Header Modal */}
                        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                            <div className="pr-8">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    Chi tiết ý kiến phản hồi
                                </h3>
                                <p className="text-sm text-gray-50 font-medium bg-blue-600 px-2 py-0.5 rounded mt-2 inline-block">
                                    {selectedQuestionTitle}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCommentModal(false)}
                                className="p-2 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full transition-all"
                            >
                                <X size={24} className="rotate-90 md:rotate-0" />
                            </button>
                        </div>

                        {/* Body: Danh sách câu trả lời */}
                        <div className="p-6 overflow-y-auto space-y-4 bg-white">
                            {currentComments && currentComments.length > 0 ? (
                                currentComments.map((comment, i) => (
                                    <div key={comment.SurveyID || i} className="group flex gap-4 p-4 bg-gray-50 hover:bg-blue-50/50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200">
                                        {/* Số thứ tự */}
                                        <div className="flex-shrink-0 w-8 h-8 bg-white border border-gray-200 text-gray-600 group-hover:text-blue-600 group-hover:border-blue-300 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm">
                                            {i + 1}
                                        </div>

                                        {/* Nội dung phản hồi */}
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                                {/* Fix lỗi render Object bằng cách truy cập đúng key */}
                                                {typeof comment === 'object'
                                                    ? (comment.ContentAnswer || "Không có nội dung câu trả lời")
                                                    : comment}
                                            </div>

                                            {comment.UserComment && (
                                                <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                                                    <p className="text-xs text-blue-600 font-medium italic">
                                                        Người khảo sát: <span className="text-gray-500 font-normal">{comment.UserComment}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20">
                                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="text-gray-300" size={30} />
                                    </div>
                                    <p className="text-gray-400 font-medium">Chưa có dữ liệu phản hồi cho câu hỏi này.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                Tổng số: {currentComments?.length || 0} phản hồi
                            </span>
                            <div>
                                <button
                                    onClick={exportCommentsToExcel}
                                    disabled={isExporting || !(currentComments && currentComments.length > 0)}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isExporting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Đang xuất...</span>
                                        </>
                                    ) : (
                                        <span>Xuất Excel</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackingOrder;