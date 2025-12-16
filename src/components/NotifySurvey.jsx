import React, { useState, useEffect } from 'react';
import { X, ClipboardList, AlertCircle, ChevronRight } from 'lucide-react';

const SurveyNotification = ({ surveys = [], onClose, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false); 
  const [isMounted, setIsMounted] = useState(true); 

  // Mock data nếu không có surveys được truyền vào
  const defaultSurveys = [
    {
      id: 1,
      title: "Khảo sát đánh giá chất lượng giảng dạy học kỳ 1",
      subject: "Lập trình Web",
      teacher: "Nguyễn Văn A",
      deadline: "2024-12-20",
      type: "teaching"
    },
    {
      id: 2,
      title: "Khảo sát cơ sở vật chất phòng học",
      subject: "Tất cả các môn",
      teacher: "",
      deadline: "2024-12-25",
      type: "facility"
    }
  ];

  const displaySurveys = surveys.length > 0 ? surveys : defaultSurveys;
  
  // Hiển thị Modal sau khi mount để kích hoạt Transition
  useEffect(() => {
    if (displaySurveys.length > 0) {
        setIsVisible(true);
    }
  }, [displaySurveys]);

  const handleClose = () => {
    setIsVisible(false); 
    
    setTimeout(() => {
      setIsMounted(false); 
      if (onClose) onClose();
    }, 300); 
  };

  const handleSurveyClick = (surveyId) => {
    handleClose(); 
    if (onNavigate) {
      onNavigate(surveyId);
    }
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysRemaining) => {
    if (daysRemaining <= 0) return 'text-red-600 bg-red-100'; 
    if (daysRemaining <= 2) return 'text-red-600 bg-red-50'; 
    if (daysRemaining <= 5) return 'text-orange-600 bg-orange-50'; 
    return 'text-[#0081cd] bg-[#e0f7ff]'; 
  };

  if (!isMounted || displaySurveys.length === 0) return null;

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
          <button
            onClick={handleClose}
            className="text-white p-1 rounded-full transition-all flex-shrink-0"
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

        <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
          {displaySurveys.slice(0, 3).map((survey, index) => {
            const daysRemaining = getDaysRemaining(survey.ToDate);
            const urgencyColor = getUrgencyColor(daysRemaining);

            return (
              <div
                key={survey.TemplateSurveyID || index}
                onClick={() => handleSurveyClick(survey.TemplateSurveyID)}
                className="border-b border-gray-100 pb-3 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 
                        className="font-medium text-gray-800 text-sm mb-1 line-clamp-1 group-hover:text-[#0081cd]">
                      {survey.Title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-1">
                        {survey.PermissionName}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${urgencyColor}`}>
                      {daysRemaining <= 0 ? <>Quá hạn</> : `Còn ${daysRemaining} ngày`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {displaySurveys.length > 3 && (
              <p className="text-center text-xs text-[#0081cd] pt-2 cursor-pointer hover:underline" onClick={handleClose}>
                  Và {displaySurveys.length - 3} khảo sát khác...
              </p>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
          <button
            onClick={handleClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyNotification;