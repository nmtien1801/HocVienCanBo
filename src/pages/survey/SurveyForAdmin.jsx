import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSurveyForAdministrator, resetSurvey } from "../../redux/surveySlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DropdownSearch from '../../components/FormFields/DropdownSearch.jsx';
import { getTemplateTrackingTeacher } from '../../redux/reportSlice.js'
import { formatDate } from "../../utils/constants.js";

export default function SurveyTeacher() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { SurveysForAdministratorList, SurveysForAdministratorTotal } = useSelector((state) => state.survey);
    const { TemplateTrackingTeacherList } = useSelector((state) => state.report);

    const [activeTab, setActiveTab] = useState("surveyedOther");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTemplateSurvey, setSelectedTemplateSurvey] = useState(0);
    const [dropdownKey, setDropdownKey] = useState(Date.now());

    const pageSize = 20;

    // --------------------------------------- Fetch Template List 
    useEffect(() => {
        const fetchTemplateList = async () => {
            const type = activeTab === "surveyedOther" ? 1 : 2;
            const res = await dispatch(getTemplateTrackingTeacher({ typeTemplate: type }));

            if (res?.payload?.message) {
                toast.error(res.payload.message);
            }
        };

        fetchTemplateList();
        setSelectedTemplateSurvey(0);
    }, [dispatch, activeTab]);

    // --------------------------------------- Fetch Survey Data
    useEffect(() => {
        const fetchSurveyData = async () => {
            const type = activeTab === "surveyedOther" ? 1 : 2;
            if (selectedTemplateSurvey > 0) {
                const res = await dispatch(
                    getSurveyForAdministrator({
                        typeTemplate: type,
                        templateSurveyID: selectedTemplateSurvey,
                        page: currentPage,
                        limit: pageSize
                    })
                );

                if (!res?.payload?.data) {
                    toast.error(res?.payload?.message || "Không thể tải dữ liệu");
                }
            }

        };

        fetchSurveyData();
    }, [dispatch, currentPage, activeTab, selectedTemplateSurvey]);

    // --------------------------------------- Handle Tab Change
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setCurrentPage(1);
        setSelectedTemplateSurvey(0);
        setDropdownKey(Date.now());
        dispatch(resetSurvey());
    };

    // --------------------------------------- Handle Template Change
    const handleTemplateChange = (template) => {
        const id = template?.TemplateSurveyID || 0;
        setSelectedTemplateSurvey(id);
        setCurrentPage(1);
    };

    // --------------------------------------- Handle Detail Survey
    const handleDetailSurvey = async (item) => {
        try {
            if (item.SurveyID !== null) {
                navigate(`/survey-detail?id=${item.SurveyID}&submit=true`);
                return;
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xử lý khảo sát");
            console.error("Error in handleDetailSurvey:", error);
        }
    };

    // --------------------------------------- Pagination Logic
    const totalPages = SurveysForAdministratorTotal ? Math.ceil(SurveysForAdministratorTotal / pageSize) : 1;

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --------------------------------------- Render
    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 lg:py-8 lg:px-6">
            <div className="max-w-0xl mx-auto">
                {/* Header với Select */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h1 className="text-xl md:text-2xl text-gray-600">
                        Lịch sử khảo sát Người dùng
                    </h1>

                    <div className="flex items-center gap-3 p-2 ">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Mẫu khảo sát:
                        </label>
                        <div className="w-64 md:w-80"> {/* Giới hạn độ rộng của dropdown */}
                            <DropdownSearch
                                key={dropdownKey}
                                options={TemplateTrackingTeacherList || []}
                                placeholder="------ chọn mẫu khảo sát ------"
                                labelKey="Title"
                                valueKey="TemplateSurveyID"
                                onChange={handleTemplateChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Tabs */}
                        <div className="px-6 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => handleTabChange("surveyedOther")}
                                    className={`py-4 px-1 border-b-2 text-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === "surveyedOther"
                                        ? "border-[#337ab7] text-[#337ab7] font-bold"
                                        : "border-transparent text-gray-500 font-medium hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    Khảo sát Giảng viên
                                </button>

                                <button
                                    onClick={() => handleTabChange("surveyedTeacher")}
                                    className={`py-4 px-1 border-b-2 text-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === "surveyedTeacher"
                                        ? "border-[#337ab7] text-[#337ab7] font-bold"
                                        : "border-transparent text-gray-500 font-medium hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    Khảo sát khác
                                </button>
                            </nav>
                        </div>

                        {/* Survey List */}
                        <div className="p-6 space-y-4">
                            {!SurveysForAdministratorList || SurveysForAdministratorList.length === 0 ? (
                                <div className="text-center text-gray-500 py-8 text-sm italic">
                                    Không có dữ liệu {activeTab === "surveyedOther" ? "khảo sát giảng viên" : "khảo sát khác"}.
                                </div>
                            ) : (
                                SurveysForAdministratorList.map((item, index) => (
                                    <div
                                        key={item.SurveyID || `survey-${index}`}
                                        onClick={() => handleDetailSurvey(item)}
                                        className={`group cursor-pointer rounded transition hover:bg-gray-50 px-2 ${index !== SurveysForAdministratorList.length - 1
                                            ? "border-b border-dashed border-gray-400 pb-4 mb-4"
                                            : "pb-2"
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[#337ab7] text-sm mb-1 transition-colors group-hover:text-gray-800">
                                                {item.Title}
                                                {" "}
                                            </h3>
                                            {item.TeacherName ? (
                                                <div className="font-semibold text-[#337ab7] text-sm transition-colors group-hover:text-gray-800">
                                                    Giảng viên: {item.TeacherName} - <span className="text-red-600 font-semibold">Ngày tạo: {formatDate(item.DateCreated)}</span>
                                                </div>

                                            ) : <div className="font-semibold text-[#337ab7] text-sm transition-colors group-hover:text-gray-800">
                                                Người khảo sát: {item.StudentName || item.Name || item.FullName} - <span className="text-red-600 font-semibold">Ngày tạo: {formatDate(item.DateCreated)}</span>
                                            </div>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {SurveysForAdministratorTotal > pageSize && (
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
            </div>
        </div>
    );
}