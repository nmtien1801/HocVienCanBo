import React, { useEffect, useRef, useState } from "react";
import { Users, Layers, BookCheck, BookX } from 'lucide-react';

export default function Dashboard() {
    const scheduleData = [
        {
            month: 10,
            day: '10',
            class: '210240 - TC.240 (CS1)',
            subject: 'Thực tiễn và kinh nghiệm xây dựng, phát triển địa phương',
            schedule: 'Ngày học: T2, T4, T6 - Kết thúc: 05/11/2025',
            exam: 'Ngày thi: 21/11/2025'
        },
        {
            month: 8,
            day: '13',
            class: '210240 - TC.240 (CS1)',
            subject: 'Kỹ năng lãnh đạo, quản lý',
            schedule: 'Ngày học: T2, T4, T6 - Kết thúc: 08/10/2025',
            exam: 'Ngày thi: 24/10/2025'
        },
        {
            month: 10,
            day: '01',
            class: '210946 - H.946 (NB)',
            subject: 'Nghiên cứu thực tế',
            schedule: 'Ngày học: 4 - Kết thúc: 01/10/2025',
            exam: 'Ngày thi: 01/10/2025'
        },
        {
            month: 10,
            day: '10',
            class: '210949 - H.949 (Q1)',
            subject: 'Kiến thức bổ trợ',
            schedule: 'Ngày học: 4, 6 - Kết thúc: 29/10/2025',
            exam: 'Ngày thi: 14/11/2025'
        }
    ];

    const examData = [
        {
            month: 10,
            day: '01',
            subject: 'Thực tiễn và kinh nghiệm xây dựng, phát triển địa phương',
            class: 'TC.239 (Học viên)',
            time: '180 - Thứ: Tư'
        },
        {
            month: 10,
            day: '01',
            subject: 'Kiến thức bổ trợ',
            class: 'TC.239 (Học viên)',
            time: '180 - Thứ: Tư'
        },
        {
            month: 10,
            day: '01',
            subject: 'Nghiên cứu thực tế',
            class: 'H.946 (Nhà Bè)',
            time: '180 - Thứ: Tư'
        },
        {
            month: 10,
            day: '01',
            subject: 'Nội dung cơ bản của Chủ nghĩa Mác-Lênin (HP CNXHKH)',
            class: 'H.961 (Học viên - Cục thuế TPHCM)',
            time: '180 - Thứ: Tư'
        }
    ];

    const notifications = [
        {
            type: 'QUYẾT ĐỊNH',
            title: 'Thông báo sử dụng website tra cứu thông tin mới',
            content: 'Thông báo sử dụng website tra cứu thông tin lịch học, bảng điểm cho học viên, giảng viên. để thuận tiện cho việc tra cứu là sắp xếp lịch giảng dạy.'
        },
        {
            type: 'THÔNG BÁO',
            title: 'Thông báo sử dụng website tra cứu thông tin lịch học, bảng điểm cho học viên, giảng viên',
            content: 'Thông báo sử dụng website tra cứu thông tin lịch học, bảng điểm cho học viên, giảng viên. để thuận tiện cho việc tra cứu là sắp xếp lịch giảng dạy.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Stats Cards - 4 columns */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {/* Lớp đang học */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-[#0081cd]" size={22} />
                            <span className="text-gray-600 text-sm font-medium">Lớp đang học</span>
                        </div>
                        <div className="flex items-center justify-between border-l-4 border-[#0081cd]/60 pl-4">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Tổng số môn</p>
                                <p className="text-4xl font-semibold text-[#0081cd]">0</p>
                            </div>
                        </div>
                    </div>

                    {/* Tổng số môn */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Layers className="text-cyan-500" size={22} />
                            <span className="text-gray-600 text-sm font-medium">Tổng số môn</span>
                        </div>
                        <div className="flex items-center justify-between border-l-4 border-cyan-400 pl-4">
                            <p className="text-4xl font-semibold text-cyan-500">0</p>
                        </div>
                    </div>

                    {/* Số môn đã học */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BookCheck className="text-green-500" size={22} />
                            <span className="text-gray-600 text-sm font-medium">Số môn đã học</span>
                        </div>
                        <div className="flex items-center justify-between border-l-4 border-green-400 pl-4">
                            <p className="text-4xl font-semibold text-green-500">0</p>
                        </div>
                    </div>

                    {/* Số môn chưa học */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BookX className="text-red-500" size={22} />
                            <span className="text-gray-600 text-sm font-medium">Số môn chưa học</span>
                        </div>
                        <div className="flex items-center justify-between border-l-4 border-red-400 pl-4">
                            <p className="text-4xl font-semibold text-red-500">0</p>
                        </div>
                    </div>
                </div>


                {/* Main Content Grid - 2 columns */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Lịch học trong tháng */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-normal text-gray-600">Lịch học trong tháng</h2>
                            <button className="text-blue-600 text-sm hover:underline">Xem thêm</button>
                        </div>
                        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                            {scheduleData.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 bg-gray-400 rounded-lg w-16 h-16 flex flex-col items-center justify-center text-white">
                                        <span className="text-[10px]">Tháng {item.month}</span>
                                        <span className="text-2xl font-bold">{item.day}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm mb-1">
                                            Lớp: {item.class} - Môn học: {item.subject}
                                        </h3>
                                        <p className="text-xs text-gray-600">{item.schedule}</p>
                                        <p className="text-xs text-gray-600">{item.exam}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lịch thi trong tháng */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-normal text-gray-600">Lịch thi trong tháng</h2>
                            <button className="text-blue-600 text-sm hover:underline">Xem thêm...</button>
                        </div>
                        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                            {examData.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 bg-gray-400 rounded-lg w-16 h-16 flex flex-col items-center justify-center text-white">
                                        <span className="text-[10px]">Tháng {item.month}</span>
                                        <span className="text-2xl font-bold">{item.day}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.subject}</h3>
                                        <p className="text-xs text-gray-600">Lớp: {item.class} - Thời gian: {item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Second Row - 2 columns */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Lịch học của lớp bạn */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-normal text-gray-600">Lịch học của lớp bạn</h2>
                            <button className="text-blue-600 text-sm hover:underline">Xem thêm</button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-400 text-center py-12 text-sm">Không có dữ liệu</p>
                        </div>
                    </div>

                    {/* Thông báo */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-normal text-gray-600">Thông báo</h2>
                            <button className="text-blue-600 text-sm hover:underline">Xem thêm...</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {notifications.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className={`flex-shrink-0 w-24 h-14 flex items-center justify-center text-white text-[11px] font-bold rounded ${item.type === 'QUYẾT ĐỊNH' ? 'bg-red-700' : 'bg-orange-500'}`}>
                                        {item.type}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-500 italic leading-relaxed">{item.content}</p>
                                    </div>
                                </div>
                            ))}
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