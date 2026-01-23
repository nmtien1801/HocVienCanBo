import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyNotification from '../../components/NotifySurvey.jsx';
import { getTemplateSurveyForClient } from '../../redux/surveySlice.js'
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { getListByType } from '../../redux/learningClassSlice.js';

export default function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // state khảo sát chưa điền
    const [showSurvey, setShowSurvey] = useState(true);
    const { TemplateSurveyForClientList } = useSelector((state) => state.survey);
    const [classTypeID, setClassTypeID] = useState(2);

    useEffect(() => {
        // Fetch danh sách khảo sát chưa điền
        const fetchPendingSurveys = async () => {
            const res = await dispatch(getTemplateSurveyForClient());

            if (res.message) {
                toast.error(res.message);
            }
        };

        fetchPendingSurveys();
    }, []);

    useEffect(() => {
        // Fetch danh sách lớp theo hệ đào tạo
        const fetchListByType = async () => {
            let res = await dispatch(getListByType(classTypeID));

        };

        fetchListByType();
    }, [classTypeID]);

    // --------------------------------------- CRUD
    const handleNavigateToLogin = (type) => {
        if (type === 'chinh-tri') {
            navigate('/loginTC');
        } else {
            navigate('/loginHBD');
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/bg-main.jpg')",
                }}
            >
                {/* Overlay trắng đậm dần từ trên xuống dưới */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-gray-800/60"></div>
            </div>

            {/* Content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
                {/* Logo and Title */}
                <div className="text-center mb-12">
                    <div className="mb-6">
                        <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
                            <img
                                src="/logo.png"
                                alt="logo"
                                className="w-full h-full object-contain "
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-red-600 mb-2 drop-shadow-lg">
                        HỌC VIỆN CÁN BỘ
                    </h1>
                    <h2 className="text-3xl font-bold text-red-600 drop-shadow-lg">
                        THÀNH PHỐ HỒ CHÍ MINH
                    </h2>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 mb-16">
                    <button
                        onClick={() => handleNavigateToLogin('chinh-tri')}
                        className="group relative px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-white cursor-pointer"
                    >
                        {/* Sửa: Thêm class z-10 vào thẻ span */}
                        <span className="relative z-10">TRUNG CẤP LÝ LUẬN CHÍNH TRỊ</span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    <button
                        onClick={() => handleNavigateToLogin('ngan-han')}
                        className="group relative px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-white cursor-pointer"
                    >
                        {/* Sửa: Thêm class z-10 vào thẻ span */}
                        <span className="relative z-10">HỆ BỒI DƯỠNG NGẮN HẠN</span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>

                {/* Contact Information */}
                <div className="text-white text-sm max-w-4xl bg-black/30 backdrop-blur-sm rounded-xl p-7 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        {/* Cơ sở chính */}
                        <div className="space-y-2">
                            <p className="font-semibold text-base text-blue-400">Cơ sở chính</p>
                            <p className="font-normal">324 Chu Văn An, phường Bình Thạnh</p>
                            <p>
                                Điện thoại: <span className="font-semibold">(028) 38.412.405</span>
                            </p>
                            <p>
                                Email: <span className="font-semibold text-blue-300">hocviencanbo@tphcm.gov.vn</span> - Fax: <span className="font-semibold">(028) 38.412.495</span>
                            </p>
                        </div>

                        {/* Cơ sở phụ */}
                        <div className="space-y-2">
                            <p className="font-semibold text-base text-blue-400">Cơ sở phụ</p>
                            <p className="font-normal">Trung tâm Đào tạo, bồi dưỡng nghiệp vụ và ngoại ngữ 146 Võ Thị Sáu, phường Xuân Hòa</p>
                            <p>
                                Điện thoại: <span className="font-semibold">(028) 38.295.589</span>
                            </p>
                        </div>

                        {/* Cơ sở 2 */}
                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <p className="font-semibold text-base text-blue-400">Cơ sở 2</p>
                            <p className="font-normal">đường 30/4, phường Thủ Dầu Một</p>
                            <p>
                                Điện thoại: <span className="font-semibold">(0274) 3.822.511</span>
                            </p>
                        </div>

                        {/* Cơ sở 3 */}
                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <p className="font-semibold text-base text-blue-400">Cơ sở 3</p>
                            <p className="font-normal">số 13 đường Trường Chinh, phường Bà Rịa</p>
                            <p>
                                Điện thoại: <span className="font-semibold">(0254) 3.852.966</span>
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {showSurvey && (
                <SurveyNotification
                    surveys={TemplateSurveyForClientList}
                    onClose={() => setShowSurvey(false)}
                    onNavigate={(stateData) =>
                        navigate(`/survey-client-detail?id=${stateData.SurveyID}&submit=false`, { state: { apiResponse: stateData } })
                    }
                    classTypeID={classTypeID} setClassTypeID={setClassTypeID}
                />
            )}
        </div>
    );
}