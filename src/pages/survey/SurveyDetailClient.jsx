import React, { useEffect, useState } from "react";
import ApiSurvey from '../../apis/ApiSurvey.js'
import ApiTemplateSurveys from '../../apis/ApiTemplateSurveys.js'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTemplateSurveyForClient } from '../../redux/surveySlice.js'
import { getTrainingSystemAddressByUserID } from '../../redux/learningClassSlice.js';
import { useSelector, useDispatch } from "react-redux";
import DropdownSearch from '../../components/FormFields/DropdownSearch.jsx';
import { toast } from "react-toastify";

// --- Sub-Component: Một dòng câu hỏi (Giữ nguyên logic của bạn) ---
const QuestionRow = ({ stt, question, lstEvaluations, values, onChange, onChangeFeedback }) => {
    if (question.TypeCriteria === 1) {
        return (
            <div className="mb-6 border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors rounded p-2">
                <p className="font-semibold text-gray-800 mb-3 text-sm md:text-base">
                    {stt} . {question.TitleCate}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 ml-2">
                    {lstEvaluations.map((opt, index) => {
                        const letter = String.fromCharCode(65 + index);
                        return (
                            <label key={opt.EvaluationID} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name={`question_${question.SurveyAnswerID}`}
                                    value={opt.EvaluationID}
                                    checked={values[question.SurveyAnswerID]?.EvaluationID === opt.EvaluationID}
                                    onChange={() => onChange(question.SurveyAnswerID, opt.EvaluationID, opt.EvaluationName)}
                                    className="w-4 h-4 text-[#026aa8] border-gray-300 focus:ring-[#026aa8] cursor-pointer"
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
            <div className="mb-6 p-2">
                <p className="font-semibold text-gray-800 mb-3 text-sm md:text-base">
                    {stt} . {question.TitleCate}
                </p>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#026aa8] outline-none text-sm"
                    rows="4"
                    placeholder="Nhập ý kiến của bạn tại đây..."
                    value={values[question.SurveyAnswerID]?.ContentAnswer || ""}
                    onChange={(e) => onChangeFeedback(question.SurveyAnswerID, e.target.value)}
                />
            </div>
        );
    }
};

export default function SurveyDetailClient() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { TemplateSurveyForClientList, ClassSurveyList, TrainingSystemAddress } = useSelector((state) => state.survey);
    const [survey, setSurvey] = useState([]);

    const [surveyData, setSurveyData] = useState(null);
    const [surveyCates, setSurveyCates] = useState([]);
    const [lstEvaluations, setLstEvaluations] = useState([]);
    const [answers, setAnswers] = useState({});

    const isSubmit = searchParams.get('submit')?.toLowerCase() === 'true';
    const templateSurveyID = searchParams.get('templateSurveyID');
    const [isInfoConfirmed, setIsInfoConfirmed] = useState(!isSubmit);
    const [classTypeID, setClassTypeID] = useState(searchParams.get('classTypeID') || '1');
    const [selectedClass, setSelectedClass] = useState('');

    const [userInfo, setUserInfo] = useState({
        FullName: '',
        Email: '',
        Phone: ''
    });

    // Thêm state cho trung cấp và bồi dưỡng
    const [trungCapInfo, setTrungCapInfo] = useState({
        Age: '',
        GenderID: '',
        Position: '',
        Office: '',
        Email: '',
        FullName: '',
        Phone: ''
    });

    const [boiDuongInfo, setBoiDuongInfo] = useState({
        FullName: '',
        Email: '',
        TimeStart: '',
        ClassName1: '',
        UnitName: '',
        Phone: '',
        Office: '',
        GenderID: '',
        Position: ''
    });

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchSurveyByID = async () => {
            const idDetail = searchParams.get('id');
            let res = await ApiSurvey.getSurveyByIDApi(idDetail);

            if (res.data) {
                setSurveyData(res.data);
                setSurveyCates(res.data.lstSurveyCates);
                setLstEvaluations(res.data.lstEvaluations);

                const saved = {};
                res.data.lstSurveyCates?.forEach(sec => {
                    sec.lstSurveyAnswers?.forEach(q => {
                        if (q.IsAnswer) saved[q.SurveyAnswerID] = { EvaluationID: q.EvaluationID, ContentAnswer: q.ContentAnswer };
                    });
                });
                setAnswers(saved);
            }
        };
        fetchSurveyByID();
    }, [searchParams]);

    useEffect(() => {
        // Fetch danh sách khảo sát chưa điền
        const fetchPendingSurveys = async () => {
            const res = await dispatch(getTemplateSurveyForClient());

            if (res.message) {
                toast.error(res.message);
            }
        };

        // Fetch mẫu khảo sát theo templateSurveyID
        const fetchTemplateSurveyID = async () => {
            const res = await ApiTemplateSurveys.getTemplateSurveyByIDApi(templateSurveyID)
            setSurvey(res.data);

            if (res.message) {
                toast.error(res.message);
            }
        };

        fetchPendingSurveys();
        fetchTemplateSurveyID();
    }, []);

    useEffect(() => {
        if (TrainingSystemAddress && classTypeID === 2) {
            setBoiDuongInfo(prev => ({
                ...prev,
                ClassName1: TrainingSystemAddress.ClassName1 || '',
                TimeStart: TrainingSystemAddress.TimeStart || '',
                UnitName: TrainingSystemAddress.UnitName || ''
            }));
        }
    }, [TrainingSystemAddress, classTypeID]);

    useEffect(() => {
        const fetchClassByType = async () => {
            if (selectedClass) {
                await dispatch(getTrainingSystemAddressByUserID(selectedClass));
            }
        };
        fetchClassByType();
    }, [selectedClass]);

    // Các hàm xử lý thay đổi (CẦN THIẾT)
    const handleOptionChange = (qId, evalId, evalName) => {
        setAnswers(prev => ({ ...prev, [qId]: { EvaluationID: evalId, ContentAnswer: evalName } }));
    };

    const handleFeedbackChange = (qId, content) => {
        setAnswers(prev => ({ ...prev, [qId]: { EvaluationID: null, ContentAnswer: content } }));
    };

    const handleTrungCapChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Age') {
            if (value === '' || (!isNaN(value) && Number(value) >= 18 && Number(value) <= 100)) {
                setTrungCapInfo(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setTrungCapInfo(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleBoiDuongChange = (e) => {
        const { name, value } = e.target;
        setBoiDuongInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmInfo = async () => {
        if (classTypeID === '1') {
            const { Age, GenderID, Position, Office } = trungCapInfo;
            if (!Age || !GenderID || !Position || !Office) {
                toast.warning("Vui lòng nhập đầy đủ thông tin hệ trung cấp.");
                return;
            }
        } else if (classTypeID === '2') {
            const { FullName, Email, TimeStart, ClassName1, UnitName } = boiDuongInfo;
            if (!FullName || !Email || !TimeStart || !ClassName1 || !UnitName) {
                toast.warning("Vui lòng nhập đầy đủ thông tin hệ bồi dưỡng.");
                return;
            }
        }

        setIsInfoConfirmed(true);

        const payload = {
            ...survey,
            ClassTypeID: classTypeID,
            TrainingSystemID: TrainingSystemAddress ? TrainingSystemAddress.TrainingSystemID : null,
            ClassID: selectedClass || null,
            UnitID: TrainingSystemAddress ? TrainingSystemAddress.UnitID : null,
            AddressID: TrainingSystemAddress ? TrainingSystemAddress.AddressID : null,
            ...(classTypeID === 2 ? boiDuongInfo : trungCapInfo)
        };

        let res = await ApiSurvey.CreateSurveyClientApi(payload);
        console.log('scsdcsd ', res);


        if (res.message) {
            toast.error(res.message);
        } else {
            setSurveyData(res);
            setSurveyCates(res.lstSurveyCates || []);
            setLstEvaluations(res.lstEvaluations || []);
            setAnswers({});
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        // Validate câu trả lời bắt buộc
        let requiredIds = [];
        surveyCates.forEach(sec => sec.lstSurveyAnswers.forEach(q => {
            if (q.TypeCriteria === 1) requiredIds.push(String(q.SurveyAnswerID));
        }));

        const unanswered = requiredIds.filter(id => !answers[id]);
        if (unanswered.length > 0) {
            toast.warning("Vui lòng trả lời đầy đủ các câu hỏi đánh giá.");
            return;
        }

        const payload = {
            SurveyID: surveyData.SurveyID,
            lstSurveyAnswers: Object.keys(answers).map(id => ({
                SurveyAnswerID: parseInt(id),
                ...answers[id],
                IsAnswer: true
            })),
            ...(isSubmit && (classTypeID === '1' ? trungCapInfo : boiDuongInfo))
        };

        let res = await ApiSurvey.UpdateSurveyAnswerClientApi(payload);
        if (res === true) {
            toast.success("Gửi khảo sát thành công!");
            navigate('/home');
        } else {
            toast.error(res.message || "Gửi khảo sát thất bại.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8 flex justify-center font-sans">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">

                {!isInfoConfirmed ? (
                    /* BƯỚC 1: FORM THÔNG TIN */
                    <div className="p-8 md:p-12 flex flex-col items-center bg-white">
                        <div className="w-20 h-20 bg-[#026aa8]/10 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-[#026aa8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>

                        <div className="max-w-md w-full text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Khảo sát ý kiến</h2>
                            <p className="text-gray-500 mt-2">Vui lòng cung cấp thông tin định danh để truy cập nội dung phiếu khảo sát</p>
                        </div>

                        {/* CHỌN HỆ ĐÀO TẠO */}
                        <div className="max-w-md w-full mb-6">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setClassTypeID('1')}
                                    className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition ${classTypeID === '1'
                                        ? 'bg-[#0081cd] text-white border-[#0081cd]'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    Hệ trung cấp
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setClassTypeID('2')}
                                    className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition ${classTypeID === '2'
                                        ? 'bg-[#0081cd] text-white border-[#0081cd]'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    Hệ bồi dưỡng
                                </button>
                            </div>
                        </div>

                        {/* FORM THEO HỆ */}
                        {classTypeID === '1' && (
                            <div className="max-w-md w-full space-y-4">
                                <p className="font-semibold text-gray-700 text-sm">Thông tin học viên (Hệ trung cấp)</p>
                                <input type="email" name="Email" placeholder="Email" value={trungCapInfo.Email} onChange={handleTrungCapChange} className="w-full border rounded-md p-2 text-sm" />
                                <div className="flex gap-2">
                                    <input type="number" name="Age" placeholder="Tuổi" min={18} max={100} value={trungCapInfo.Age} onChange={handleTrungCapChange} className="w-1/2 border rounded-md p-2 text-sm" />
                                    <select name="GenderID" value={trungCapInfo.GenderID} onChange={handleTrungCapChange} className="w-1/2 border rounded-md p-2 text-sm">
                                        <option value="">-- Giới tính --</option>
                                        <option value="1">Nam</option>
                                        <option value="2">Nữ</option>
                                    </select>
                                </div>
                                <input type="text" name="Position" placeholder="Chức vụ" value={trungCapInfo.Position} onChange={handleTrungCapChange} className="w-full border rounded-md p-2 text-sm" />
                                <input type="text" name="Office" placeholder="Cơ quan công tác" value={trungCapInfo.Office} onChange={handleTrungCapChange} className="w-full border rounded-md p-2 text-sm" />
                            </div>
                        )}

                        {classTypeID === '2' && (
                            <div className="max-w-md w-full space-y-4">
                                <p className="font-semibold text-gray-700 text-sm">Thông tin khóa học (Hệ bồi dưỡng)</p>
                                <input type="text" name="FullName" placeholder="Họ và tên" value={boiDuongInfo.FullName} onChange={handleBoiDuongChange} className="w-full border rounded-md p-2 text-sm" />
                                <input type="text" name="Email" placeholder="Mã số cán bộ, công chức, viên chức" value={boiDuongInfo.Email} onChange={handleBoiDuongChange} className="w-full border rounded-md p-2 text-sm" />
                                {ClassSurveyList.length > 0 && (
                                    <DropdownSearch
                                        options={ClassSurveyList.map(item => ({
                                            ...item,
                                            FullDisplayName: `${item.ClassName} - ${item.ClassName1} - ${item.TrainingSystemName}`
                                        }))}
                                        placeholder="------ Chọn khóa bồi dưỡng ------"
                                        labelKey="FullDisplayName"
                                        valueKey="ClassID"
                                        onChange={(e) => setSelectedClass(e.ClassID)}
                                    />
                                )}
                                <div className="flex gap-2">
                                    <input type="text" name="TimeStart" placeholder="Thời gian tổ chức" value={boiDuongInfo.TimeStart} onChange={handleBoiDuongChange} className="w-1/2 border rounded-md p-2 text-sm" />
                                    <input type="text" name="UnitName" placeholder="Địa điểm tổ chức" value={boiDuongInfo.UnitName} onChange={handleBoiDuongChange} className="w-1/2 border rounded-md p-2 text-sm" />
                                </div>
                                <input type="text" name="ClassName1" placeholder="Đơn vị tổ chức" value={boiDuongInfo.ClassName1} onChange={handleBoiDuongChange} className="w-full border rounded-md p-2 text-sm" />
                            </div>
                        )}

                        <button onClick={handleConfirmInfo} className="w-full max-w-md mt-6 py-4 bg-[#026aa8] text-white font-bold rounded-xl shadow-lg hover:bg-[#024f7d] transition-all active:scale-95 cursor-pointer">
                            XÁC NHẬN ĐỂ XEM PHIẾU
                        </button>
                    </div>
                ) : (
                    /* BƯỚC 2: PHIẾU KHẢO SÁT */
                    <div className="animate-fadeIn">
                        <div className="bg-white p-6 border-b-4 border-[#026aa8]">
                            <h1 className="text-xl md:text-2xl font-bold text-[#026aa8] text-center uppercase mb-4">
                                {surveyData?.TemplateSurveyName}
                            </h1>
                            <div className="bg-[#026aa8]/5 p-4 rounded text-sm text-gray-700 text-justify border border-[#026aa8]/20">
                                <p>{surveyData?.ShorDescription}</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            {surveyCates?.map((section, sIndex) => (
                                <div key={sIndex} className="mb-10">
                                    <h3 className="font-bold text-[#026aa8] text-lg mb-4 bg-gray-50 p-3 rounded border border-gray-100">
                                        {section.TitleCate}
                                    </h3>
                                    {section.lstSurveyAnswers?.map((q, qIndex) => (
                                        <QuestionRow
                                            stt={qIndex + 1}
                                            key={q.SurveyAnswerID}
                                            question={q}
                                            lstEvaluations={lstEvaluations}
                                            values={answers}
                                            onChange={handleOptionChange}
                                            onChangeFeedback={handleFeedbackChange}
                                        />
                                    ))}
                                </div>
                            ))}

                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                                <button className="px-6 py-2 text-gray-500 font-semibold" onClick={() => navigate('/home')}>Hủy</button>
                                <button onClick={handleSubmit} className="px-10 py-3 bg-[#026aa8] text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-all cursor-pointer active:scale-95">
                                    GỬI KHẢO SÁT
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 p-6 border-t border-gray-100 text-xs text-gray-400 text-center">
                    <p className="font-bold">Học viện cán bộ TP.HCM</p>
                    <p>Phòng Khảo thí và Đảm bảo chất lượng</p>
                </div>
            </div>
        </div>
    );
}