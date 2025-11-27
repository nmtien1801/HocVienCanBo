import React, { useEffect } from "react";
import { Users, Layers, BookCheck, BookX } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { DashboardTotal, ScheduleByMonth, ScheduleByExamination, ListInformation, ScheduleClassSubject } from "../../redux/dashboardSlice.js";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dashboardTotal, scheduleByMonth, scheduleByExamination, listInformation, scheduleClassSubject } = useSelector((state) => state.dashboard);

    useEffect(() => {
        const fetchDashboardTotal = async () => {
            let res = await dispatch(DashboardTotal());
            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message);
            }
        };

        const fetchScheduleByMonth = async () => {
            let res = await dispatch(ScheduleByMonth());
            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message);
            }
        };

        const fetchListInformation = async () => {
            let res = await dispatch(ListInformation());
            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message);
            }
        };

        const fetchScheduleByExamination = async () => {
            let res = await dispatch(ScheduleByExamination());
            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message);
            }
        }


        const fetchScheduleClassSubject = async () => {
            let res = await dispatch(ScheduleClassSubject());
            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message);
            }
        };

        fetchScheduleClassSubject();
        fetchDashboardTotal();
        fetchScheduleByMonth();
        fetchListInformation();
        fetchScheduleByExamination();
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

        if (typeof dateString === 'string' && dateString.includes('/')) {
            const parts = dateString.split('/');
            return {
                day: parts[0],
                month: parseInt(parts[1])
            };
        }

        // Otherwise parse as Date object
        const date = new Date(dateString);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.getMonth() + 1
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 lg:py-8 lg:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Stats Cards - Responsive Grid */}
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

                {/* Main Content Grid - Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
                    {/* Lịch học trong tháng */}
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-base lg:text-lg font-medium text-gray-700">Lịch học trong tháng</h2>
                            <button className="text-blue-600 text-xs lg:text-sm hover:underline cursor-pointer" onClick={() => { navigate('/scheduleMonth') }}>Xem thêm</button>
                        </div>
                        <div className="p-4 lg:p-6 space-y-3 lg:space-y-4 max-h-96 overflow-y-auto">
                            {scheduleByMonth.length > 0 ? (
                                scheduleByMonth.map((item, index) => (
                                    <div key={index} className="flex gap-3 lg:gap-4 p-3 lg:p-0 bg-gray-50 lg:bg-transparent rounded-lg lg:rounded-none">
                                        <div className="flex-shrink-0 bg-gradient-to-br from-[#0081cd] to-[#026aa8] rounded-lg w-14 h-14 lg:w-16 lg:h-16 flex flex-col items-center justify-center text-white shadow-md">
                                            <span className="text-[9px] lg:text-[10px]">Tháng {getDateInfo(item.startDate).month}</span>
                                            <span className="text-xl lg:text-2xl font-bold">{getDateInfo(item.startDate).day}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 text-xs lg:text-sm mb-1 line-clamp-2">
                                                Lớp: {item.ClassCode} - {item.ClassName}
                                            </h3>
                                            <p className="text-xs lg:text-sm text-gray-700 mb-1 font-medium line-clamp-1">
                                                Môn: {item.SubjectName}
                                            </p>
                                            <p className="text-[10px] lg:text-xs text-gray-600">Ngày học: {item.DayOfWeek} - Kết thúc: {formatDate(item.EndDate)}</p>
                                            <p className="text-[10px] lg:text-xs text-gray-600">Ngày thi: {item.DateNumberDayGraduation}</p>
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
                            <button className="text-blue-600 text-xs lg:text-sm hover:underline cursor-pointer" onClick={() => { navigate('/schedule-exam-month') }}>Xem thêm</button>
                        </div>
                        <div className="p-4 lg:p-6 space-y-3 lg:space-y-4 max-h-96 overflow-y-auto">
                            {scheduleByExamination.length > 0 ? (
                                scheduleByExamination.map((item, index) => (
                                    <div key={index} className="flex gap-3 lg:gap-4 p-3 lg:p-0 bg-gray-50 lg:bg-transparent rounded-lg lg:rounded-none">
                                        <div className="flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg w-14 h-14 lg:w-16 lg:h-16 flex flex-col items-center justify-center text-white shadow-md">
                                            <span className="text-[9px] lg:text-[10px]">Tháng {item.month}</span>
                                            <span className="text-xl lg:text-2xl font-bold">{item.day}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 text-xs lg:text-sm mb-1 line-clamp-2">
                                                {item.SubjectName}
                                            </h3>
                                            <p className="text-[10px] lg:text-xs text-gray-600">
                                                Lớp: {item.ClassName}
                                            </p>
                                            <p className="text-[10px] lg:text-xs text-gray-600">
                                                Thời gian: {item.TimeExam} phút - Thứ: {item.DayofWeek}
                                            </p>
                                            {item.TeacherName && (
                                                <p className="text-[10px] lg:text-xs text-gray-500 italic">
                                                    GV: {item.TeacherName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-12 text-sm">Không có lịch thi</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Second Row - Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Lịch học của lớp bạn */}
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-base lg:text-lg font-medium text-gray-700">Lịch học của lớp bạn</h2>
                            <button className="text-blue-600 text-xs lg:text-sm hover:underline cursor-pointer">Xem thêm</button>
                        </div>
                        <div className="p-4 lg:p-6 space-y-4 max-h-96 overflow-y-auto">
                            {scheduleClassSubject && scheduleClassSubject.length > 0 ? (
                                scheduleClassSubject.map((item, index) => {
                                    const startDate = new Date(item.DateStart);
                                    const formattedStartDate = startDate.toLocaleDateString('vi-VN');
                                    const displayDate = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`;

                                    return (
                                        <div key={index} className="flex gap-3 items-start">
                                            {/* Date Badge */}
                                            <div className="flex-shrink-0 bg-teal-500 text-white px-3 py-1.5 rounded font-medium text-sm shadow-md min-w-[100px] text-center">
                                                {displayDate}
                                            </div>

                                            {/* Timeline Dot and Line */}
                                            <div className="flex flex-col items-center pt-1">
                                                <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white"></div>
                                                {index < scheduleClassSubject.length - 1 && (
                                                    <div className="w-0.5 h-full bg-gray-200 min-h-[60px]"></div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 pb-4">
                                                <h3 className="font-semibold text-gray-800 text-sm mb-1.5">
                                                    {item.SubjectCode} - {item.SubjectName}
                                                </h3>
                                                <p className="text-xs text-gray-600 mb-0.5">
                                                    <span className="font-medium">Thời gian:</span> {formattedStartDate} đến {new Date(item.DateEnd).toLocaleDateString('vi-VN')} - <span className="font-medium">Ngày học:</span> {item.WeekDay}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    <span className="font-medium">Ngày thi:</span> {new Date(item.DateNumberDayGraduation).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-400 text-center py-12 text-sm">Không có dữ liệu</p>
                            )}
                        </div>
                    </div>

                    {/* Thông báo */}
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-base lg:text-lg font-medium text-gray-700">Thông báo</h2>
                            <button className="text-blue-600 text-xs lg:text-sm hover:underline cursor-pointer" onClick={() => { navigate('/notification') }}>Xem thêm</button>
                        </div>
                        <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                            {listInformation.length > 0 ? (
                                listInformation.map((item, index) => (
                                    <div key={index} className="flex gap-3 lg:gap-4 p-3 lg:p-0 bg-gray-50 lg:bg-transparent rounded-lg lg:rounded-none">
                                        <div className={`flex-shrink-0 w-20 lg:w-24 h-12 lg:h-14 rounded shadow-md`}>
                                            <img
                                                src={item.ImagesPath}
                                                alt="Thông báo"
                                                className="w-full h-full object-cover rounded cursor-pointer"
                                                onClick={() => navigate(`/notification-detail?id=${item.NewsID}`)}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 text-xs lg:text-sm mb-1 line-clamp-2 cursor-pointer" onClick={() => navigate(`/notification-detail?id=${item.NewsID}`)}>
                                                {item.Title}
                                            </h3>
                                            <p className="text-[10px] lg:text-xs text-gray-500 italic leading-relaxed line-clamp-3">
                                                {item.ShortDescription}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-12 text-sm">Không có thông báo</p>
                            )}
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