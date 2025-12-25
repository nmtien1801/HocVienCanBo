import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getSubjectLearnAll } from '../../redux/scheduleSlice.js';
import { toast } from 'react-toastify';
import { X, Search, BookOpen, Loader2, ArrowRight, Trash2, Database, Gauge, Edit, Save, Plus, RefreshCw } from 'lucide-react';
import ApiTemplateSurveys from '../../apis/ApiTemplateSurveys.js';

const Input = ({ value, readOnly = false, className = "", ...props }) => (
    <input
        type="text"
        value={value}
        readOnly={readOnly}
        className={`w-full p-2 border border-gray-300 rounded bg-white text-sm ${readOnly ? 'bg-gray-100' : 'focus:ring-teal-500 focus:border-teal-500'} ${className}`}
        {...props}
    />
);
const Label = ({ children, className = "" }) => (
    <label className={`block text-xs font-medium text-gray-700 mb-1 ${className}`}>
        {children}
    </label>
);
// ----------------------------------------------------


export default function FormSurveySubject({ visible, onClose, form }) {
    const dispatch = useDispatch();
    const { subjectLearnAll } = useSelector((state) => state.schedule);

    // ---------------------------------------------- 1. STATES MỚI (CONTROL BOARD)
    const [statusValue, setStatusValue] = useState(false);
    const [evaluationName, setEvaluationName] = useState('');

    // Lấy ID từ form prop
    const initialTemplateSurveyID = form?.TemplateSurveyID || form?.id || null;
    const isEditing = !!initialTemplateSurveyID;

    // Dữ liệu Control Board từ prop `form`
    const controlData = useMemo(() => ({
        EvaluationID: form?.EvaluationID || 'N/A', // Giả sử ID này là read-only
        TemplateSurveyID: initialTemplateSurveyID,
        initialEvaluationName: form?.EvaluationName || '',
        initialStatus: form?.StatusID
    }), [form, initialTemplateSurveyID]);

    // Khởi tạo giá trị cho Control Board
    useEffect(() => {
        if (visible) {
            if (typeof controlData.initialStatus === 'boolean') {
                setStatusValue(controlData.initialStatus);
            } else {
                setStatusValue(false); // Default cho chế độ Thêm mới
            }
            setEvaluationName(controlData.initialEvaluationName);
        }
    }, [visible, controlData.initialStatus, controlData.initialEvaluationName]);


    // ---------------------------------------------- 2. STATES GỐC (MÔN HỌC)
    const [query, setQuery] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    // ---------------------------------------------- 3. FETCH DATA GỐC
    useEffect(() => {
        // lấy ds môn học khả dụng
        const fetchSubjectLearnAll = async () => {
            let res = await dispatch(getSubjectLearnAll());

            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message || 'Không thể tải danh sách môn học');
            }
        };

        if (!Array.isArray(subjectLearnAll) || subjectLearnAll.length === 0) {
            fetchSubjectLearnAll();
        }
    }, [dispatch, subjectLearnAll]);

    useEffect(() => {
        const fetchSelectedSubjects = async () => {
            if (!visible) return;

            setLoadingData(true);
            try {
                const TemplateSurveyID = controlData.TemplateSurveyID;

                if (TemplateSurveyID) {
                    // --- LẤY MÔN ĐÃ CHỌN ---
                    const res = await ApiTemplateSurveys.getSurveySubjectByTemlateSurveyIDApi(TemplateSurveyID);

                    setSelectedSubjects(Array.isArray(res.data) ? res.data : []);
                } else {
                    setSelectedSubjects([]); // Nếu chưa có TemplateSurveyID thì không có môn nào được chọn
                }
            } catch (error) {
                toast.error('Lấy dữ liệu môn đã chọn thất bại');
            } finally {
                setLoadingData(false);
            }
        };

        if (visible) {
            setQuery('');
            fetchSelectedSubjects();
        }
    }, [visible, controlData.TemplateSurveyID]);

    // 4. FILTER (Sử dụng useMemo để tối ưu)
    const filteredAvailable = useMemo(() => {
        const sourceData = Array.isArray(subjectLearnAll) ? subjectLearnAll : [];

        return sourceData.filter(item => {
            const name = item.SubjectName || "";
            const code = item.SubjectCode || "";

            const matchQuery = name.toLowerCase().includes(query.toLowerCase()) ||
                code.toLowerCase().includes(query.toLowerCase());

            const notSelected = !(selectedSubjects || []).some(sel => sel.SubjectID === item.SubjectID);

            return matchQuery && notSelected;
        });
    }, [subjectLearnAll, query, selectedSubjects]);

    // -------------------------------------------- 5. HANDLERS

    // Handler cho Status Select
    const handleStatusChange = (e) => {
        setStatusValue(e.target.value === 'true');
    };

    // Handler CRUD cho CONTROL BOARD (Evaluation)
    const handleControlAction = (actionType) => {
        if (!evaluationName) {
            toast.warning("Tên đánh giá không được để trống.");
            return;
        }

        const payload = {
            TemplateSurveyID: controlData.TemplateSurveyID,
            EvaluationName: evaluationName,
            StatusID: statusValue
        };

        switch (actionType) {
            case 'add_edit':
                // --- GỌI API THÊM/SỬA Ở ĐÂY ---
                toast.info(`Đang xử lý ${isEditing ? 'SỬA' : 'THÊM'} Template: ${payload.EvaluationName}...`);
                // Sau khi API trả về ID mới (nếu là Thêm mới), cần cập nhật form prop hoặc state cha.
                break;
            case 'delete':
                // --- GỌI API XÓA Ở ĐÂY ---
                toast.error(`Đang XÓA bản ghi ID: ${payload.TemplateSurveyID}...`);
                // Sau khi xóa thành công, cần đóng modal và refresh lưới.
                break;
            case 'clear':
                // Xóa trắng Control Board Form
                setEvaluationName('');
                setStatusValue(false);
                toast.info('Form đã được xóa trắng. Sẵn sàng cho thêm mới.');
                break;
            default:
                break;
        }
    };

    // -------------------------------------------- Handler Thêm/Xóa MÔN HỌC GỐC
    const handleAddSubject = async (subject) => {
        const TemplateSurveyID = controlData.TemplateSurveyID;
        if (!TemplateSurveyID) {
            toast.warning("Vui lòng lưu thông tin đánh giá (Thêm mới/Cập nhật) trước khi thêm môn học.");
            return;
        }
        setProcessingId(`add-${subject.SubjectID}`);
        try {
            const payload = { TemplateSurveyID: TemplateSurveyID, SubjectID: subject.SubjectID, StatusID: true };
            let res = await ApiTemplateSurveys.CreateSurveySubjectApi(payload);
            if (res.message) {
                toast.error(res.message);
            } else {
                setSelectedSubjects(prev => [...prev, { ...subject, SurveySubjectID: res.SurveySubjectID }]);
                toast.success(`Đã thêm: ${subject.SubjectName}`);
            }
        } catch (error) { toast.error('Lỗi thêm môn'); }
        finally { setProcessingId(null); }
    };

    const handleRemoveSubject = async (subject) => {
        const TemplateSurveyID = controlData.TemplateSurveyID;

        if (!TemplateSurveyID) return;
        setProcessingId(`remove-${subject.SubjectID}`);
        try {
            const payload = { TemplateSurveyID: TemplateSurveyID, SubjectID: subject.SubjectID, SurveySubjectID: subject.SurveySubjectID };
            let res = await ApiTemplateSurveys.DeleteSurveySubjectApi(payload);

            if (res.message) {
                toast.error(res.message);
            } else {
                setSelectedSubjects(prev => prev.filter(s => s.SubjectID !== subject.SubjectID));
                toast.success(`Đã xóa: ${subject.SubjectName}`);
            }
        } catch (error) { toast.error('Lỗi xóa môn'); }
        finally { setProcessingId(null); }
    };

    if (!visible) return null;

    // Class CSS cho thanh cuộn
    const scrollbarClass = "overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl flex flex-col h-[90vh]">

                {/* HEADER */}
                <div className="flex-none flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <Edit className="w-5 h-5 text-teal-600" />
                        Quản lý Môn học Khảo sát
                        {/* : **{evaluationName || 'Thêm mới'}** */}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                        <X size={24} />
                    </button>
                </div>

                {/* CONTROL BOARD (FORM CẤU HÌNH) */}
                <div className="flex-none p-4 border-b border-blue-200 bg-blue-50 hidden">
                    <h4 className="text-base font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <Gauge size={18} className="text-blue-500" /> Bảng điều khiển Khảo sát
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label>Evaluation ID</Label>
                            <Input value={controlData.EvaluationID} readOnly />
                        </div>
                        <div>
                            <Label>Template Survey ID</Label>
                            <Input value={controlData.TemplateSurveyID || 'N/A'} readOnly />
                        </div>
                        <div className="md:col-span-1">
                            <Label htmlFor="evaluation-name">Tên Đánh giá (Evaluation Name)</Label>
                            <Input
                                id="evaluation-name"
                                value={evaluationName}
                                onChange={(e) => setEvaluationName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="status-select">Trạng thái (Status ID)</Label>
                            <select
                                id="status-select"
                                value={statusValue}
                                onChange={handleStatusChange}
                                className={`w-full p-2 border border-gray-300 rounded text-sm outline-none ${statusValue ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'} focus:ring-2 focus:ring-teal-500 cursor-pointer`}
                            >
                                <option value={true} className="text-green-800">Đang hoạt động</option>
                                <option value={false} className="text-red-800">Tạm dừng</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* BODY CONTAINER (LƯỚI DỮ LIỆU MÔN HỌC GỐC) */}
                <div className="flex-1 p-4 bg-gray-50 min-h-0">
                    <h4 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                        {/* <BookOpen size={18} className="text-teal-500" /> Quản lý Môn học Khảo sát */}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">

                        {/* --- CỘT TRÁI (Môn học khả dụng) --- */}
                        <div className="bg-white rounded border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
                            <div className="flex-none p-3 border-b bg-white">
                                <div className="relative">
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Tìm kiếm môn học..."
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>
                            </div>

                            {/* LIST MÔN HỌC KHẢ DỤ */}
                            <div className={`flex-1 ${scrollbarClass} p-2 space-y-2`}>
                                {filteredAvailable.length === 0 ? (
                                    <div className="text-center text-gray-500 py-10 text-sm">
                                        {Array.isArray(subjectLearnAll) && subjectLearnAll.length === 0 ? "Đang tải dữ liệu..." : "Không tìm thấy kết quả"}
                                    </div>
                                ) : (
                                    filteredAvailable.map(sub => (
                                        <div key={sub.SubjectID} className="flex items-center justify-between p-3 rounded hover:bg-teal-50 border border-transparent hover:border-teal-100 transition group bg-white shadow-sm mb-1">
                                            <div className="flex-1 pr-2 min-w-0">
                                                <div className="text-sm font-medium text-gray-800 truncate" title={sub.SubjectName}>
                                                    {sub.SubjectName}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">{sub.SubjectCode}</div>
                                            </div>
                                            <button
                                                onClick={() => handleAddSubject(sub)}
                                                disabled={!!processingId || !controlData.TemplateSurveyID}
                                                className="flex-none px-3 py-1.5 bg-white border border-teal-200 text-teal-600 rounded-full hover:bg-teal-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={!controlData.TemplateSurveyID ? "Lưu đánh giá trước" : "Thêm môn học"}
                                            >
                                                {processingId === `add-${sub.SubjectID}` ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* --- CỘT PHẢI (Môn học đã lưu) --- */}
                        <div className="bg-white rounded border border-teal-200 shadow-sm flex flex-col h-full overflow-hidden">
                            <div className="flex-none p-3 border-b border-teal-100 bg-teal-50 flex justify-between items-center">
                                <span className="text-sm font-bold text-teal-800 flex items-center gap-2">
                                    <Database size={14} /> Môn đã lưu
                                </span>
                                <span className="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                                    {selectedSubjects.length}
                                </span>
                            </div>

                            <div className={`flex-1 ${scrollbarClass} p-2 space-y-2`}>
                                {loadingData ? (
                                    <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-teal-500" /></div>
                                ) : selectedSubjects.length === 0 ? (
                                    <div className="text-center text-gray-400 py-10 text-sm">Chưa có môn nào được chọn</div>
                                ) : (
                                    selectedSubjects.map(sub => (
                                        <div key={sub.SubjectID} className="flex items-center justify-between p-3 bg-white border-l-4 border-l-teal-500 border border-gray-100 rounded-r shadow-sm mb-1">
                                            <div className="flex-1 pr-2 min-w-0">
                                                <div className="text-sm font-medium text-gray-800 truncate" title={sub.SubjectName}>{sub.SubjectName}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{sub.SubjectCode}</div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveSubject(sub)}
                                                disabled={!!processingId}
                                                className="flex-none p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                                            >
                                                {processingId === `remove-${sub.SubjectID}` ? <Loader2 size={16} className="animate-spin text-red-500" /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* FOOTER: Nút CRUD cho Control Board */}
                <div className="flex-none p-4 border-t flex justify-between bg-white">
                    {/* Cột trái: Nút Đóng và Xóa trắng */}
                    <div className='flex gap-2 hidden'>
                        <button onClick={onClose} className="px-5 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium">
                            Đóng cửa sổ
                        </button>
                        <button
                            onClick={() => handleControlAction('clear')}
                            className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 font-medium flex items-center gap-1 transition"
                        >
                            <RefreshCw size={16} /> Xóa trắng (Form)
                        </button>
                    </div>

                    {/* Cột phải: Thêm/Sửa và Xóa */}
                    <div className='flex gap-2 hidden'>
                        {isEditing && (
                            <button
                                onClick={() => handleControlAction('delete')}
                                className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium flex items-center gap-1 transition"
                            >
                                <Trash2 size={16} /> Xóa
                            </button>
                        )}

                        <button
                            onClick={() => handleControlAction('add_edit')}
                            className="px-5 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-medium flex items-center gap-1 transition"
                        >
                            {isEditing ? (<> <Save size={16} /> Sửa (Cập nhật)</>) : (<> <Plus size={16} /> Thêm mới</>)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}