import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getSubjectLearnAll } from '../../redux/scheduleSlice.js';
import { toast } from 'react-toastify';
import { X, Search, BookOpen, Loader2, ArrowRight, Trash2, Database } from 'lucide-react';
import ApiTemplateSurveys from '../../apis/ApiTemplateSurveys.js';

export default function FormSurveySubject({ visible, onClose, form }) {
  const dispatch = useDispatch();
  const { subjectLearnAll } = useSelector((state) => state.schedule);

  const [query, setQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // ---------------------------------------------- 1. FETCH DATA
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

  useEffect(() => {
    const fetchSelectedSubjects = async () => {
      if (!visible) return;

      setLoadingData(true);
      try {
        const surveyID = form?.TemplateSurveyID || form?.id;
        if (surveyID) {
          // --- GỌI API THỰC TẾ ĐỂ LẤY MÔN ĐÃ CHỌN ---
          // const res = await ApiTemplateSurveys.GetSubjectsBySurveyID(surveyID);
          // setSelectedSubjects(res.data);

          // Fake data
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockSelected = [
            { SubjectID: 1, SubjectName: 'Nội dung cơ bản của Chủ nghĩa Mác-Lênin (HPTriết học)', SubjectCode: '245' }
          ];
          setSelectedSubjects(mockSelected);
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
  }, [visible, form]);

  // 2. FILTER (Sử dụng useMemo để tối ưu)
  const filteredAvailable = useMemo(() => {
    // Đảm bảo subjectLearnAll là mảng
    const sourceData = Array.isArray(subjectLearnAll) ? subjectLearnAll : [];

    return sourceData.filter(item => {
      const name = item.SubjectName || "";
      const code = item.SubjectCode || "";

      const matchQuery = name.toLowerCase().includes(query.toLowerCase()) ||
        code.toLowerCase().includes(query.toLowerCase());

      const notSelected = !selectedSubjects.some(sel => sel.SubjectID === item.SubjectID);

      return matchQuery && notSelected;
    });
  }, [subjectLearnAll, query, selectedSubjects]);

  // 3. ACTIONS
  const handleAddSubject = async (subject) => {
    const surveyID = form?.TemplateSurveyID || form?.id;
    if (!surveyID) return;
    setProcessingId(`add-${subject.SubjectID}`);
    try {
      const payload = { TemplateSurveyID: surveyID, SubjectID: subject.SubjectID };
      // await ApiTemplateSurveys.AddSubjectToSurvey(payload); // API THẬT
      await new Promise(resolve => setTimeout(resolve, 200));
      setSelectedSubjects(prev => [...prev, subject]);
      toast.success(`Đã thêm: ${subject.SubjectName}`);
    } catch (error) { toast.error('Lỗi thêm môn'); }
    finally { setProcessingId(null); }
  };

  const handleRemoveSubject = async (subject) => {
    const surveyID = form?.TemplateSurveyID || form?.id;
    if (!surveyID) return;
    setProcessingId(`remove-${subject.SubjectID}`);
    try {
      const payload = { TemplateSurveyID: surveyID, SubjectID: subject.SubjectID };
      // await ApiTemplateSurveys.RemoveSubjectFromSurvey(payload); // API THẬT
      await new Promise(resolve => setTimeout(resolve, 200));
      setSelectedSubjects(prev => prev.filter(s => s.SubjectID !== subject.SubjectID));
      toast.success(`Đã xóa: ${subject.SubjectName}`);
    } catch (error) { toast.error('Lỗi xóa môn'); }
    finally { setProcessingId(null); }
  };

  if (!visible) return null;

  // Class CSS cho thanh cuộn
  const scrollbarClass = "overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* FIX 1: Đặt chiều cao cố định h-[85vh] thay vì max-h. 
         Điều này buộc các phần tử con phải tính toán chiều cao để scroll.
      */}
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl flex flex-col h-[85vh]">

        {/* HEADER: flex-none để không bị co lại */}
        <div className="flex-none flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Cấu hình môn học ({subjectLearnAll?.length || 0} môn)
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* BODY CONTAINER: flex-1 để chiếm toàn bộ phần còn lại, min-h-0 cực quan trọng */}
        <div className="flex-1 p-4 bg-gray-50 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">

            {/* --- CỘT TRÁI --- */}
            <div className="bg-white rounded border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
              {/* Search Box: flex-none */}
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

              {/* LIST: flex-1 + overflow-y-auto */}
              <div className={`flex-1 ${scrollbarClass} p-2 space-y-2`}>
                {filteredAvailable.length === 0 ? (
                  <div className="text-center text-gray-500 py-10 text-sm">
                    {subjectLearnAll?.length === 0 ? "Đang tải dữ liệu..." : "Không tìm thấy kết quả"}
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
                        disabled={!!processingId}
                        className="flex-none px-3 py-1.5 bg-white border border-teal-200 text-teal-600 rounded-full hover:bg-teal-500 hover:text-white transition disabled:opacity-50"
                      >
                        {processingId === `add-${sub.SubjectID}` ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* --- CỘT PHẢI --- */}
            <div className="bg-white rounded border border-purple-200 shadow-sm flex flex-col h-full overflow-hidden">
              <div className="flex-none p-3 border-b border-purple-100 bg-purple-50 flex justify-between items-center">
                <span className="text-sm font-bold text-purple-800 flex items-center gap-2">
                  <Database size={14} /> Môn đã lưu
                </span>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                  {selectedSubjects.length}
                </span>
              </div>

              <div className={`flex-1 ${scrollbarClass} p-2 space-y-2`}>
                {loadingData ? (
                  <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>
                ) : selectedSubjects.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-sm">Chưa có môn nào được chọn</div>
                ) : (
                  selectedSubjects.map(sub => (
                    <div key={sub.SubjectID} className="flex items-center justify-between p-3 bg-white border-l-4 border-l-purple-500 border border-gray-100 rounded-r shadow-sm mb-1">
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

        {/* FOOTER: flex-none */}
        <div className="flex-none p-4 border-t flex justify-end bg-white">
          <button onClick={onClose} className="px-5 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium">
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}