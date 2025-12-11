import React, { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { StatusID } from '../../utils/constants.js'

const FormTemplateCategory = ({ visible, onClose, form, setForm, onSave }) => {
  // Hàm utility để xử lý thay đổi form
  const handleChange = (key, value) => {
    setForm(prevForm => ({ ...prevForm, [key]: value }));
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (visible) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  // Xác định chế độ để hiển thị tiêu đề và disable trường cố định
  const isEditing = !!form.TemplateSurveyCateID;

  return (
    // Overlay (Nền mờ)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-transform duration-300 scale-100 opacity-100">

        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? `Chỉnh sửa Nhóm câu hỏi: ${form.TitleCate || 'Đang tải...'}` : 'Thêm Nhóm câu hỏi mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition hover:bg-gray-100"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-12 gap-5">
            {/* Tiêu đề nhóm (TitleCate) */}
            <div className="col-span-12 sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề nhóm</label>
              <input
                type="text"
                value={form.TitleCate ?? ''}
                onChange={(e) => handleChange('TitleCate', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Nhập tiêu đề nhóm..."
              />
            </div>

            {/* TemplateSurveyID (Nếu đang chỉnh sửa, nên disable trường này) */}
            <div className="col-span-12 sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">TemplateSurveyID (Thuộc phiếu đánh giá)</label>
              <input
                type="number"
                value={form.TemplateSurveyID ?? ''}
                onChange={(e) => handleChange('TemplateSurveyID', Number(e.target.value))}
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition ${isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                placeholder="ID của mẫu khảo sát"
                disabled={isEditing} // Disable khi chỉnh sửa
              />
            </div>

            {/* ParentID */}
            <div className="col-span-12 sm:col-span-6 hidden">
              <label className="block text-sm font-medium text-gray-700 mb-1">ParentID (Nhóm cha)</label>
              <input
                type="number"
                value={form.ParentID ?? ''}
                onChange={(e) => handleChange('ParentID', e.target.value === '' ? null : e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="ID nhóm cha (nếu có)"
              />
            </div>

            {/* Trạng thái (Status) */}
            <div className="col-span-12 sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={form.StatusID === true ? 'true' : 'false'}
                onChange={(e) => handleChange('StatusID', e.target.value === 'true')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white"
              >
                {Object.entries(StatusID).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => onSave()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormTemplateCategory;