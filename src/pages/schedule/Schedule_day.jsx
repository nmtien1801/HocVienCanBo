import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { getScheduleDaily } from '../../redux/scheduleSlice.js';
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

// Tốc độ cuộn
const SCROLL_DURATION = "15s"; 
// Chiều cao cố định của vùng cuộn (Ví dụ: 480px)
const H_TABLE = "h-[480px]"; 
// Chiều cao khoảng trắng giữa các lần lặp
const BLANK_SPACE_HEIGHT = '300px'; 

export default function ScheduleDay() {
    const dispatch = useDispatch();
    const { scheduleDaily } = useSelector((state) => state.schedule);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScheduleDaily = async () => {
            setIsLoading(true);
            try {
                const res = await dispatch(getScheduleDaily());
                // ... (xử lý kết quả)
            } catch (err) {
                setError("Đã có lỗi xảy ra khi tải dữ liệu");
            } finally {
                setIsLoading(false);
            }
        };

        fetchScheduleDaily();
    }, [dispatch]);

    // Hàm render một hàng dữ liệu lịch học
    const renderRow = (row, index) => (
        <tr 
            // Lưu ý: Key không nên dùng index của map nếu dữ liệu bị nhân đôi
            key={`data-${index}`} 
            className="text-2xl" 
            style={{ 
                backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff', 
                height: '60px' // Chiều cao hàng dữ liệu
            }} 
        >
            <td className="px-4 py-2 text-center whitespace-nowrap">{row.ClassName}</td>
            <td className="px-4 py-2 text-center whitespace-nowrap">{row.RoomName}</td>
            <td className="px-4 py-2 text-center whitespace-nowrap">{row.PeriodName}</td>
            <td className="px-4 py-2 text-left whitespace-nowrap">{row.SubjectName}</td>
        </tr>
    );

    // Hàm render khoảng trắng (Dùng để tạo khe hở giữa các lần lặp)
    const renderBlankRow = () => (
        <tr key="blank-space" style={{ height: BLANK_SPACE_HEIGHT, backgroundColor: 'transparent' }}>
            {/* Đảm bảo colSpan = số lượng cột */}
            <td colSpan="4" className="bg-white"></td> 
        </tr>
    );


    // Logic hiển thị trạng thái (Loading/Error/No Data) - (Giữ nguyên)
    const renderStatusBody = () => {
        const colSpan = 4; 
        const rowHeightStyle = { height: H_TABLE, display: 'block' }; 

        if (isLoading) {
            return (
                <tr>
                    <td colSpan={colSpan} className="px-4 py-24 text-center" style={rowHeightStyle}>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 size={40} className="animate-spin text-teal-500" />
                            <p className="text-xl text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    </td>
                </tr>
            );
        }

        if (error || !scheduleDaily || scheduleDaily.length === 0) {
             const message = error 
                ? `Không thể tải dữ liệu: ${error}`
                : "Không tìm thấy dữ liệu";
            
            return (
                <tr>
                    <td colSpan={colSpan} className="px-4 py-24 text-center" style={rowHeightStyle}>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <AlertCircle size={40} className="text-red-500" />
                            <p className="text-xl text-gray-700 font-medium">{message}</p>
                        </div>
                    </td>
                </tr>
            );
        }
        return null;
    };


    // Hàm render nội dung cuộn (ĐÃ CHỈNH SỬA)
    const renderScrollingBody = () => {
        if (!scheduleDaily || scheduleDaily.length === 0) return null;
        
        // 1. Dữ liệu gốc với key duy nhất
        const originalContent = scheduleDaily.map((row, index) => renderRow(row, index));
        
        // 2. Nội dung lặp lại = Dữ liệu gốc + Khoảng trắng
        const repeatedContent = [...originalContent, renderBlankRow()];
        
        // 3. Nhân đôi nội dung lặp lại để cuộn liền mạch qua khoảng trắng
        const fullContent = [...repeatedContent, ...repeatedContent]; 
        
        // Ghi đè key của các hàng đã nhân đôi để đảm bảo duy nhất
        // (Đây là bước tối ưu React, sử dụng index map là tạm thời)
        const finalContent = fullContent.map((element, idx) => {
            return React.cloneElement(element, { key: `item-${idx}` });
        });
        
        return (
            <div
                className="w-full"
                style={{
                    animation: `scroll-up ${SCROLL_DURATION} linear infinite`,
                    paddingTop: H_TABLE 
                }}
            >
                {finalContent}
            </div>
        );
    };

    const showStatus = isLoading || error || !scheduleDaily || scheduleDaily.length === 0;

    return (
        <div className="fixed inset-0 bg-white p-4 overflow-hidden z-[9999]"> 
            <div className="w-full h-full flex flex-col items-center"> 
                
                {/* Header Section */}
                <div className="flex items-center mb-4 w-full justify-center flex-shrink-0">
                    <img src="/logo.png" alt="Logo" className="h-24 mr-4" /> 
                    <div className="flex flex-col items-center">
                        <p className="text-3xl font-bold text-red-600 mb-0 leading-tight"> 
                            HỌC VIỆN CÁN BỘ THÀNH PHỐ HỒ CHÍ MINH
                        </p>
                        <p className="text-2xl font-bold text-red-600 leading-tight"> 
                            HO CHI MINH CITY CADRE ACADEMY
                        </p>
                    </div>
                </div>
                <hr className="w-10/12 border-t-2 border-red-600 mb-6 flex-shrink-0" />

                {/* Tiêu đề lớn cho lịch học */}
                <h1 className="text-3xl font-bold mb-6 text-red-600 flex-shrink-0"> 
                    LỊCH HỌC TẬP CÁC LỚP TRUNG CẤP LÝ LUẬN CHÍNH TRỊ TẠI CƠ SỞ 1 - 28/11/2025
                </h1>

                {/* Khung Bảng chứa (Căn giữa) */}
                <div className="w-10/12 mx-auto flex-grow relative overflow-hidden flex flex-col"> 
                    <table className="w-full table-fixed flex-shrink-0"> 
                        {/* Header Bảng */}
                        <thead className="bg-[#a8e67a] text-black"> 
                            <tr className="text-3xl font-bold"> 
                                <th className="px-4 py-3 text-center whitespace-nowrap w-1/6">Lớp</th> 
                                <th className="px-4 py-3 text-center whitespace-nowrap w-1/6">Hội trường</th>
                                <th className="px-4 py-3 text-center whitespace-nowrap w-1/6">Buổi học</th>
                                <th className="px-4 py-3 text-left whitespace-nowrap w-3/6">Nội dung</th>
                            </tr>
                        </thead>
                    </table>

                    {/* VÙNG CUỘN */}
                    <div className={`overflow-hidden w-full ${H_TABLE} relative`}>
                        <table className="w-full table-fixed absolute top-0 left-0">
                            <tbody className="w-full">
                                {showStatus ? (
                                    renderStatusBody()
                                ) : (
                                    renderScrollingBody()
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}