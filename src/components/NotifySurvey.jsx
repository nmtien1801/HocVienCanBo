import React, { useState } from 'react';
import { X, ClipboardList, AlertCircle, ChevronRight } from 'lucide-react';

const SurveyNotification = ({ surveys = [], onClose, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(true);

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

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleSurveyClick = (surveyId) => {
    if (onNavigate) {
      onNavigate(surveyId);
    }
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysRemaining) => {
    if (daysRemaining <= 2) return 'text-red-600 bg-red-50';
    if (daysRemaining <= 5) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  if (!isVisible || displaySurveys.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideDown">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <ClipboardList className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">
                Khảo sát chưa hoàn thành
              </h2>
              <p className="text-blue-100 text-sm">
                Bạn có {displaySurveys.length} khảo sát cần điền
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Alert Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-400 px-6 py-3 flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Vui lòng hoàn thành khảo sát</p>
            <p className="text-amber-700">
              Ý kiến của bạn rất quan trọng để chúng tôi cải thiện chất lượng giảng dạy
            </p>
          </div>
        </div>

        {/* Survey List */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {displaySurveys.map((survey, index) => {
              const daysRemaining = getDaysRemaining(survey.deadline);
              const urgencyColor = getUrgencyColor(daysRemaining);

              return (
                <div
                  key={survey.id || index}
                  onClick={() => handleSurveyClick(survey.id)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {survey.title}
                      </h3>
                      
                      <div className="space-y-1.5 text-sm">
                        {survey.subject && (
                          <p className="text-gray-600">
                            <span className="font-medium">Môn học:</span> {survey.subject}
                          </p>
                        )}
                        {survey.teacher && (
                          <p className="text-gray-600">
                            <span className="font-medium">Giảng viên:</span> {survey.teacher}
                          </p>
                        )}
                        <p className="text-gray-600">
                          <span className="font-medium">Hạn chót:</span>{' '}
                          {new Date(survey.deadline).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      {/* Urgency Badge */}
                      <div className="mt-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${urgencyColor}`}>
                          {daysRemaining <= 0 ? (
                            <>Đã quá hạn</>
                          ) : daysRemaining === 1 ? (
                            <>Còn {daysRemaining} ngày</>
                          ) : (
                            <>Còn {daysRemaining} ngày</>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0 self-center">
                      <ChevronRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hãy hoàn thành khảo sát để giúp chúng tôi cải thiện
          </p>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Để sau
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SurveyNotification;