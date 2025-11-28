import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { getScheduleDaily } from '../../redux/scheduleSlice.js';
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

// Tốc độ cuộn
const SCROLL_DURATION = "15s";
// Chiều cao cố định của vùng cuộn
const H_TABLE = "h-[480px]";
// Chiều cao mỗi hàng dữ liệu (~60px)
const ROW_HEIGHT = '60px';
// Số lượng hàng trống được chèn giữa các lần lặp
const NUM_BLANK_ROWS = 8;

// 🚨 ĐỊNH NGHĨA CHIỀU RỘNG CÁC CỘT MỚI (CHIA ĐỀU 25%)
const COLUMN_WIDTHS = {
  col1: '25%', // Lớp
  col2: '25%', // Hội trường
  col3: '25%', // Buổi học
  col4: '25%', // Nội dung
};

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
      key={`data-${index}`}
      className="text-2xl"
      style={{
        backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff',
        height: ROW_HEIGHT
      }}
    >
      <td className="px-4 py-2 text-center whitespace-nowrap" style={{ width: COLUMN_WIDTHS.col1 }}>{row.ClassName}</td>
      <td className="px-4 py-2 text-center whitespace-nowrap" style={{ width: COLUMN_WIDTHS.col2 }}>{row.RoomName}</td>
      <td className="px-4 py-2 text-center whitespace-nowrap" style={{ width: COLUMN_WIDTHS.col3 }}>{row.PeriodName}</td>
      <td className="px-4 py-2 text-left whitespace-normal" style={{ width: COLUMN_WIDTHS.col4 }}>{row.SubjectName}</td>
    </tr>
  );

  // Hàm render khoảng trắng (Dùng để tạo khe hở giữa các lần lặp)
  const renderBlankRow = (key) => (
    <tr key={key} style={{ height: ROW_HEIGHT, backgroundColor: 'transparent' }}>
      <td colSpan="4" className="bg-white"></td>
    </tr>
  );

  // Hàm tạo ra X hàng trống
  const createBlankSpace = () => {
    const blankRows = [];
    for (let i = 0; i < NUM_BLANK_ROWS; i++) {
      blankRows.push(renderBlankRow(`blank-row-${i}`));
    }
    return blankRows;
  };


  // Logic hiển thị trạng thái (Loading/Error/No Data)
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


  // Hàm render nội dung cuộn
  const renderScrollingBody = () => {
    if (!scheduleDaily || scheduleDaily.length === 0) return null;

    const originalContent = scheduleDaily.map((row, index) => renderRow(row, index));
    const largeBlankSpace = createBlankSpace();
    const repeatedContent = [...originalContent, ...largeBlankSpace];
    const fullContent = [...repeatedContent, ...repeatedContent];

    const finalContent = fullContent.map((element, idx) => {
      return React.cloneElement(element, { key: `item-${idx}` });
    });

    return (
      <div
        className="w-full text-red-600"
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
    <div className="fixed inset-0 bg-white pt-5 overflow-hidden z-[9999]">
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
                <th className="px-4 py-3 text-center whitespace-nowrap text-red-600" style={{ width: COLUMN_WIDTHS.col1 }}>Lớp</th>
                <th className="px-4 py-3 text-center whitespace-nowrap text-red-600" style={{ width: COLUMN_WIDTHS.col2 }}>Hội trường</th>
                <th className="px-4 py-3 text-center whitespace-nowrap text-red-600" style={{ width: COLUMN_WIDTHS.col3 }}>Buổi học</th>
                <th className="px-4 py-3 text-left whitespace-nowrap text-red-600" style={{ width: COLUMN_WIDTHS.col4 }}>Nội dung</th>
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