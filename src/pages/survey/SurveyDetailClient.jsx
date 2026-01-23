import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ApiSurvey from '../../apis/ApiSurvey.js'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";

// --- Sub-Component: Một dòng câu hỏi ---
const QuestionRow = ({ stt, question, lstEvaluations, values, onChange, onChangeFeedback }) => {
    if (question.TypeCriteria === 1) {
        // TypeCriteria: yes/no
        return (
            <div className="mb-6 border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors rounded p-2">
                <p className="font-semibold text-gray-800 mb-3 text-sm md:text-base">
                    {stt} . {question.TitleCate}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 ml-2">
                    {lstEvaluations.map((opt, index) => {
                        const letter = String.fromCharCode(65 + index);

                        return (
                            <label
                                key={opt.EvaluationID}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="radio"
                                    name={`question_${question.SurveyAnswerID}`}
                                    value={opt.EvaluationID}
                                    checked={values[question.SurveyAnswerID]?.EvaluationID === opt.EvaluationID}
                                    onChange={() => onChange(question.SurveyAnswerID, opt.EvaluationID, opt.EvaluationName)}
                                    className="w-4 h-4 text-[#026aa8] border-gray-300 focus:ring-[#026aa8] focus:ring-offset-0 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-[#026aa8] transition-colors">
                                    {letter}. {opt.EvaluationName}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    } else {
        return (
            <>
                <p className="font-semibold text-gray-800 mb-3 text-sm md:text-base">
                    {stt} . {question.TitleCate}
                </p>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#026aa8] focus:border-[#026aa8] focus:outline-none transition-shadow text-sm"
                    rows="4"
                    placeholder="Nhập ý kiến của bạn tại đây..."
                    value={values[question.SurveyAnswerID]?.ContentAnswer || ""}
                    onChange={(e) => onChangeFeedback(question.SurveyAnswerID, e.target.value)}
                />
            </>
        );
    }
};

// --- Main Component ---
export default function SurveyDetailClient() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isSubmit = searchParams.get('submit')?.toLowerCase() === 'true';
    const [surveyData, setSurveyData] = useState([]);
    const [surveyCates, setSurveyCates] = useState([]);
    const [lstEvaluations, setLstEvaluations] = useState([]);

   

    // ---------------------------------------------- lấy chi tiết phiếu khảo sát
    // chọn khi đã khảo sát
    const normalizeSavedAnswers = (lstSurveyCates) => {
        const initialAnswers = {};

        lstSurveyCates.forEach(section => {
            section.lstSurveyAnswers.forEach(q => {
                // Kiểm tra xem câu hỏi này đã có câu trả lời (IsAnswer: true) chưa
                if (q.IsAnswer === true) {
                    // LƯU Ý: Dữ liệu API có thể có SurveyAnswerID, EvaluationID, và ContentAnswer ngay trên đối tượng Q
                    initialAnswers[q.SurveyAnswerID] = {
                        EvaluationID: q.EvaluationID,
                        ContentAnswer: q.ContentAnswer
                    };
                }
            });
        });
        return initialAnswers;
    };

    // fetch data
    useEffect(() => {
        const fetchSurveyByID = async () => {
            const idDetail = searchParams.get('id');
            let res = await ApiSurvey.getSurveyByIDApi(idDetail)

            setSurveyData(res.data);
            setSurveyCates(res.data.lstSurveyCates)
            setLstEvaluations(res.data.lstEvaluations)

            // >>> THÊM LOGIC NẠP CÂU TRẢ LỜI ĐÃ LƯU VÀO STATE ANSWERS <<<
            if (res.data.lstSurveyCates && res.data.lstSurveyCates.length > 0) {
                const savedAnswers = normalizeSavedAnswers(res.data.lstSurveyCates);
                setAnswers(savedAnswers);
            }

            if (res.Message) {
                toast.error(res.message);
            }
        };

        fetchSurveyByID();
    }, [dispatch, searchParams]);

    const [answers, setAnswers] = useState({});



    // ------------------------------------------------------------- CRUD
    const handleOptionChange = (qId, evaluationId, evaluationName) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: {
                EvaluationID: evaluationId,
                ContentAnswer: evaluationName
            }
        }));
    };

    // Sửa handler cho câu hỏi TypeCriteria !== 1 (textarea)
    const handleFeedbackChange = (qId, content) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: {
                EvaluationID: null, // hoặc 0 tùy backend yêu cầu
                ContentAnswer: content
            }
        }));
    };

    const handleSubmit = async () => {
        // --- BƯỚC 1: XÁC ĐỊNH CÁC CÂU HỎI BẮT BUỘC (RADIO BUTTONS) ---
        let requiredQIds = [];
        surveyCates.forEach(section => {
            section.lstSurveyAnswers.forEach(q => {
                if (q.TypeCriteria === 1) {
                    requiredQIds.push(String(q.SurveyAnswerID));
                }
            });
        });

        // --- BƯỚC 2: KIỂM TRA TẤT CẢ CÂU HỎI BẮT BUỘC ĐÃ ĐƯỢC TRẢ LỜI CHƯA ---
        const answeredQIds = Object.keys(answers);

        // Tìm các ID bắt buộc mà chưa có trong answers (chưa được trả lời)
        const unansweredQIds = requiredQIds.filter(qId => {
            return !answeredQIds.includes(qId);
        });

        if (unansweredQIds.length > 0) {
            toast.warning(`Vui lòng trả lời đầy đủ tất cả các câu hỏi đánh giá.`);
            return;
        }

        // --- BƯỚC 3: CHUYỂN ĐỔI VÀ GỬI DỮ LIỆU (Logic đã có) ---
        const surveyAnswers = Object.keys(answers)
            .map(qId => {
                const answerDetail = answers[qId];

                if (!answerDetail.ContentAnswer && answerDetail.EvaluationID === null) {
                    return null;
                }

                return {
                    SurveyAnswerID: parseInt(qId), // ID câu hỏi (từ key của answers)
                    EvaluationID: answerDetail.EvaluationID,
                    ContentAnswer: answerDetail.ContentAnswer,
                    IsAnswer: true,
                };
            })
            .filter(answer => answer !== null);

        // validate
        if (surveyAnswers.length === 0) {
            toast.warning("Phiếu khảo sát trống. Vui lòng trả lời.");
            return;
        }

        const postModel = {
            SurveyID: surveyData.SurveyID,
            lstSurveyAnswers: surveyAnswers
        };

        let res = await ApiSurvey.UpdateSurveyAnswerClientApi(postModel);
        if (res === true) {
            toast.success("Đã gửi khảo sát thành công!");
            navigate('/home');
        } else {
            toast.error(res.message || "Gửi khảo sát thất bại.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8 flex justify-center font-sans">
            <div className="max-w-0xl w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">

                {/* Header Phiếu: Dùng màu #026aa8 */}
                <div className="bg-white p-6 border-b-4 border-[#026aa8]">
                    <h1 className="text-xl md:text-2xl font-bold text-[#026aa8] text-center uppercase mb-4">
                        {surveyData.TemplateSurveyName}
                    </h1>
                    {/* Nền xanh nhạt: Dùng màu #026aa8 với độ trong suốt 5% */}
                    <div className="bg-[#026aa8]/5 p-4 rounded text-sm text-gray-700 text-justify leading-relaxed border border-[#026aa8]/20">
                        <p className="mb-2">
                            {surveyData.ShorDescription}
                        </p>
                    </div>
                </div>

                {/* Nội dung Khảo sát */}
                <div className="p-6 md:p-8">

                    <div className="mb-6">
                        {/* Border trái dùng màu #026aa8 */}
                        <h2 className="text-lg font-bold text-gray-800 border-l-4 border-[#026aa8] pl-3 mb-2">
                            {surveyData.Requiments}
                        </h2>
                        <p className="text-sm text-gray-800 italic pl-4">
                            Các bạn vui lòng khoanh tròn vào ô trả lời với sự lựa chọn thích hợp, tương ứng với từng mức độ đánh giá
                        </p>
                    </div>

                    {/* Render các phần câu hỏi */}
                    {surveyCates && surveyCates.length > 0 && surveyCates.map((section, index) => {
                        // 1. Xác định section cuối cùng
                        return (
                            <div key={index} className="mb-8">
                                <h3 className="font-bold text-[#026aa8] text-lg mb-3 bg-gray-50 p-2 rounded">
                                    {section.TitleCate}
                                </h3>
                                {section.subtitle && (
                                    <p className="text-sm font-semibold text-gray-600 mb-4 pl-2">
                                        {section.subtitle}
                                    </p>
                                )}

                                <div className="space-y-4 pl-2">
                                    {section.lstSurveyAnswers.map((q, index) => (
                                        <QuestionRow
                                            stt={index + 1}
                                            key={q.SurveyAnswerID}
                                            question={q}
                                            lstEvaluations={lstEvaluations}
                                            values={answers}
                                            onChange={handleOptionChange}
                                            onChangeFeedback={handleFeedbackChange}
                                            isSubmit={isSubmit}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Nút Submit */}
                    {isSubmit ?
                        <span className="text-red-600">Xin chân thành cảm ơn sự hợp tác của các bạn!</span>
                        :
                        <div className="flex justify-center md:justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition-colors" onClick={() => navigate('/home')}>
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-2 bg-[#026aa8] text-white font-bold rounded shadow hover:opacity-90 transition-all transform active:scale-95"
                            >
                                Gửi khảo sát
                            </button>
                        </div>
                    }

                </div>

                {/* Footer Thông tin liên hệ */}
                <div className="bg-gray-50 p-6 border-t border-gray-200 text-sm text-gray-700">
                    <h1 className="font-bold text-gray-700 mb-1">Phòng Khảo thí và Đảm bảo chất lượng</h1>
                    <p>Học viện cán bộ TP.HCM</p>
                    <p>324 Chu Văn An - Phường Bình Thạnh - TPHCM</p>
                    <p>Điện thoại: 02822437830 - 02822437838</p>
                </div>

            </div>
        </div>
    );
}