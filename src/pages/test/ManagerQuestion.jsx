import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react';

// Simple local mock data for question bank
const initialBank = [
    { CriteriaEvaluationID: 1, TypeCriteria: 'likert6', TitleCriteriaEvaluation: 'Giảng viên truyền đạt rõ ràng', StatusID: 1 },
    { CriteriaEvaluationID: 2, TypeCriteria: 'likert6', TitleCriteriaEvaluation: 'Phòng học sạch sẽ', StatusID: 1 },
    { CriteriaEvaluationID: 3, TypeCriteria: 'textarea', TitleCriteriaEvaluation: 'Ý kiến cải tiến khóa học', StatusID: 1 },
];

const initialFormState = { CriteriaEvaluationID: '', TypeCriteria: 'likert6', TitleCriteriaEvaluation: '', StatusID: 1 };

const ManagerQuestion = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { state } = location;
    const target = state?.pickerTarget || null;

    const [bank, setBank] = useState(initialBank);
    // editing sẽ lưu ID của câu hỏi đang được chỉnh sửa. null nếu đang thêm mới/xóa trắng.
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(initialFormState);

    // Form luôn hiển thị, không cần state isAdding. Chúng ta dùng editing (ID hoặc null) để quản lý trạng thái.

    useEffect(() => {
        // Load dữ liệu lên form khi state 'editing' thay đổi
        if (editing !== null) {
            const item = bank.find(b => Number(b.CriteriaEvaluationID) === Number(editing));
            if (item) {
                // Cập nhật form với dữ liệu của câu hỏi đang chỉnh sửa
                setForm({ ...item });
            } else {
                // Nếu ID không hợp lệ, chuyển sang trạng thái thêm mới/xóa trắng
                setEditing(null);
                setForm(initialFormState);
            }
        } else {
            // Khi editing là null, form về trạng thái trống (Thêm mới)
            // Lưu ý: Chúng ta không reset form ở đây để giữ lại giá trị người dùng đang nhập
            // nếu họ đang ở trạng thái 'Thêm mới' (editing: null)
        }
    }, [editing, bank]);

    // Hàm Xóa trắng form, chuẩn bị cho việc Thêm mới
    const clearForm = () => {
        setForm(initialFormState);
        setEditing(null); // Đặt editing về null
    };

    // Hàm được gọi khi nhấn vào một hàng (row)
    const handleRowClick = (item) => {
        // Ping dữ liệu lên form
        setForm({ ...item });
        // Đặt ID để chuyển sang chế độ Chỉnh sửa
        setEditing(item.CriteriaEvaluationID);
    };

    const handleSave = () => {
        if (!form.TitleCriteriaEvaluation.trim()) return;

        if (editing) {
            // Chế độ chỉnh sửa
            setBank(bank.map(b => (Number(b.CriteriaEvaluationID) === Number(editing) ? { ...form } : b)));
        } else {
            // Chế độ thêm mới
            const newId = bank.length ? Math.max(...bank.map(b => Number(b.CriteriaEvaluationID))) + 1 : 1;
            setBank([...bank, { ...form, CriteriaEvaluationID: newId }]);
        }

        clearForm(); // Xóa trắng form sau khi lưu thành công
    };

    const handleDelete = (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
        setBank(bank.filter(b => Number(b.CriteriaEvaluationID) !== Number(id)));
        if (Number(editing) === Number(id)) {
            clearForm(); // Xóa trắng form nếu câu hỏi đang được chỉnh sửa bị xóa
        }
    };

    const handleDeleteCurrent = () => {
        const idToDelete = editing || form.CriteriaEvaluationID;
        if (!idToDelete || !editing) return; // Chỉ xóa nếu đang chỉnh sửa một câu hỏi hiện có
        handleDelete(idToDelete);
    };

    const handleUseAndBack = (item) => {
        navigate(-1, { state: { pickedQuestion: item, pickerTarget: target } });
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

                </div>

                {/* Form Thêm/Sửa/Xóa - LUÔN HIỂN THỊ */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-blue-300">
                    <h2 className="text-xl font-semibold text-blue-700 mb-4">
                        {editing ? `Chỉnh sửa Câu hỏi ID: ${editing}` : 'Thêm Câu hỏi mới'}
                    </h2>
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
                            disabled={!editing} // Chỉ cho phép xóa khi đang chỉnh sửa một item hiện có
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

                {/* Bảng Câu hỏi */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách Câu hỏi Hiện có</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm divide-y divide-gray-200">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bank.map(item => (
                                    // Bổ sung sự kiện onClick vào hàng (row) để ping dữ liệu lên form
                                    <tr
                                        key={item.CriteriaEvaluationID}
                                        onClick={() => handleRowClick(item)} // Xử lý click row
                                        className={`cursor-pointer transition ${Number(editing) === Number(item.CriteriaEvaluationID) ? 'bg-blue-200/50' : 'hover:bg-blue-50'}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.CriteriaEvaluationID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.TypeCriteria === 'likert6' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {item.TypeCriteria === 'likert6' ? 'Thang đo' : 'Ý kiến'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-sm text-gray-800">{item.TitleCriteriaEvaluation}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.StatusID === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.StatusID === 1 ? 'Hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="inline-flex gap-2 items-center">
                                                {target && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleUseAndBack(item); }} // Ngăn chặn nổi bọt khi click
                                                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition"
                                                    >
                                                        Sử dụng
                                                    </button>
                                                )}
                                                {/* Xóa nút Sửa và Xóa ở đây vì hành động đó được xử lý qua Row Click */}
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