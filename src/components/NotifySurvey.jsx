import React, { useState, useEffect } from 'react';
import { X, ClipboardList, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import ApiSurvey from '../apis/ApiSurvey';
import { toast } from 'react-toastify';
import { PermissionSurvey } from '../utils/constants';

const SurveyNotification = ({ surveys = [], onClose, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const allKeys = Object.keys(PermissionSurvey);

  // Thêm state để lưu thông tin Client
  const [clientInfo, setClientInfo] = useState({
    FullName: '',
    Email: '',
    Phone: '',
    Office: ''
  });

  // Hàm xử lý thay đổi input
  const handleClientInfoChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
  };

  // check quyền
  const displaySurveys = surveys;
  const currentSurvey = displaySurveys.length > 0 ? displaySurveys[currentIndex] : null;
  const clientPermissionKey = +allKeys[2]
  const isClientSurvey = currentSurvey && currentSurvey.Permission === clientPermissionKey;

  // Hiển thị Modal sau khi mount để kích hoạt Transition
  useEffect(() => {
    if (displaySurveys.length > 0) {
      setIsVisible(true);
      if (currentIndex >= displaySurveys.length) {
        setCurrentIndex(0);
      }
    } else {
      // Nếu không có khảo sát, đóng popup
      handleClose(false);
    }
  }, [displaySurveys]);

  // ------------------------------------------------ CRUD
  const handleClose = (shouldCallOnClose = true) => {
    setIsVisible(false);

    setTimeout(() => {
      if (shouldCallOnClose && onClose) onClose();
    }, 300);
  };

  const handleSurveyClick = async (survey) => {
    if (survey.Permission === +clientPermissionKey) {
      // client submit      
      if (!clientInfo.FullName || !clientInfo.Email || !clientInfo.Phone || !clientInfo.Office) {
        toast.error("Vui lòng nhập đầy đủ Tên, Email, và Số điện thoại.");
        return;
      }

      if (!validateEmail(clientInfo.Email.trim())) {
        toast.error("Vui lòng nhập đúng định dạng Email.");
        return;
      }

      let res = await ApiSurvey.CreateSurveyClientApi({
        ...survey,
        Email: clientInfo.Email,
        FullName: clientInfo.FullName,
        Phone: clientInfo.Phone,
        Office: clientInfo.Office
      });

      if (res.message) {
        toast.error(res.message);
      } else {
        handleClose();
        onNavigate(res);
      }
    } else {
      // teacher or student submit
      let res = await ApiSurvey.CreateSurveyLocalApi(survey)
      if (res.message) {
        toast.error(res.message);
      } else {
        handleClose();
        onNavigate(res);
      }
    }
  };

  // Hàm điều hướng Carousel
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displaySurveys.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displaySurveys.length) % displaySurveys.length);
  };

  // --------------------------------------------------- Hàm tính toán 
  // check email
  const validateEmail = (email) => {
    // Regex cơ bản: kiểm tra chuỗi có chứa @ và ít nhất một dấu . sau @
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ngày còn lại 
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Hàm xác định màu khẩn cấp
  const getUrgencyColor = (daysRemaining) => {
    if (daysRemaining <= 0) return 'text-red-600 bg-red-100';
    if (daysRemaining <= 2) return 'text-red-600 bg-red-50';
    if (daysRemaining <= 5) return 'text-orange-600 bg-orange-50';
    return 'text-[#0081cd] bg-[#e0f7ff]';
  };


  // KHÔNG HIỂN THỊ NẾU KHÔNG CÓ DỮ LIỆU HOẶC CHƯA MOUNT
  if (displaySurveys.length === 0 || !currentSurvey) return null;
  const daysRemaining = getDaysRemaining(currentSurvey.ToDate);
  const urgencyColor = getUrgencyColor(daysRemaining);


  return (
    <div
      id="survey-popup-container"
      className="fixed bottom-4 right-4 z-[9999] p-4 pointer-events-none"
    >
      <div
        id="survey-popup"
        className={`
                    bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden 
                    pointer-events-auto transform transition-all duration-300 ease-out
                    ${isVisible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-full'} 
                `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0081cd] to-[#026aa8] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-white flex-shrink-0" size={20} />
            <div>
              <h2 className="text-white font-semibold text-base leading-tight">
                Khảo sát chưa hoàn thành
              </h2>
              <p className="text-[#c2e2ff] text-xs">
                Bạn có {displaySurveys.length} khảo sát cần điền
              </p>
            </div>
          </div>
          {/* Nút đóng X vẫn giữ để đóng toàn bộ popup */}
          <button
            onClick={() => handleClose()}
            className="text-white p-1 rounded-full hover:bg-[#026aa8]/50 transition-colors flex-shrink-0 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 px-4 py-2 flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-xs text-amber-800">
            <p className="font-medium">Vui lòng hoàn thành khảo sát</p>
          </div>
        </div>

        {/* KHU VỰC CAROUSEL */}
        <div className="p-4 relative">
          {/* Nút điều hướng trái */}
          {displaySurveys.length > 1 && (
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-1 bg-white/70 rounded-full shadow-md z-10 text-gray-700 hover:bg-white transition-colors ml-2"
              aria-label="Khảo sát trước"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Nội dung Khảo sát hiện tại */}
          <div className="min-h-[100px] transition-opacity duration-300">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 text-sm mb-1">
                {currentSurvey.Title}
              </h3>
              <p className="text-xs text-gray-600 mb-2 my-3">
                {currentSurvey.PermissionName}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {currentIndex + 1} / {displaySurveys.length}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${urgencyColor}`}>
                  {daysRemaining <= 0 ? <>Quá hạn</> : `Còn ${daysRemaining} ngày`}
                </span>
              </div>
            </div>
          </div>

          {isClientSurvey && (
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
              <p className="font-semibold text-gray-700 text-sm">
                Vui lòng nhập thông tin liên hệ:
              </p>
              <input
                type="text"
                name="FullName"
                placeholder="Họ và Tên"
                value={clientInfo.FullName}
                onChange={handleClientInfoChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#0081cd] focus:border-[#0081cd]"
              />
              <input
                type="email"
                name="Email"
                placeholder="Email"
                value={clientInfo.Email}
                onChange={handleClientInfoChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#0081cd] focus:border-[#0081cd]"
              />
              <input
                type="tel"
                name="Phone"
                placeholder="Số điện thoại"
                value={clientInfo.Phone}
                onChange={handleClientInfoChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#0081cd] focus:border-[#0081cd]"
              />
               <input
                type="text"
                name="Office"
                placeholder="Đơn vị công tác"
                value={clientInfo.Office}
                onChange={handleClientInfoChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#0081cd] focus:border-[#0081cd]"
              />
            </div>
          )}

          {/* Nút điều hướng phải */}
          {displaySurveys.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 bg-white/70 rounded-full shadow-md z-10 text-gray-700 hover:bg-white transition-colors mr-2"
              aria-label="Khảo sát tiếp theo"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
          <button
            onClick={() => handleSurveyClick(currentSurvey)}
            className="flex items-center gap-1 px-4 py-1.5 text-sm font-semibold text-white bg-[#0081cd] rounded-lg hover:bg-[#026aa8] transition-colors shadow-md cursor-pointer"
          >
            Khảo sát ngay
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyNotification;