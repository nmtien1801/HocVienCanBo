import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSurveySubjectByStudentID } from "../../redux/surveySlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SurveyPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { SurveysByStudentList } = useSelector((state) => state.survey);

    const [activeTab, setActiveTab] = useState("not-surveyed"); // 'not-surveyed' | 'surveyed'

    useEffect(() => {
        const fetchSurveyByID = async () => {
            const res = await dispatch(
                getSurveySubjectByStudentID({ page: 1, limit: 20 })
            );

            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message);
            }
        };

        fetchSurveyByID();
    }, [dispatch]);

    // Map dữ liệu
    const allItems =
        SurveysByStudentList?.map((item) => ({
            SurveyID: item.SurveyID,
            TemplateSurveyName: item.TemplateSurveyName,
            SubjectCode: item.SubjectCode,
            SubjectName: item.SubjectName,
            TeacherName: item.TeacherName,
            isCompleted: item.StatusID_Survey === true,
        })) || [];

    // Lọc theo tab
    const displayList = allItems.filter((item) =>
        activeTab === "surveyed" ? item.isCompleted : !item.isCompleted
    );

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 lg:py-8 lg:px-6">
            <div className="max-w-0xl mx-auto">
                {/* Header */}
                <h1 className="text-xl md:text-2xl text-gray-600 mb-6">
                    Khảo sát sự kiện
                </h1>

                {/* Body */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Tabs */}
                        <div className="px-6 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab("not-surveyed")}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${activeTab === "not-surveyed"
                                        ? "border-[#337ab7] text-[#337ab7]"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    Chưa khảo sát
                                </button>

                                <button
                                    onClick={() => setActiveTab("surveyed")}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${activeTab === "surveyed"
                                        ? "border-[#337ab7] text-[#337ab7]"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                                    Không có dữ liệu{" "}
                                    {activeTab === "surveyed"
                                        ? "đã khảo sát"
                                        : "chưa khảo sát"}
                                    .
                                </div>
                            ) : (
                                displayList.map((item, index) => {
                                    const isLast = index === displayList.length - 1;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                navigate(
                                                    `/notification-detail?id=${item.SurveyID}`
                                                )
                                            }
                                            className={`group cursor-pointer rounded transition hover:bg-gray-50 px-2
                        ${!isLast
                                                    ? "border-b border-dashed border-gray-400 pb-4 mb-4"
                                                    : "pb-2"
                                                }
                      `}
                                        >
                                            <div className="flex-1">
                                                {/* Tiêu đề */}
                                                <h3 className="font-semibold text-[#337ab7] text-sm mb-1 transition-colors group-hover:text-gray-800">
                                                    {item.TemplateSurveyName} - {item.SubjectCode} -{" "}
                                                    {item.SubjectName}{" "}
                                                    <span className="text-red-600 font-semibold">
                                                        (Bắt buộc)
                                                    </span>
                                                </h3>

                                                {/* Giảng viên */}
                                                <div className="font-semibold text-[#337ab7] text-sm transition-colors group-hover:text-gray-800">
                                                    Giảng viên: {item.TeacherName}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
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
