import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiSurvey from '../../apis/ApiSurvey.js'
import ApiTemplateSurveys from '../../apis/ApiTemplateSurveys.js'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTemplateSurveyForClient } from '../../redux/surveySlice.js'
import { getTrainingSystemAddressByUserID, getListByType } from '../../redux/learningClassSlice.js';
import DropdownSearch from '../../components/FormFields/DropdownSearch.jsx';
import { toast } from "react-toastify";

// --- Sub-Component: Một dòng câu hỏi ---
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

    // Redux store
    const { ClassSurveyList, TrainingSystemAddress } = useSelector((state) => state.learningClass);

    // State dữ liệu
    const [surveyTemplate, setSurveyTemplate] = useState(null);
    const [surveyData, setSurveyData] = useState(null);
    const [surveyCates, setSurveyCates] = useState([]);
    const [lstEvaluations, setLstEvaluations] = useState([]);
    const [answers, setAnswers] = useState({});

    // State điều khiển
    const isSubmit = searchParams.get('submit')?.toLowerCase() === 'true';
    const templateSurveyID = searchParams.get('templateSurveyID');
    const [isInfoConfirmed, setIsInfoConfirmed] = useState(!isSubmit);
    const [classTypeID, setClassTypeID] = useState(searchParams.get('classTypeID') || '1');
    const [selectedClass, setSelectedClass] = useState('');

    // State thông tin các hệ
    const [trungCapInfo, setTrungCapInfo] = useState({
        Age: '', GenderID: '', Position: '', Office: '', Email: '', FullName: '', Phone: ''
    });

    const [boiDuongInfo, setBoiDuongInfo] = useState({
        FullName: '', Email: '', TimeStart: '', ClassName1: '', UnitName: '', Phone: '', Office: '', GenderID: '', Position: ''
    });

    // 1. Khởi tạo dữ liệu
    useEffect(() => {
        const initFetch = async () => {
            const idDetail = searchParams.get('id');
            const tID = searchParams.get('templateSurveyID');

            if (idDetail) {
                let res = await ApiSurvey.getSurveyByIDApi(idDetail);
                if (res?.data) {
                    setSurveyData(res.data);
                    setSurveyCates(res.data.lstSurveyCates || []);
                    setLstEvaluations(res.data.lstEvaluations || []);
                    if (res.data.ClassTypeID) setClassTypeID(res.data.ClassTypeID.toString());

                    const saved = {};
                    res.data.lstSurveyCates?.forEach(sec => {
                        sec.lstSurveyAnswers?.forEach(q => {
                            if (q.IsAnswer) saved[q.SurveyAnswerID] = { EvaluationID: q.EvaluationID, ContentAnswer: q.ContentAnswer };
                        });
                    });
                    setAnswers(saved);
                }
            }

            if (tID) {
                let resTemplate = await ApiTemplateSurveys.getTemplateSurveyByIDApi(tID);
                if (resTemplate?.data) {
                    setSurveyTemplate(resTemplate.data);
                    if (resTemplate.data.ClassTypeID) setClassTypeID(resTemplate.data.ClassTypeID.toString());
                }
            }
        };
        initFetch();
    }, [searchParams]);

    // 2. Lấy danh sách lớp nếu là hệ Bồi dưỡng
    useEffect(() => {
        if (classTypeID == '2' && ClassSurveyList.length === 0) {
            dispatch(getListByType(2));
        }
    }, [classTypeID, dispatch]);

    // 3. Lấy địa chỉ/thông tin lớp khi chọn lớp
    useEffect(() => {
        if (selectedClass) {
            dispatch(getTrainingSystemAddressByUserID(selectedClass));
        }
    }, [selectedClass, dispatch]);

    // 4. Điền tự động thông tin lớp vào Form
    useEffect(() => {
        if (TrainingSystemAddress && classTypeID == '2') {
            setBoiDuongInfo(prev => ({
                ...prev,
                ClassName1: TrainingSystemAddress.ClassName1 || '',
                TimeStart: TrainingSystemAddress.TimeStart || '',
                UnitName: TrainingSystemAddress.UnitName || ''
            }));
        }
    }, [TrainingSystemAddress, classTypeID]);

    // --- Xử lý sự kiện ---
    const handleOptionChange = (qId, evalId, evalName) => {
        setAnswers(prev => ({ ...prev, [qId]: { EvaluationID: evalId, ContentAnswer: evalName } }));
    };

    const handleFeedbackChange = (qId, content) => {
        setAnswers(prev => ({ ...prev, [qId]: { EvaluationID: null, ContentAnswer: content } }));
    };

    const handleConfirmInfo = async () => {
        if (classTypeID == '1') {
            const { Age, GenderID, Position, Office } = trungCapInfo;
            if (!Age || !GenderID || !Position || !Office) return toast.warning("Vui lòng nhập đủ thông tin hệ trung cấp.");
        } else {
            const { FullName, Email, TimeStart, ClassName1, UnitName } = boiDuongInfo;
            if (!FullName || !Email || !TimeStart || !ClassName1 || !UnitName) return toast.warning("Vui lòng nhập đủ thông tin hệ bồi dưỡng.");
        }

        const payload = {
            ...surveyTemplate,
            ClassTypeID: parseInt(classTypeID),
            TrainingSystemID: TrainingSystemAddress?.TrainingSystemID || null,
            ClassID: selectedClass || null,
            UnitID: TrainingSystemAddress?.UnitID || null,
            AddressID: TrainingSystemAddress?.AddressID || null,
            ...(classTypeID == '2' ? boiDuongInfo : trungCapInfo)
        };

        let res = await ApiSurvey.CreateSurveyClientApi(payload);
        if (res && !res.message) {
            setSurveyData(res);
            setSurveyCates(res.lstSurveyCates || []);
            setLstEvaluations(res.lstEvaluations || []);
            setIsInfoConfirmed(true);
            window.scrollTo(0, 0);
        } else {
            toast.error(res?.message || "Lỗi tạo phiếu.");
        }
    };

    const handleSubmitSurvey = async () => {
        let requiredIds = [];
        surveyCates.forEach(sec => sec.lstSurveyAnswers.forEach(q => {
            if (q.TypeCriteria === 1) requiredIds.push(String(q.SurveyAnswerID));
        }));

        if (requiredIds.some(id => !answers[id])) return toast.warning("Vui lòng trả lời đầy đủ các câu hỏi.");

        const postModel = {
            SurveyID: surveyData.SurveyID,
            lstSurveyAnswers: Object.keys(answers).map(id => ({
                SurveyAnswerID: parseInt(id),
                ...answers[id],
                IsAnswer: true
            })),
            ...(isSubmit && (classTypeID == '1' ? trungCapInfo : boiDuongInfo))
        };

        let res = await ApiSurvey.UpdateSurveyAnswerClientApi(postModel);
        if (res === true) {
            toast.success("Gửi thành công!");
            navigate('/home');
        } else {
            toast.error("Gửi thất bại.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8 flex justify-center font-sans">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                {!isInfoConfirmed ? (
                    <div className="p-8 md:p-12 flex flex-col items-center bg-white">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Xác nhận thông tin</h2>
                        <p className="text-gray-500 mb-8 text-center italic">Bạn đang thực hiện khảo sát dành cho: <b className="text-[#026aa8]">{classTypeID == '1' ? 'Hệ Trung Cấp' : 'Hệ Bồi Dưỡng'}</b></p>

                        {classTypeID == '1' && (
                            <div className="max-w-md w-full space-y-4">
                                <input type="email" placeholder="Email" value={trungCapInfo.Email} onChange={(e) => setTrungCapInfo({ ...trungCapInfo, Email: e.target.value })} className="w-full border rounded-md p-3" />
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Tuổi" value={trungCapInfo.Age} onChange={(e) => setTrungCapInfo({ ...trungCapInfo, Age: e.target.value })} className="w-1/2 border rounded-md p-3" />
                                    <select value={trungCapInfo.GenderID} onChange={(e) => setTrungCapInfo({ ...trungCapInfo, GenderID: e.target.value })} className="w-1/2 border rounded-md p-3">
                                        <option value="">-- Giới tính --</option>
                                        <option value="1">Nam</option><option value="2">Nữ</option>
                                    </select>
                                </div>
                                <input type="text" placeholder="Chức vụ" value={trungCapInfo.Position} onChange={(e) => setTrungCapInfo({ ...trungCapInfo, Position: e.target.value })} className="w-full border rounded-md p-3" />
                                <input type="text" placeholder="Cơ quan" value={trungCapInfo.Office} onChange={(e) => setTrungCapInfo({ ...trungCapInfo, Office: e.target.value })} className="w-full border rounded-md p-3" />
                            </div>
                        )}

                        {classTypeID == '2' && (
                            <div className="max-w-md w-full space-y-4">
                                <input type="text" placeholder="Họ tên" value={boiDuongInfo.FullName} onChange={(e) => setBoiDuongInfo({ ...boiDuongInfo, FullName: e.target.value })} className="w-full border rounded-md p-3" />
                                <input type="text" placeholder="Mã cán bộ/CCVC" value={boiDuongInfo.Email} onChange={(e) => setBoiDuongInfo({ ...boiDuongInfo, Email: e.target.value })} className="w-full border rounded-md p-3" />
                                <DropdownSearch
                                    options={ClassSurveyList.map(item => ({ ...item, FullDisplayName: `${item.ClassName} - ${item.ClassName1}` }))}
                                    placeholder="Chọn khóa học bồi dưỡng"
                                    labelKey="FullDisplayName" valueKey="ClassID"
                                    onChange={(e) => setSelectedClass(e.ClassID)}
                                />
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Thời gian" value={boiDuongInfo.TimeStart} className="w-1/2 border bg-gray-50 rounded-md p-3 text-xs" readOnly />
                                    <input type="text" placeholder="Địa điểm" value={boiDuongInfo.UnitName} className="w-1/2 border bg-gray-50 rounded-md p-3 text-xs" readOnly />
                                </div>
                                <input type="text" placeholder="Đơn vị tổ chức" value={boiDuongInfo.ClassName1} className="w-full border bg-gray-50 rounded-md p-3 text-xs" readOnly />
                            </div>
                        )}

                        <button onClick={handleConfirmInfo} className="w-full max-w-md mt-8 py-4 bg-[#026aa8] text-white font-bold rounded-xl shadow-lg hover:bg-[#024f7d] cursor-pointer">
                            XÁC NHẬN ĐỂ TIẾP TỤC
                        </button>
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        <div className="bg-white p-6 border-b-4 border-[#026aa8]">
                            <h1 className="text-xl md:text-2xl font-bold text-[#026aa8] text-center uppercase mb-4">{surveyData?.TemplateSurveyName}</h1>
                            <div className="bg-[#026aa8]/5 p-4 rounded text-sm text-gray-700 border border-[#026aa8]/20"><p>{surveyData?.ShorDescription}</p></div>
                        </div>
                        <div className="p-6 md:p-8">
                            {surveyCates?.map((section, sIndex) => (
                                <div key={sIndex} className="mb-10">
                                    <h3 className="font-bold text-[#026aa8] text-lg mb-4 bg-gray-50 p-3 rounded border border-gray-100">{section.TitleCate}</h3>
                                    {section.lstSurveyAnswers?.map((q, qIndex) => (
                                        <QuestionRow stt={qIndex + 1} key={q.SurveyAnswerID} question={q} lstEvaluations={lstEvaluations} values={answers}
                                            onChange={handleOptionChange} onChangeFeedback={handleFeedbackChange} />
                                    ))}
                                </div>
                            ))}
                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                                <button className="px-6 py-2 text-gray-500 font-semibold" onClick={() => navigate('/home')}>Hủy</button>
                                <button onClick={handleSubmitSurvey} className="px-10 py-3 bg-[#026aa8] text-white font-bold rounded-lg shadow-md hover:opacity-90 cursor-pointer transition-all active:scale-95">
                                    GỬI PHIẾU KHẢO SÁT
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="bg-gray-50 p-6 border-t border-gray-100 text-xs text-gray-400 text-center italic">
                    <p>Học viện cán bộ TP.HCM - Phòng Khảo thí và Đảm bảo chất lượng</p>
                </div>
            </div>
        </div>
    );
}