import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react';

// Simple local mock data for question bank
const initialBank = [
    { CriteriaEvaluationID: 1, TypeCriteria: 'likert6', TitleCriteriaEvaluation: 'Giảng viên truyền đạt rõ ràng', StatusID: 1 },
    { CriteriaEvaluationID: 2, TypeCriteria: 'likert6', TitleCriteriaEvaluation: 'Phòng học sạch sẽ', StatusID: 1 },
    { CriteriaEvaluationID: 3, TypeCriteria: 'textarea', TitleCriteriaEvaluation: 'Ý kiến cải tiến khóa học', StatusID: 1 },
];

const ManagerQuestion = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const target = location.state?.pickerTarget || null; // optional target from survey

    const [bank, setBank] = useState(initialBank);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ CriteriaEvaluationID: '', TypeCriteria: 'likert6', TitleCriteriaEvaluation: '', StatusID: 1 });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (editing) {
            const item = bank.find(b => Number(b.CriteriaEvaluationID) === Number(editing));
            if (item) setForm({ ...item });
        } else if (!isAdding) {
            setForm({ CriteriaEvaluationID: '', TypeCriteria: 'likert6', TitleCriteriaEvaluation: '', StatusID: 1 });
        }
    }, [editing, bank, isAdding]);

    const handleAddQuestion = () => {
        setEditing(null);
        setIsAdding(true);
        setForm({ CriteriaEvaluationID: '', TypeCriteria: 'likert6', TitleCriteriaEvaluation: '', StatusID: 1 });
    };

    const clearForm = () => {
        setForm({ CriteriaEvaluationID: '', TypeCriteria: 'likert6', TitleCriteriaEvaluation: '', StatusID: 1 });
        setEditing(null);
        setIsAdding(false);
    };

    const handleCancel = () => {
        clearForm();
    };

    const handleSave = () => {
        if (!form.TitleCriteriaEvaluation.trim()) return;
        if (editing) {
            setBank(bank.map(b => (Number(b.CriteriaEvaluationID) === Number(editing) ? { ...form } : b)));
        } else {
            const newId = bank.length ? Math.max(...bank.map(b => Number(b.CriteriaEvaluationID))) + 1 : 1;
            setBank([...bank, { ...form, CriteriaEvaluationID: newId }]);
        }
        clearForm();
    };

    const handleEdit = (id) => {
        setEditing(id);
        setIsAdding(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
        setBank(bank.filter(b => Number(b.CriteriaEvaluationID) !== Number(id)));
        if (Number(editing) === Number(id)) clearForm();
    };

    const handleDeleteCurrent = () => {
        const idToDelete = editing || form.CriteriaEvaluationID;
        if (!idToDelete) return;
        handleDelete(idToDelete);
    };

    const handleUseAndBack = (item) => {
        navigate(-1, { state: { pickedQuestion: item, pickerTarget: target } });
    };

    const handleRowClick = (item) => {
        // populate form for edit when row clicked
        setEditing(item.CriteriaEvaluationID);
        setForm({ ...item });
        setIsAdding(true);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-800">Quản lý Ngân hàng Câu hỏi</h1>
                    </div>
                    <button onClick={handleAddQuestion} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-150">
                        <Plus className="w-5 h-5" /> Thêm câu hỏi mới
                    </button>
                </div>

                {/* Form Thêm/Sửa/Xóa - LUÔN HIỂN THỊ */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-blue-300">
                    <h2 className="text-xl font-semibold text-blue-700 mb-4">{editing ? `Chỉnh sửa Câu hỏi ID: ${editing}` : 'Thêm Câu hỏi mới'}</h2>
                    <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-12 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại Câu hỏi</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={form.TypeCriteria}
                                onChange={(e) => setForm({ ...form, TypeCriteria: e.target.value })}
                            >
                                <option value="likert6">Thang 6 mức (A-F)</option>
                                <option value="textarea">Ý kiến mở (Text Area)</option>
                            </select>
                        </div>
                        <div className="col-span-12 sm:col-span-7">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung Câu hỏi</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={form.TitleCriteriaEvaluation}
                                onChange={(e) => setForm({ ...form, TitleCriteriaEvaluation: e.target.value })}
                                placeholder="Nhập nội dung câu hỏi..."
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={form.StatusID}
                                onChange={(e) => setForm({ ...form, StatusID: Number(e.target.value) })}
                            >
                                <option value={1}>Hoạt động</option>
                                <option value={0}>Không hoạt động</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-span-12 text-right mt-5 flex justify-end items-center gap-3">
                        <button
                            onClick={clearForm}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            <X className="w-4 h-4" /> Xóa trắng
                        </button>

                        <button
                            onClick={handleDeleteCurrent}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-150 disabled:opacity-50"
                            disabled={!editing}
                        >
                            <Trash2 className="w-4 h-4" /> Xóa
                        </button>

                        <button
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                        >
                            <Save className="w-4 h-4" /> {editing ? 'Cập nhật' : 'Lưu (Thêm mới)'}
                        </button>
                    </div>
                </div>

                {/* Bảng Câu hỏi - Lesson style */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách Câu hỏi Hiện có</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b-2 border-gray-300">
                                <tr>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">ID</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Loại</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Nội dung</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Trạng thái</th>
                                    <th className="px-4 py-3 text-right text-gray-700 font-semibold whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bank.map(item => (
                                    <tr
                                        key={item.CriteriaEvaluationID}
                                        onClick={() => handleRowClick(item)}
                                        className={`cursor-pointer transition ${Number(editing) === Number(item.CriteriaEvaluationID) ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{item.CriteriaEvaluationID}</td>
                                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.TypeCriteria === 'likert6' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {item.TypeCriteria === 'likert6' ? 'Thang đo' : 'Ý kiến'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-800 max-w-xl truncate">{item.TitleCriteriaEvaluation}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.StatusID === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.StatusID === 1 ? 'Hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                                            <div className="inline-flex gap-2 items-center justify-end">
                                                {target && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleUseAndBack(item); }}
                                                        className="px-3 py-1 bg-teal-500 text-white rounded-lg text-xs font-semibold hover:bg-teal-600 transition"
                                                    >
                                                        Sử dụng
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(item.CriteriaEvaluationID); }}
                                                    className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                                    title="Sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.CriteriaEvaluationID); }}
                                                    className="p-2 border border-gray-300 rounded-lg text-red-600 hover:bg-red-50 transition"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerQuestion;