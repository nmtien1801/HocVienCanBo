import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSurveySubjectByStudentID } from "../../redux/surveySlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiSurvey from '../../apis/ApiSurvey.js'

export default function SurveyTeacher() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { SurveysByStudentList, SurveysByStudentTotal } = useSelector((state) => state.survey);

    const [activeTab, setActiveTab] = useState("not-surveyed");

    // --- 1. State cho phân trang ---
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // --------------------------------------- Initial
    useEffect(() => {
        // lấy phiếu khảo sát của học viên (bắt buộc nộp)
        const fetchSurveyByID = async () => {
            const res = await dispatch(
                getSurveySubjectByStudentID({ page: currentPage, limit: pageSize })
            );

            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message);
            }
        };

        fetchSurveyByID();
    }, [dispatch, currentPage]); // Thêm currentPage vào dependency

    // Lọc theo tab
    const displayList = SurveysByStudentList.filter((item) =>
        activeTab === "surveyed" ? item.StatusID_Survey : !item.StatusID_Survey
    );

    // -------------------------------------------------- Action
    const handleDetailSurvey = async (item) => {
        if (item.SurveyID !== null) {
            navigate(`/survey-detail?id=${item.SurveyID}&submit=${item.StatusID_Survey}`)
        } else {
            let payload = {
                ...item,
                Title: item.TemplateSurveyName
            }
            let res = await ApiSurvey.CreateSurveyTeacherApi(payload)

            if (res.message) {
                toast.error(res.message);
            } else {
                navigate(`/survey-detail?id=${res.SurveyID}&submit=${item.StatusID_Survey}`)
            }
        }
    }

    // --------------------------------------------------------- 3. Tính toán tổng số trang ---
    const totalPages = SurveysByStudentTotal ? Math.ceil(SurveysByStudentTotal / pageSize) : 1;

    // Hàm chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Scroll lên đầu khi chuyển trang
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 lg:py-8 lg:px-6">
            <div className="max-w-0xl mx-auto">
                {/* Header */}
                <h1 className="text-xl md:text-2xl text-gray-600 mb-6">
                    Khảo sát Giảng viên giảng dạy
                </h1>

                {/* Body */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Tabs */}
                        <div className="px-6 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab("not-surveyed")}
                                    className={`py-4 px-1 border-b-2 text-lg transition-all whitespace-nowrap ${activeTab === "not-surveyed"
                                            ? "border-[#337ab7] text-[#337ab7] font-bold" // Thêm font-bold ở đây
                                            : "border-transparent text-gray-500 font-medium hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    Chưa khảo sát
                                </button>

                                <button
                                    onClick={() => setActiveTab("surveyed")}
                                    className={`py-4 px-1 border-b-2 text-lg transition-all whitespace-nowrap ${activeTab === "surveyed"
                                            ? "border-[#337ab7] text-[#337ab7] font-bold" // Thêm font-bold ở đây
                                            : "border-transparent text-gray-500 font-medium hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    Đã khảo sát
                                </button>
                            </nav>
                        </div>

                        {/* Danh sách */}
                        <div className="p-6 space-y-4">
                            {displayList.length === 0 ? (
                                <div className="text-center text-gray-500 py-8 text-sm italic">
                                    Không có dữ liệu {activeTab === "surveyed" ? "đã khảo sát" : "chưa khảo sát"}.
                                </div>
                            ) : (
                                displayList.map((item, index) => {
                                    const isLast = index === displayList.length - 1;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleDetailSurvey(item)}
                                            className={`group cursor-pointer rounded transition hover:bg-gray-50 px-2 
                                                ${!isLast ? "border-b border-dashed border-gray-400 pb-4 mb-4" : "pb-2"}`}
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-[#337ab7] text-sm mb-1 transition-colors group-hover:text-gray-800">
                                                    {item.TemplateSurveyName} - {item.SubjectCode} - {item.SubjectName}{" "}
                                                    <span className="text-red-600 font-semibold">(Bắt buộc)</span>
                                                </h3>
                                                <div className="font-semibold text-[#337ab7] text-sm transition-colors group-hover:text-gray-800">
                                                    Giảng viên: {item.TeacherName}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* --- 4. Giao diện Phân trang (Pagination) --- */}
                        {SurveysByStudentTotal > pageSize && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 text-sm border rounded ${currentPage === 1
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                                            }`}
                                    >
                                        Trước
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 text-sm border rounded ${currentPage === totalPages
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                                            }`}
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-right text-xs text-gray-500">
                    Copyright © 2023 by G&BSoft
                </div>
            </div>
        </div>
    );
}