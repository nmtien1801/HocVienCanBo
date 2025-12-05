import React, { useEffect, useRef, useState } from "react";
import RouterRoot from "./routes/RouterRoot.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useIdleTimeout } from './utils/useIdleTimeout.js';

function App() {
  useIdleTimeout();

  return (
    <>
      <RouterRoot />
      <ToastContainer
        position="top-right"
        autoClose={2000} // tự đóng sau 2 giây
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
