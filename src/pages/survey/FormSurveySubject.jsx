import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, Loader2, ArrowRight, Trash2, Database, CheckCircle2 } from 'lucide-react';
import { toast } from "react-toastify";
import ApiTemplateSurveys from '../../apis/ApiTemplateSurveys.js';
import { getSubjectLearnAll } from '../../redux/scheduleSlice.js';
import { useSelector, useDispatch } from "react-redux";

const FormSurveySubject = ({ visible, onClose, form }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const { subjectLearnAll } = useSelector((state) => state.schedule);

  // State dữ liệu
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Loading states
  const [loadingData, setLoadingData] = useState(false); // Loading lúc mở modal
  const [processingId, setProcessingId] = useState(null); // ID của item đang được xử lý (thêm/xóa) để hiện xoay xoay

  // --- 1. LOAD DỮ LIỆU BAN ĐẦU ---
  console.log('sssssssss ', subjectLearnAll);
  useEffect(() => {
    const fetchSubjectLearnAll = async () => {
      let res = await dispatch(getSubjectLearnAll());

      if (!res.payload || !res.payload.data) {
        toast.error(res.payload?.message || 'Không thể tải danh sách môn học');
      }
    };

    fetchSubjectLearnAll();
    // if (subjectLearnAll.length === 0) {
    // }
  }, [dispatch]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Gọi API lấy danh sách môn học & danh sách đã chọn
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập delay

      // Giả sử môn ID 2 và 3 đã được chọn
      const mockSelected = [
        { SubjectID: 2, SubjectName: 'Nội dung cơ bản của Chủ nghĩa Mác-Lênin (HP CNXHKH)', SubjectCode: '245' },
        { SubjectID: 3, SubjectName: 'Lịch sử Đảng Cộng sản Việt Nam', SubjectCode: '247' }
      ];

      setAvailableSubjects(subjectLearnAll);
      setSelectedSubjects(mockSelected);

    } catch (error) {
      toast.error("Không thể tải dữ liệu môn học");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchData();
      setSearchTerm('');
      setProcessingId(null);
    }
  }, [visible]);

  // --- 2. HÀM THÊM MÔN HỌC (GỌI API LUÔN) ---
  const handleAddSubject = async (subject) => {
    const surveyID = form?.TemplateSurveyID || form?.id;
    if (!surveyID) return;

    setProcessingId(`add-${subject.SubjectID}`); // Bật loading cho item này

    try {
      const payload = {
        TemplateSurveyID: surveyID,
        SubjectID: subject.SubjectID
      };

      console.log("GỌI API THÊM:", payload);
      // await ApiTemplateSurveys.AddSubjectToSurvey(payload);
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập API

      // API thành công -> Cập nhật State giao diện
      setSelectedSubjects((prev) => [...prev, subject]);
      toast.success(`Đã thêm: ${subject.SubjectName}`);

    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi thêm môn học");
    } finally {
      setProcessingId(null); // Tắt loading
    }
  };

  // --- 3. HÀM XÓA MÔN HỌC (GỌI API LUÔN) ---
  const handleRemoveSubject = async (subject) => {
    const surveyID = form?.TemplateSurveyID || form?.id;
    if (!surveyID) return;

    setProcessingId(`remove-${subject.SubjectID}`);

    try {
      const payload = {
        TemplateSurveyID: surveyID,
        SubjectID: subject.SubjectID
      };

      console.log("GỌI API XÓA:", payload);
      // await ApiTemplateSurveys.RemoveSubjectFromSurvey(payload); 
      await new Promise(resolve => setTimeout(resolve, 500));

      // API thành công -> Cập nhật State giao diện
      setSelectedSubjects((prev) => prev.filter(item => item.SubjectID !== subject.SubjectID));
      toast.success(`Đã xóa: ${subject.SubjectName}`);

    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa môn học");
    } finally {
      setProcessingId(null);
    }
  };

  // Lọc danh sách cột trái (ẩn những môn đã có bên phải)
  const filteredAvailable = availableSubjects.filter(sub => {
    const matchesSearch = sub.SubjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.SubjectCode.toLowerCase().includes(searchTerm.toLowerCase());
    const isAlreadySelected = selectedSubjects.some(sel => sel.SubjectID === sub.SubjectID);
    return matchesSearch && !isAlreadySelected;
  });

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            Cấu hình môn học áp dụng
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <X size={24} />
          </button>
        </div>

        {/* Body: 2 Cột */}
        <div className="flex-1 overflow-hidden p-5 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">

            {/* --- CỘT TRÁI: MÔN CÓ THỂ CHỌN --- */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
              <div className="p-3 border-b border-gray-100 bg-white rounded-t-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Chọn môn để thêm</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm môn học..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {loadingData ? (
                  <div className="flex justify-center items-center py-10 text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : filteredAvailable.length > 0 ? (
                  filteredAvailable.map(sub => (
                    <div key={sub.SubjectID} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-purple-50 rounded-md border border-gray-100 transition group">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{sub.SubjectName}</div>
                        <div className="text-xs text-gray-500">{sub.SubjectCode}</div>
                      </div>

                      {/* NÚT THÊM - GỌI API LUÔN */}
                      <button
                        onClick={() => handleAddSubject(sub)}
                        disabled={!!processingId}
                        className="ml-2 p-2 bg-white text-purple-600 border border-purple-200 rounded-full hover:bg-purple-600 hover:text-white transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Thêm vào danh sách"
                      >
                        {processingId === `add-${sub.SubjectID}` ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <ArrowRight size={16} />
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 text-sm py-10 italic">
                    {searchTerm ? 'Không tìm thấy kết quả' : 'Đã chọn hết các môn'}
                  </div>
                )}
              </div>
            </div>

            {/* --- CỘT PHẢI: MÔN ĐÃ CHỌN (LOAD TỪ BE) --- */}
            <div className="bg-white rounded-lg border border-purple-200 shadow-md flex flex-col h-full ring-1 ring-purple-100">
              <div className="p-3 border-b border-purple-100 bg-purple-50 rounded-t-lg flex justify-between items-center">
                <h4 className="font-bold text-purple-800 flex items-center gap-2">
                  <Database size={16} />
                  Môn đã lưu
                </h4>
                <span className="text-xs font-semibold bg-purple-200 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1">
                  {selectedSubjects.length} <CheckCircle2 size={12} />
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {loadingData ? (
                  <div className="flex justify-center items-center py-10 text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : selectedSubjects.length > 0 ? (
                  selectedSubjects.map(sub => (
                    <div key={sub.SubjectID} className="flex items-center justify-between p-3 bg-white border-l-4 border-l-purple-500 shadow-sm rounded-r-md border border-gray-100">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{sub.SubjectName}</div>
                        <div className="text-xs text-gray-500">{sub.SubjectCode}</div>
                      </div>

                      {/* NÚT XÓA - GỌI API LUÔN */}
                      <button
                        onClick={() => handleRemoveSubject(sub)}
                        disabled={!!processingId}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa môn này"
                      >
                        {processingId === `remove-${sub.SubjectID}` ? (
                          <Loader2 size={16} className="text-red-500 animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 text-sm py-10 italic flex flex-col items-center">
                    <span>Chưa có môn học nào được áp dụng.</span>
                    <span className="text-xs mt-1">Chọn từ cột bên trái để thêm.</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer - CHỈ CÒN NÚT ĐÓNG */}
        <div className="p-5 border-t border-gray-100 flex justify-end bg-white rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg font-medium shadow-md transition"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSurveySubject;