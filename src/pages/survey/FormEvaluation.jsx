import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Save, Trash2, Plus, RefreshCw, Gauge, Edit, ListTree } from 'lucide-react';
import ApiEvaluations from '../../apis/ApiEvaluations.js';

const Input = ({ value, readOnly = false, className = "", ...props }) => (
  <input
    type="text"
    value={value ?? ""}
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

export default function FormEvaluation({ visible, onClose, form }) {
  const [statusValue, setStatusValue] = useState(true);
  const [evaluationName, setEvaluationName] = useState('');
  const [evaluationID, setEvaluationID] = useState(null);
  const [templateSurveyID, setTemplateSurveyID] = useState(null);

  // States cho Bảng Data (Evaluation List)
  const [gridData, setGridData] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Xác định mode: Edit (có ID) hay Create (ID = null)
  const isEditing = !!evaluationID;

  // ---------------------------------------------- 2. INITIALIZATION

  useEffect(() => {
    const fetchData = async () => {
      const TemplateSurveyID = form.TemplateSurveyID;

      if (TemplateSurveyID) {
        const res = await ApiEvaluations.getEvaluationByTemplateSurveyIDApi(TemplateSurveyID);
        setGridData(Array.isArray(res.data) ? res.data : []);
      } else {
        setGridData([]);
      }
    }

    fetchData();
  }, [visible, form.TemplateSurveyID]);

  // Load form data khi mở modal hoặc form thay đổi
  useEffect(() => {
    if (visible && form) {
      // Nếu form có dữ liệu của 1 evaluation cụ thể (edit mode)
      if (form.EvaluationID) {
        setEvaluationID(form.EvaluationID);
        setTemplateSurveyID(form.TemplateSurveyID);
        setEvaluationName(form.EvaluationName || '');
        setStatusValue(form.StatusID === true);
        setSelectedRowId(form.EvaluationID); // Dùng EvaluationID làm key
      } else {
        handleControlAction('clear');
        setTemplateSurveyID(form.TemplateSurveyID || null);
      }
    }
  }, [visible, form]);

  // ---------------------------------------------- 3. LOGIC XỬ LÝ
  // 3.2. Handler Chọn Hàng trong Bảng
  const handleRowSelect = (row) => {
    setSelectedRowId(row.EvaluationID); // Đổi từ TemplateSurveyID
    setEvaluationID(row.EvaluationID);
    setTemplateSurveyID(row.TemplateSurveyID);
    setEvaluationName(row.EvaluationName);
    setStatusValue(row.StatusID);
  };

  // ---------------------- 3.3. CRUD
  const handleControlAction = async (actionType) => {
    // --- CLEAR / RESET ---
    if (actionType === 'clear' || actionType === 'reset') {
      setEvaluationID(null);
      setEvaluationName('');
      setStatusValue(true);
      setSelectedRowId(null);
      return;
    }

    // --- VALIDATION ---
    if (!evaluationName) {
      toast.warning("Tên đánh giá không được để trống.");
      return;
    }

    // --- thêm / sửa ---
    const payload = {
      EvaluationID: evaluationID,
      TemplateSurveyID: templateSurveyID,
      EvaluationName: evaluationName,
      StatusID: statusValue
    };

    if (actionType === 'add_edit') {
      if (isEditing) {
        let res = await ApiEvaluations.UpdateEvaluationApi(payload);
        if (res.message) {
          toast.error(res.message);
        } else {
          toast.success(`sửa tiêu chí đánh giá thành công`);
          setGridData(prev => prev.map(item =>
            item.EvaluationID === evaluationID ? payload : item
          ));
        }
      } else {
        let res = await ApiEvaluations.CreateEvaluationApi(payload);
        if (res.message) {
          toast.error(res.message);
        } else {
          toast.success(`Đã thêm tiêu chí đánh giá thành công`);
          setGridData(prev => [...prev, res]);
          handleRowSelect(res);
        }
      }
    }
    // --- DELETE ---
    else if (actionType === 'delete') {
      let res = await ApiEvaluations.DeleteEvaluationApi(payload);
      if (res.message) {
        toast.error(res.message);
      } else {
        toast.success(`Đã xóa bản ghi ID ${evaluationID}.`);
        setGridData(prev => prev.filter(item => item.EvaluationID !== evaluationID));
        handleControlAction('clear');
      }
    }
  };

  if (!visible) return null;

  const scrollbarClass = "overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl flex flex-col h-[95vh]">

        {/* HEADER */}
        <div className="flex-none flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Edit className="w-5 h-5 text-teal-600" />
            Tiêu chí đánh giá
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* CONTROL BOARD */}
        <div className="flex-none p-4 border-b border-blue-200 bg-blue-50">
          <h4 className="text-base font-bold text-blue-700 mb-3 flex items-center gap-2">
            <Gauge size={18} className="text-blue-500" /> Bảng điều khiển Khảo sát
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* --- Tên đánh giá --- */}
            <div className="md:col-span-2">
              <Label htmlFor="evaluation-name">Tên Đánh giá</Label>
              <Input
                id="evaluation-name"
                value={evaluationName}
                onChange={(e) => setEvaluationName(e.target.value)}
              />
            </div>

            {/* --- Trạng thái --- */}
            <div className="md:col-span-1">
              <Label htmlFor="status-select">Trạng thái</Label>
              <select
                id="status-select"
                value={statusValue ? 'true' : 'false'}
                onChange={(e) => setStatusValue(e.target.value === 'true')}
                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="true">Đang hoạt động</option>
                <option value="false">Tạm dừng</option>
              </select>
            </div>

            {/* --- Action Buttons --- */}
            <div className="md:col-span-1 flex gap-2 justify-end">
              <button
                onClick={() => handleControlAction('clear')}
                className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 font-medium flex items-center gap-1"
              >
                <RefreshCw size={16} /> Xóa
              </button>

              <button
                onClick={() => handleControlAction('add_edit')}
                className="px-5 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-medium flex items-center gap-1"
              >
                {isEditing ? (
                  <>
                    <Save size={16} /> Sửa
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Thêm
                  </>
                )}
              </button>

              {isEditing && (
                <button
                  onClick={() => handleControlAction('delete')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium flex items-center gap-1"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="flex-1 p-4 bg-gray-100 min-h-0 flex flex-col gap-4">

          {/* VÙNG: BẢNG EVALUATION LIST */}
          <div className="flex-none">
            <h4 className="flex-none text-base font-bold text-gray-700 mb-2 flex items-center gap-2">
              <ListTree size={18} className="text-indigo-500" /> Bảng tiêu chí áp dụng
            </h4>

            <div className={`bg-white border border-gray-200 rounded shadow-sm overflow-y-auto max-h-[350px] ${scrollbarClass}`}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Đánh giá</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {gridData.map((row) => (
                    <tr
                      key={row.EvaluationID}
                      onClick={() => handleRowSelect(row)}
                      className={`cursor-pointer hover:bg-teal-50 transition ${selectedRowId === row.TemplateSurveyID ? 'bg-teal-100 font-semibold' : ''}`}
                    >
                      <td className="px-6 py-2 whitespace-nowrap text-gray-900">{row.EvaluationName}</td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.StatusID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {row.StatusID ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>


      </div>
    </div>
  );
}