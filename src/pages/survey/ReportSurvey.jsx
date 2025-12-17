import React, { useState, useMemo } from 'react';
import { BarChart3, Table as TableIcon, CheckCircle2, Users } from 'lucide-react';

const ReportSurvey = () => {
    // 1. Danh sách tiêu chí gốc (Có thể load từ API)
    const allCriteria = [
        { id: 'A', label: 'Rất hài lòng' },
        { id: 'B', label: 'Hài lòng' },
        { id: 'C', label: 'Bình thường' },
        { id: 'D', label: 'Không hài lòng' },
    ];

    // 2. Mock data dữ liệu khảo sát (Dữ liệu thô từ database)
    const surveyData = [
        { id: 1, question: "Chất lượng giảng dạy của giảng viên", results: { A: 15, B: 5, C: 2, D: 0 } },
        { id: 2, question: "Cơ sở vật chất phòng học", results: { A: 8, B: 10, C: 4, D: 2 } },
        { id: 3, question: "Nội dung học phần phù hợp thực tế", results: { A: 12, B: 8, C: 1, D: 1 } },
    ];

    // 3. State quản lý các tiêu chí được chọn để hiển thị
    const [selectedCriteria, setSelectedCriteria] = useState(['A', 'B', 'C', 'D']);

    // Hàm xử lý khi check/uncheck tiêu chí
    const handleCheckboxChange = (id) => {
        setSelectedCriteria(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    // Tính toán tổng số lượng cho từng hàng dựa trên tiêu chí được chọn
    const calculateRowTotal = (results) => {
        return selectedCriteria.reduce((sum, key) => sum + (results[key] || 0), 0);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <BarChart3 className="text-[#0081cd]" />
                            Báo cáo kết quả khảo sát
                        </h1>
                        <p className="text-gray-500 text-sm">Xem thống kê chi tiết theo các tiêu chí đánh giá</p>
                    </div>
                </div>

                {/* Bộ lọc tiêu chí động */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        Chọn tiêu chí hiển thị:
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {allCriteria.map(item => (
                            <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedCriteria.includes(item.id)}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    className="w-4 h-4 text-[#0081cd] rounded border-gray-300 focus:ring-[#0081cd]"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                    {item.id}. {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Bảng dữ liệu động */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-sm font-bold text-gray-700 w-16">STT</th>
                                    <th className="p-4 text-sm font-bold text-gray-700">Nội dung câu hỏi</th>

                                    {/* Header động dựa trên tiêu chí được chọn */}
                                    {allCriteria.filter(c => selectedCriteria.includes(c.id)).map(c => (
                                        <th key={c.id} className="p-4 text-sm font-bold text-center text-[#026aa8] bg-blue-50/50">
                                            {c.id}
                                        </th>
                                    ))}

                                    <th className="p-4 text-sm font-bold text-center text-gray-700 bg-gray-100">Tổng cộng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {surveyData.map((row, index) => (
                                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600 font-medium">{index + 1}</td>
                                        <td className="p-4 text-sm text-gray-800 font-medium">{row.question}</td>

                                        {/* Cột dữ liệu động */}
                                        {allCriteria.filter(c => selectedCriteria.includes(c.id)).map(c => (
                                            <td key={c.id} className="p-4 text-sm text-center text-gray-600">
                                                {row.results[c.id] || 0}
                                            </td>
                                        ))}

                                        {/* Cột Total động */}
                                        <td className="p-4 text-sm text-center font-bold text-gray-900 bg-gray-50">
                                            {calculateRowTotal(row.results)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {selectedCriteria.length === 0 && (
                        <div className="p-8 text-center text-gray-400 italic">
                            Vui lòng chọn ít nhất một tiêu chí để xem dữ liệu.
                        </div>
                    )}
                </div>

                {/* Summary Mini Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-3">
                        <Users className="text-[#0081cd]" size={24} />
                        <div>
                            <p className="text-xs text-blue-600 font-semibold uppercase">Tổng lượt khảo sát</p>
                            <p className="text-xl font-bold text-gray-800">128</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportSurvey;