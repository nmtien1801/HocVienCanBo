import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 phút
const CHECK_INTERVAL_MS = 60 * 1000; // Kiểm tra mỗi 1 phút
const LAST_ACTIVITY_KEY = "lastActivityTime";

// Hàm xử lý logout và xóa hết localStorage
const performLogout = (dispatch) => {
  localStorage.clear();
  dispatch(logout());

  // Buộc chuyển hướng người dùng
  window.location.href = "/";
};

// Hàm cập nhật mốc thời gian hoạt động
const updateLastActivity = () => {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
};

export const useIdleTimeout = () => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  // 1. Hàm kiểm tra điều kiện timeout
  const checkAndLogout = useCallback(() => {
    const lastActivityTime = localStorage.getItem(LAST_ACTIVITY_KEY);

    if (!lastActivityTime) return;

    const currentTime = Date.now();
    // Parse as base-10 number and fall back to Number() for robustness
    const lastTime =
      Number(lastActivityTime) || parseInt(lastActivityTime, 10) || 0;

    // Nếu thời gian đã trôi qua lớn hơn 10 phút
    if (currentTime - lastTime > IDLE_TIMEOUT_MS) {
      console.log(
        "[Idle Timeout] Phiên làm việc hết hạn sau 10 phút không hoạt động."
      );
      clearInterval(intervalRef.current);
      performLogout(dispatch);
    }
  }, [dispatch]);

  // 2. Hàm xử lý khi có hoạt động (cập nhật mốc thời gian)
  const handleActivity = useCallback(() => {
    updateLastActivity();
  }, []);

  // 3. Thiết lập và dọn dẹp Listener & Interval
  useEffect(() => {
    // Khi component mount: kiểm tra ngay xem phiên có hết hạn khi app đóng không.
    // Nếu đã hết hạn, checkAndLogout() sẽ thực hiện logout và redirect.
    checkAndLogout();

    // Nếu sau khi kiểm tra vẫn còn đăng nhập (thông tin `fr` tồn tại),
    // đặt mốc thời gian hiện tại để bắt đầu đếm lại.
    if (localStorage.getItem("fr")) {
      updateLastActivity();
    }

    // Thiết lập Interval để kiểm tra định kỳ mỗi 1 phút
    intervalRef.current = setInterval(checkAndLogout, CHECK_INTERVAL_MS);

    // Đăng ký listener để theo dõi hoạt động (mousemove, click,...)
    const events = ["mousemove", "mousedown", "click", "scroll", "keypress"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Khi tab được focus lại hoặc visible (mở lại sau khi ở background), kiểm tra ngay
    window.addEventListener("focus", checkAndLogout);
    const handleVisibility = () => {
      if (!document.hidden) {
        checkAndLogout();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Cleanup: Xóa Interval và Event Listener khi component unmount
    return () => {
      clearInterval(intervalRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      window.removeEventListener("focus", checkAndLogout);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [checkAndLogout, handleActivity]);
};
