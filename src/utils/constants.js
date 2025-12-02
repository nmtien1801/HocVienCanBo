import moment from "moment";
import ApiUpload from "../apis/ApiUpload.js";

const TypeUserIDCons = {
  Student: 1,
  Teacher: 2,
  Administrator: 3,
};

const formatDate = (isoDate) => {
  if (isoDate && isoDate !== "0001-01-01T00:00:00") {
    return moment(isoDate).format("DD/MM/YYYY");
  }
  return "";
};

const formatToISODate = (displayDate) => {
  if (!displayDate) return "01/01/0001";

  const m = moment(
    displayDate,
    ["YYYY-MM-DDTHH:mm:ss.SSS", "DD/MM/YYYY"],
    true
  );

  if (!m.isValid()) return "01/01/0001";

  return m.format("DD/MM/YYYY");
};

const getGenderDisplay = (id) => {
  return id === 0 ? "Nữ" : id === 1 ? "Nam" : "";
};

// lấy ngày đầu -> cuối tháng
const getFirstDayOfMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return firstDay.toISOString().split("T")[0];
};

const getLastDayOfMonth = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toISOString().split("T")[0];
};
/////////////////////////////

const getImageLink = (path) => {
  if (!path) return "";
  return process.env.REACT_APP_API_URL + "/api/file/" + path;
};

const createImageUrl = (arrayBuffer, mimeType) => {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return URL.createObjectURL(blob);
};

const loadImage = async (url) => {
  try {
    if (!url) return null;
    
    if (url.startsWith("~/"))
      url = url.substring(2);
    else if (url.startsWith("~"))
      url = url.substring(1);
    
    const arrayBuffer = await ApiUpload.GetFileApi(url);

    if (arrayBuffer && arrayBuffer instanceof ArrayBuffer) {
      // Chuyển ArrayBuffer thành Blob URL
      const imageUrl = createImageUrl(arrayBuffer, "image/png");

      return imageUrl;
    } else {
      console.warn("Response không phải ArrayBuffer:", arrayBuffer);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi tải ảnh:", error);
    return null;
  }
};

const arrayBufferToUrl = (arrayBuffer) => {
    const blob = new Blob([arrayBuffer], { type: "image/png" }); 
    return URL.createObjectURL(blob);
};

export {
  TypeUserIDCons,
  formatDate,
  formatToISODate,
  getGenderDisplay,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getImageLink,
  loadImage,
  arrayBufferToUrl
};
