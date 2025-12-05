import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

// const IS_RELOADING_KEY = 'isReloadingFlag';
// // Key dùng để đếm số tab đang mở
// const TAB_COUNT_KEY = import.meta.env.VITE_TAB_COUNT_KEY;
// // Key dùng để lưu thông tin đăng nhập (CẦN PHẢI GIỮ LÀ 'fr' để khớp với code Redux/ApiManager)
// const AUTH_INFO_KEY = 'fr';

// /**
//  * Tăng Bộ Đếm khi một tab mới của ứng dụng được mở.
//  * Việc này giúp chia sẻ session giữa các tab (do dùng localStorage).
//  */
// function incrementTabCounter() {
//   try {
//     let count = parseInt(localStorage.getItem(TAB_COUNT_KEY) || '0', 10);
//     count++;
//     localStorage.setItem(TAB_COUNT_KEY, count.toString());
//   } catch (error) {
//     console.error("Lỗi khi tăng bộ đếm tab:", error);
//   }
// }

// // Gọi ngay khi file này được tải (ứng dụng khởi động trong tab)
// incrementTabCounter();

// /**
//  * Giảm Bộ Đếm và Xóa Dữ Liệu đăng nhập khi tab cuối cùng đóng.
//  * Việc này mô phỏng hành vi của sessionStorage: tự động thoát khi đóng trình duyệt.
//  */
// window.addEventListener('beforeunload', () => {
//   try {
//     // Lấy số lượng tab hiện tại
//     let count = parseInt(localStorage.getItem(TAB_COUNT_KEY) || '1', 10);
//     count--;

//     if (count <= 0) {
//       // Đây là tab cuối cùng (count về 0 hoặc âm): XÓA DỮ LIỆU
//       // localStorage.removeItem(AUTH_INFO_KEY);
//       // localStorage.removeItem('type');
//       // localStorage.removeItem(TAB_COUNT_KEY);
//       localStorage.setItem(TAB_COUNT_KEY, '0');
//     } else {
//       // Còn tab khác đang mở, chỉ cập nhật lại bộ đếm
//       localStorage.setItem(TAB_COUNT_KEY, count.toString());
//     }
//   } catch (error) {
//     // Chỉ in ra lỗi, không làm ảnh hưởng đến việc đóng tab
//     console.error("Lỗi khi xử lý beforeunload:", error);
//   }
// });


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)