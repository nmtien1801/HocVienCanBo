import React, { useEffect } from "react";
import { Users, Layers, BookCheck, BookX } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { DashboardTotal, ScheduleByMonth } from "../../redux/dashboardSlice.js";
import { toast } from "react-toastify";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { dashboardTotal, scheduleByMonth } = useSelector((state) => state.dashboard);

    useEffect(() => {
        const fetchDashboardTotal = async () => {
            let res = await dispatch(DashboardTotal());
            if (!res.payload) {
                toast.error(res.payload?.message || "Không thể tải dữ liệu");
            }
        };

        const fetchScheduleByMonth = async () => {
            let res = await dispatch(ScheduleByMonth());
            if (!res.payload) {
                toast.error(res.payload?.message || "Không thể tải lịch học");
            }
        };

        fetchDashboardTotal();
        fetchScheduleByMonth();
    }, [dispatch]);

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Get day and month from date
    const getDateInfo = (dateString) => {
        if (!dateString) return { day: '01', month: 1 };
        const date = new Date(dateString);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.getMonth() + 1
        };
    };

    const scheduleData = scheduleByMonth?.map(item => {
        const dateInfo = getDateInfo(item.StartDate);
        return {
            month: dateInfo.month,
            day: dateInfo.day,
            class: `${item.ClassCode} - ${item.ClassName}`,
            subject: item.SubjectName,
            schedule: `Ngày học: ${item.DayOfWeek} - Kết thúc: ${formatDate(item.EndDate)}`,
            exam: `Ngày thi: ${item.DateNumberDayGraduation}`,
            numberOfStudents: item.NumberStudent,
            facilityName: item.FaciltyName
        };
    }) || [];

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
        <div className="min-h-screen bg-gray-50 py-4 px-4 lg:py-8 lg:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
                    {/* Lớp đang học */}
                    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                            <Users className="text-[#0081cd] flex-shrink-0" size={20} />
                            <span className="text-gray-600 text-xs lg:text-sm font-medium">Lớp đang học</span>
                        </div>
                        <div className="flex items-center justify-between border-l-4 border-[#0081cd]/60 pl-3 lg:pl-4">
                            <p className="text-2xl lg:text-4xl font-semibold text-[#0081cd]">
                                {dashboardTotal?.currentClass || 0}
                            </p>
                        </div>
                    </div>

                    {/* Tổng số môn */}
                    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                            <Layers className="text-cyan-500 flex-shrink-0" size={20} />
                            <span className="text-gray-600 text-xs lg:text-sm font-medium">Tổng số môn</span>
                        </div>
                        <div className="flex items-center justify-between border-l-4 border-cyan-400 pl-3 lg:pl-4">
                            <p className="text-2xl lg:text-4xl font-semibold text-cyan-500">
                                {dashboardTotal?.sumSubject || 0}
                            </p>
                        </div>
                    </div>

                    {/* Số môn đã học */}
                    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                            <BookCheck className="text-green-500 flex-shrink-0" size={20} />
                            <span className="text-gray-600 text-xs lg:text-sm font-medium">Số môn đã học</span>
                        </div>
                        <div className="flex items-center justify-between border-l-4 border-green-400 pl-3 lg:pl-4">
                            <p className="text-2xl lg:text-4xl font-semibold text-green-500">
                                {dashboardTotal?.learnedSubject || 0}
                            </p>
                        </div>
                    </div>

                    {/* Số môn chưa học */}
                    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                            <BookX className="text-red-500 flex-shrink-0" size={20} />
                            <span className="text-gray-600 text-xs lg:text-sm font-medium">Số môn chưa học</span>
                        </div>
                        <div className="flex items-center justify-between border-l-4 border-red-400 pl-3 lg:pl-4">
                            <p className="text-2xl lg:text-4xl font-semibold text-red-500">
                                {dashboardTotal?.notLearnSubject || 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
                    {/* Lịch học trong tháng */}
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-base lg:text-lg font-medium text-gray-700">Lịch học trong tháng</h2>
                            <button className="text-blue-600 text-xs lg:text-sm hover:underline">Xem thêm</button>
                        </div>
                        <div className="p-4 lg:p-6 space-y-3 lg:space-y-4 max-h-96 overflow-y-auto">
                            {scheduleData.length > 0 ? (
                                scheduleData.map((item, index) => (
                                    <div key={index} className="flex gap-3 lg:gap-4 p-3 lg:p-0 bg-gray-50 lg:bg-transparent rounded-lg lg:rounded-none">
                                        <div className="flex-shrink-0 bg-gradient-to-br from-[#0081cd] to-[#026aa8] rounded-lg w-14 h-14 lg:w-16 lg:h-16 flex flex-col items-center justify-center text-white shadow-md">
                                            <span className="text-[9px] lg:text-[10px]">Tháng {item.month}</span>
                                            <span className="text-xl lg:text-2xl font-bold">{item.day}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 text-xs lg:text-sm mb-1 line-clamp-2">
                                                Lớp: {item.class}
                                            </h3>
                                            <p className="text-xs lg:text-sm text-gray-700 mb-1 font-medium line-clamp-1">
                                                Môn: {item.subject}
                                            </p>
                                            <p className="text-[10px] lg:text-xs text-gray-600">{item.schedule}</p>
                                            <p className="text-[10px] lg:text-xs text-gray-600">{item.exam}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-12 text-sm">Không có lịch học</p>
                            )}
                        </div>
                    </div>

                    {/* Lịch thi trong tháng */}
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-base lg:text-lg font-medium text-gray-700">Lịch thi trong tháng</h2>
                            <button className="text-blue-600 text-xs lg:text-sm hover:underline">Xem thêm</button>
                        </div>
                        <div className="p-4 lg:p-6 space-y-3 lg:space-y-4 max-h-96 overflow-y-auto">
                            {examData.map((item, index) => (
                                <div key={index} className="flex gap-3 lg:gap-4 p-3 lg:p-0 bg-gray-50 lg:bg-transparent rounded-lg lg:rounded-none">
                                    <div className="flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg w-14 h-14 lg:w-16 lg:h-16 flex flex-col items-center justify-center text-white shadow-md">
                                        <span className="text-[9px] lg:text-[10px]">Tháng {item.month}</span>
                                        <span className="text-xl lg:text-2xl font-bold">{item.day}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 text-xs lg:text-sm mb-1 line-clamp-2">
                                            {item.subject}
                                        </h3>
                                        <p className="text-[10px] lg:text-xs text-gray-600">
                                            Lớp: {item.class}
                                        </p>
                                        <p className="text-[10px] lg:text-xs text-gray-600">
                                            Thời gian: {item.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Lịch học của lớp bạn */}
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-base lg:text-lg font-medium text-gray-700">Lịch học của lớp bạn</h2>
                            <button className="text-blue-600 text-xs lg:text-sm hover:underline">Xem thêm</button>
                        </div>
                        <div className="p-4 lg:p-6">
                            <p className="text-gray-400 text-center py-12 text-sm">Không có dữ liệu</p>
                        </div>
                    </div>

                    {/* Thông báo */}
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-base lg:text-lg font-medium text-gray-700">Thông báo</h2>
                            <button className="text-blue-600 text-xs lg:text-sm hover:underline">Xem thêm</button>
                        </div>
                        <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                            {notifications.map((item, index) => (
                                <div key={index} className="flex gap-3 lg:gap-4 p-3 lg:p-0 bg-gray-50 lg:bg-transparent rounded-lg lg:rounded-none">
                                    <div className={`flex-shrink-0 w-20 lg:w-24 h-12 lg:h-14 flex items-center justify-center text-white text-[10px] lg:text-[11px] font-bold rounded shadow-md ${item.type === 'QUYẾT ĐỊNH'
                                        ? 'bg-gradient-to-br from-red-600 to-red-700'
                                        : 'bg-gradient-to-br from-orange-500 to-orange-600'
                                        }`}>
                                        {item.type}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 text-xs lg:text-sm mb-1 line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-[10px] lg:text-xs text-gray-500 italic leading-relaxed line-clamp-3">
                                            {item.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 lg:mt-8 text-center lg:text-right text-[10px] lg:text-xs text-gray-500">
                    Copyright © 2023 by G&BSoft
                </div>
            </div>
        </div>
    );
}