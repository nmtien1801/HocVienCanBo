import React, { useEffect } from 'react';

const FormQuestion = ({ visible, onClose, form, setForm, onSave, onDeleteCurrent, editing }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (visible) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{editing ? `Chỉnh sửa Câu hỏi ID: ${editing}` : 'Thêm câu hỏi mới'}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 px-2">Đóng</button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại Câu hỏi</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.TypeCriteria?.toString() || ''}
                onChange={(e) => setForm({ ...form, TypeCriteria: Number(e.target.value) })}
              >
                <option value="1">Thang 6 mức (A-F)</option>
                <option value="2">Ý kiến mở (Text Area)</option>
              </select>
            </div>

            <div className="col-span-12 sm:col-span-7">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung Câu hỏi</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.TitleCriteriaEvaluation}
                onChange={(e) => setForm({ ...form, TitleCriteriaEvaluation: e.target.value })}
                placeholder="Nhập nội dung câu hỏi..."
              />
            </div>

            <div className="col-span-12 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.StatusID === true ? 'true' : 'false'}
                onChange={(e) => setForm({ ...form, StatusID: e.target.value === 'true' })}
              >
                <option value="true">Hoạt động</option>
                <option value="false">Tạm dừng</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-white border rounded">Hủy</button>
            <button onClick={onDeleteCurrent} className="px-4 py-2 bg-red-500 text-white rounded" disabled={!editing}>Xóa</button>
            <button onClick={() => onSave()} className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormQuestion;
