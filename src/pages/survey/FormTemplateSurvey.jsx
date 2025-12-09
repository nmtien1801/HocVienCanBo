import React, { useEffect } from 'react';

const FormTemplateSurvey = ({ visible, onClose, form, setForm, onSave }) => {
  // Handle ESC key to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (visible) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  // Helper change handler để code gọn hơn
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with Blur effect */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-gray-100">

          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {form.TemplateSurveyID ? 'Cập nhật Chủ đề' : 'Thêm Chủ đề mới'}
              </h3>
              {form.TemplateSurveyID && (
                <p className="mt-1 text-xs text-gray-500">ID: {form.TemplateSurveyID}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-12 gap-6">

              {/* Loại mẫu */}
              <div className="col-span-12 sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại mẫu</label>
                <select
                  value={form.TypeTemplate ?? 1}
                  onChange={(e) => handleChange('TypeTemplate', Number(e.target.value))}
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white"
                >
                  <option value={1}>Mẫu khảo sát 1</option>
                  <option value={2}>Mẫu khảo sát 2</option>
                </select>
              </div>

              {/* Quyền */}
              <div className="col-span-12 sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quyền (Permission)</label>
                <input
                  type="number"
                  value={form.Permission ?? 0}
                  onChange={(e) => handleChange('Permission', Number(e.target.value))}
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Tiêu đề */}
              <div className="col-span-12">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.Title ?? ''}
                  onChange={(e) => handleChange('Title', e.target.value)}
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-gray-400"
                  placeholder="Nhập tiêu đề chủ đề..."
                />
              </div>

              {/* Mô tả ngắn */}
              <div className="col-span-12">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea
                  value={form.ShorDescription ?? ''}
                  onChange={(e) => handleChange('ShorDescription', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-gray-400"
                  placeholder="Mô tả sơ lược về nội dung..."
                />
              </div>

              {/* Yêu cầu */}
              <div className="col-span-12">
                <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu (Requirements)</label>
                <textarea
                  value={form.Requiments ?? ''}
                  onChange={(e) => handleChange('Requiments', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-gray-400"
                  placeholder="Các yêu cầu cần thiết..."
                />
              </div>

              {/* Trạng thái */}
              <div className="col-span-12 sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={form.StatusID === true ? 'true' : 'false'}
                  onChange={(e) => handleChange('StatusID', e.target.value === 'true')}
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white"
                >
                  <option value="true">Đang hoạt động</option>
                  <option value="false">Tạm dừng</option>
                </select>
              </div>

              {/* Image Path */}
              <div className="col-span-12 sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.ImagePath ?? ''}
                    onChange={(e) => handleChange('ImagePath', e.target.value)}
                    className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-gray-400"
                    placeholder="https://..."
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl border-t border-gray-100">
            <button
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => onSave()}
              className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FormTemplateSurvey;