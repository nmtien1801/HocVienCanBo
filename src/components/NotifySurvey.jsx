import React, { useState, useEffect } from 'react';
import { X, ClipboardList, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import ApiSurvey from '../apis/ApiSurvey';
import { toast } from 'react-toastify';
import { PermissionSurvey, formatDate } from '../utils/constants';
import { useSelector, useDispatch } from "react-redux";
import DropdownSearch from '../components/FormFields/DropdownSearch.jsx';
import { getTrainingSystemAddressByUserID } from '../redux/learningClassSlice.js';

const SurveyNotification = ({ surveys = [], onClose, onNavigate, classTypeID, setClassTypeID }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const allKeys = Object.keys(PermissionSurvey);
  const { ClassSurveyList, TrainingSystemAddress } = useSelector((state) => state.learningClass);
  const [selectedClass, setSelectedClass] = useState('');

  // tên khóa bồi dưỡng
  const formattedOptions = ClassSurveyList.map(item => ({
    ...item,
    FullDisplayName: `${item.ClassName} - ${item.ClassName1} - ${item.TrainingSystemName}`
  }));

  // Thêm state để lưu thông tin Client
  const [trungCapInfo, setTrungCapInfo] = useState({
    Age: '',
    GenderID: '',
    Position: '', // chức vụ
    Office: '',  // cơ quan công tác
    Email: '',

    FullName: '',
    Phone: '',
  });

  const [boiDuongInfo, setBoiDuongInfo] = useState({
    FullName: '',
    Email: '',  // mã số cán bộ, công chức, viên chức
    TimeStart: '',
    ClassName1: '', // đơn vị tổ chức
    UnitName: '',  // địa điểm tổ chức

    Phone: '',
    Office: '',
    GenderID: '',
    Position: '',
  });

  useEffect(() => {
    if (TrainingSystemAddress && classTypeID === 2) {
      setBoiDuongInfo(prev => ({
        ...prev,
        ClassName1: TrainingSystemAddress.ClassName1 || '',
        TimeStart: formatDate(TrainingSystemAddress.TimeStart) || '',
        UnitName: TrainingSystemAddress.UnitName || ''
      }));
    }
  }, [TrainingSystemAddress, classTypeID]);

  // Hàm xử lý thay đổi input
  const handleBoiDuongChange = (e) => {
    const { name, value } = e.target;
    setBoiDuongInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleTrungCapChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Age') {
      // Cho phép xoá
      if (value === '') {
        setTrungCapInfo(prev => ({ ...prev, Age: '' }));
        return;
      }

      // Chỉ cho nhập số
      if (!/^\d+$/.test(value)) return;

      const age = Number(value);

      // Chỉ chặn khi > 100
      if (age > 100) return;
    }
    setTrungCapInfo(prev => ({ ...prev, [name]: value }));
  };

  // check quyền
  const displaySurveys = React.useMemo(() => {
    if (!classTypeID) return surveys;

    return surveys.filter(s => s.ClassTypeID === classTypeID);
  }, [surveys, classTypeID]);

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
      // Chỉ đóng hẳn popup nếu THỰC SỰ không có khảo sát nào ở cả 2 hệ
      const hasAnySurvey = surveys.length > 0;
      if (!hasAnySurvey) {
        setIsVisible(false);
      }
    }
  }, [displaySurveys, surveys]);


  useEffect(() => {
    // Fetch lớp theo hệ đào tạo
    const fetchClassByType = async () => {
      let res = await dispatch(getTrainingSystemAddressByUserID(selectedClass));
    };

    if (selectedClass) {
      fetchClassByType();
    }
  }, [selectedClass]);

  // reset carousel
  useEffect(() => {
    setCurrentIndex(0);
  }, [classTypeID]);

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
      if (!classTypeID) {
        toast.error("Vui lòng chọn hệ đào tạo");
        return;
      }

      if (classTypeID === 1) {
        const { Age, GenderID, Position, Office } = trungCapInfo;
        if (!Age || !GenderID || !Position || !Office) {
          toast.error("Vui lòng nhập đầy đủ thông tin hệ trung cấp");
          return;
        }
      }

      if (classTypeID === 2) {
        const { FullName, Email, TimeStart, ClassName1, UnitName } = boiDuongInfo;
        if (!FullName || !Email || !TimeStart || !ClassName1 || !UnitName) {
          toast.error("Vui lòng nhập đầy đủ thông tin hệ bồi dưỡng");
          return;
        }
      }

      let payload = {
        ...survey,
        ClassTypeID: classTypeID,
        TrainingSystemID: TrainingSystemAddress ? TrainingSystemAddress.TrainingSystemID : null,
        ClassID: selectedClass ? selectedClass : null,
        UnitID: TrainingSystemAddress ? TrainingSystemAddress.UnitID : null,
        AddressID: TrainingSystemAddress ? TrainingSystemAddress.AddressID : null,
        ...(classTypeID === 2 ? boiDuongInfo : trungCapInfo)
      };

      let res = await ApiSurvey.CreateSurveyClientApi(payload);

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
  if (surveys.length === 0) return null; // Không có bất kỳ khảo sát nào thì mới ẩn hoàn toàn
  if (displaySurveys.length === 0) return null; // Không có khảo sát khớp với ClassTypeID hiện tại cũng ẩn nội dung
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

        {/* CHỌN HỆ ĐÀO TẠO */}
        {isClientSurvey && <div className="p-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setClassTypeID(1)}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition
        ${classTypeID === 1
                  ? 'bg-[#0081cd] text-white border-[#0081cd]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
      `}
            >
              Hệ trung cấp
            </button>

            <button
              type="button"
              onClick={() => setClassTypeID(2)}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition
        ${classTypeID === 2
                  ? 'bg-[#0081cd] text-white border-[#0081cd]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
      `}
            >
              Hệ bồi dưỡng
            </button>
          </div>
        </div>}

        {/* KHU VỰC CAROUSEL */}
        <div className="px-4 pb-4 relative">
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

          {/* Thông tin khảo sát */}
          {isClientSurvey && classTypeID === 1 && (
            <div className="space-y-3">
              <p className="font-semibold text-gray-700 text-sm">
                Thông tin học viên (Hệ trung cấp)
              </p>

              <input
                type="email"
                name="Email"
                required
                placeholder="Email"
                className="w-full border rounded-md p-2 text-sm"
                value={trungCapInfo.Email}
                onChange={handleTrungCapChange}
              />

              <div className="flex gap-2">
                <input type="number" name="Age" placeholder="Tuổi" min={18} max={100} value={trungCapInfo.Age} onChange={handleTrungCapChange} className="w-1/2 border rounded-md p-2 text-sm" />
                <select name="GenderID" value={trungCapInfo.GenderID} onChange={handleTrungCapChange} className="w-1/2 border rounded-md p-2 text-sm">
                  <option value="">-- Giới tính --</option>
                  <option value="1">Nam</option>
                  <option value="2">Nữ</option>
                </select>
              </div>

              <input
                type="text"
                name="Position"
                placeholder="Chức vụ"
                value={trungCapInfo.Position}
                onChange={handleTrungCapChange}
                className="w-full border rounded-md p-2 text-sm"
              />

              <input
                type="text"
                name="Office"
                placeholder="Cơ quan công tác"
                value={trungCapInfo.Office}
                onChange={handleTrungCapChange}
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>
          )}

          {isClientSurvey && classTypeID === 2 && (
            <div className="space-y-3">
              <p className="font-semibold text-gray-700 text-sm">
                Thông tin khóa học (Hệ bồi dưỡng)
              </p>

              <input
                type="text"
                name="FullName"
                placeholder="Họ và tên"
                value={boiDuongInfo.FullName}
                onChange={handleBoiDuongChange}
                className="w-full border rounded-md p-2 text-sm"
              />

              <input
                type="text"
                name="Email"
                placeholder="Mã số cán bộ, công chức, viên chức"
                value={boiDuongInfo.Email}
                onChange={handleBoiDuongChange}
                className="w-full border rounded-md p-2 text-sm"
              />

              {/* DROPDOWN */}
              {ClassSurveyList.length > 0 && <div className="">
                <DropdownSearch
                  options={formattedOptions}
                  placeholder="------ Chọn khóa bồi dưỡng ------"
                  labelKey="FullDisplayName"
                  valueKey="ClassID"
                  onChange={(e) => setSelectedClass(e.ClassID)}
                />
              </div>}

              <div className="flex gap-2">
                <input
                  type="text"
                  name="TimeStart"
                  placeholder="Thời gian tổ chức"
                  value={boiDuongInfo.TimeStart}
                  onChange={handleBoiDuongChange}
                  className="w-1/2 border rounded-md p-2 text-sm"
                />
                <input
                  type="text"
                  name="UnitName"
                  placeholder="Địa điểm tổ chức"
                  value={boiDuongInfo.UnitName}
                  onChange={handleBoiDuongChange}
                  className="w-1/2 border rounded-md p-2 text-sm"
                />
              </div>

              <input
                type="text"
                name="ClassName1"
                placeholder="Đơn vị tổ chức"
                value={boiDuongInfo.ClassName1}
                onChange={handleBoiDuongChange}
                className="w-full border rounded-md p-2 text-sm"
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
    </div >
  );
};

export default SurveyNotification;