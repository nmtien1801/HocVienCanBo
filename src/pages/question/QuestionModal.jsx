import React from "react";
import { X, Save, Trash2 } from "lucide-react";

const QuestionModal = ({
    open,
    onClose,
    form,
    setForm,
    editing,
    handleSave,
    handleDeleteCurrent,
    TypeCriteriaInt
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-blue-700">
                        {editing ? `Chỉnh sửa câu hỏi ID: ${editing}` : "Thêm câu hỏi mới"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="grid grid-cols-12 gap-4 items-end">
                    {/* HÀNG 1: Nội dung (Chiếm hết 12 cột) */}
                    <div className="col-span-12">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập nội dung câu hỏi..."
                            value={form.TitleCriteriaEvaluation}
                            onChange={(e) => setForm({ ...form, TitleCriteriaEvaluation: e.target.value })}
                        />
                    </div>

                    {/* HÀNG 2: Hai Select nằm cùng 1 hàng (Mỗi cái 6 cột) */}

                    {/* 1. Loại câu hỏi */}
                    <div className="col-span-12 sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại câu hỏi</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.TypeCriteria}
                            onChange={(e) => setForm({ ...form, TypeCriteria: Number(e.target.value) })}
                        >
                            <option value={TypeCriteriaInt.LIKERT}>Câu hỏi khảo sát</option>
                            <option value={TypeCriteriaInt.TEXTAREA}>câu hỏi tự luận</option>
                        </select>
                    </div>

                    {/* 2. Trạng thái */}
                    <div className="col-span-12 sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.StatusID ? "true" : "false"}
                            onChange={(e) => setForm({ ...form, StatusID: e.target.value === "true" })}
                        >
                            <option value="true">Hoạt động</option>
                            <option value="false">Tạm dừng</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    {editing && (
                        <button
                            onClick={handleDeleteCurrent}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Xóa
                        </button>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Save className="w-4 h-4" /> {editing ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionModal;