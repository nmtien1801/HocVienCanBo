import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getReportTrackingOther } from "../../redux/reportSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SurveyTeacher() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { ReportOtherList, ReportOtherTotal } = useSelector((state) => state.report);

    // --- 1. State cho phân trang ---
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
console.log('ssssss ', ReportOtherList);

    // --------------------------------------- Initial
    useEffect(() => {
        const fetchSurveyOther = async () => {
            const res = await dispatch(
                getReportTrackingOther({ page: currentPage, limit: pageSize })
            );

            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message || "Không thể tải danh sách");
            }
        };

        fetchSurveyOther();
    }, [dispatch, currentPage]);

    // -------------------------------------------------- Action
    const handleDetailSurvey = (item) => {
        // Vì là danh sách đã khảo sát, item.SurveyID luôn có giá trị
        navigate(`/survey-detail?id=${item.SurveyID}&submit=true`);
    }

    const totalPages = ReportOtherTotal ? Math.ceil(ReportOtherTotal / pageSize) : 1;

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 lg:px-8">
            <div className="max-w-0xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Lịch sử khảo sát của bạn
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Danh sách các phiếu khảo sát bạn đã hoàn thành</p>
                    </div>
                </div>

                {/* Body */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-0">
                        {ReportOtherList.length === 0 ? (
                            <div className="text-center text-gray-400 py-16">
                                <div className="text-5xl mb-4">📋</div>
                                <p className="italic">Bạn chưa có phiếu khảo sát nào đã hoàn thành.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {ReportOtherList.map((item, index) => (
                                    <div
                                        key={item.SurveyID || index}
                                        onClick={() => handleDetailSurvey(item)}
                                        className="group p-5 cursor-pointer transition-all hover:bg-blue-50/40 flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[#337ab7] text-base mb-1 group-hover:text-blue-700 transition-colors">
                                                {item.TemplateSurveyName}
                                            </h3>
                                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                                                <p><span className="text-gray-400 font-medium">Mã môn:</span> {item.SubjectCode}</p>
                                                <p><span className="text-gray-400 font-medium">Môn học:</span> {item.SubjectName}</p>
                                                <p><span className="text-gray-400 font-medium">Giảng viên:</span> {item.TeacherName}</p>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex flex-col items-end gap-2">
                                            <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold">
                                                Đã nộp
                                            </span>
                                            <span className="text-xs text-blue-500 font-medium group-hover:underline">Xem chi tiết →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Phân trang */}
                    {ReportOtherTotal > pageSize && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Trang <span className="font-semibold">{currentPage}</span> / {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-[10px] text-gray-400 tracking-widest uppercase">
                    Copyright © 2023 G&BSoft
                </div>
            </div>
        </div>
    );
}