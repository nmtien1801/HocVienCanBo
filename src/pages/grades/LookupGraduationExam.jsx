import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

export default function LookupGraduationExam() {
    const [studentCode, setStudentCode] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const scoreData = [];

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronUp size={14} className="text-gray-400" />;
        }
        return sortConfig.direction === 'asc' ?
            <ChevronUp size={14} className="text-gray-600" /> :
            <ChevronDown size={14} className="text-gray-600" />;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <h1 className="text-2xl text-gray-600 mb-6">Tra cứu điểm thi tốt nghiệp</h1>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Tìm kiếm</label>
                            <input
                                type="text"
                                value={studentCode}
                                onChange={(e) => setStudentCode(e.target.value)}
                                placeholder="Mã học viên"
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-80 placeholder-gray-400"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-80 text-gray-500"
                            >
                                <option value="">------ Chọn môn học ------</option>
                                <option value="237">Thực tiễn và kinh nghiệm xây dựng, phát triển địa phương</option>
                                <option value="196">Kỹ năng lãnh đạo, quản lý</option>
                                <option value="300">Nghiên cứu thực tế</option>
                            </select>
                        </div>

                        <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center gap-2 text-sm">
                            <Search size={16} />
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('stt')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>STT</span>
                                            <SortIcon columnKey="stt" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('maHocVien')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Mã số học viên</span>
                                            <SortIcon columnKey="maHocVien" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('hoTen')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Họ và tên</span>
                                            <SortIcon columnKey="hoTen" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('ngaySinh')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Ngày sinh</span>
                                            <SortIcon columnKey="ngaySinh" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('lanThi1')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>[LT]Lần thi 1</span>
                                            <SortIcon columnKey="lanThi1" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('lanThi2')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>[LT]Lần thi 2</span>
                                            <SortIcon columnKey="lanThi2" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('ketQua')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Kết quả</span>
                                            <SortIcon columnKey="ketQua" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('ghiChu')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Ghi chú</span>
                                            <SortIcon columnKey="ghiChu" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {scoreData.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                                            No data available in table
                                        </td>
                                    </tr>
                                ) : (
                                    scoreData.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3 border-r border-gray-200">{row.stt}</td>
                                            <td className="px-4 py-3 border-r border-gray-200">{row.maHocVien}</td>
                                            <td className="px-4 py-3 border-r border-gray-200">{row.hoTen}</td>
                                            <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ngaySinh}</td>
                                            <td className="px-4 py-3 border-r border-gray-200 text-center">{row.lanThi1}</td>
                                            <td className="px-4 py-3 border-r border-gray-200 text-center">{row.lanThi2}</td>
                                            <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ketQua}</td>
                                            <td className="px-4 py-3">{row.ghiChu}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing 0 to 0 of 0 entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-200 text-gray-500 rounded text-sm cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-200 text-gray-500 rounded text-sm cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-right text-xs text-gray-500">
                    Copyright © 2023 by G&BSoft
                </div>
            </div>
        </div>
    );
}