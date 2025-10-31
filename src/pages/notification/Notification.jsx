import React, { useEffect, useRef, useState } from "react";

export default function Notification() {
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
                {/* Second Row - 2 columns */}
                <div className="grid grid-cols-1 gap-6">
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