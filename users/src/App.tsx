import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UsersDashboard from "./pages/UsersDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="login" />
          <Route element={<UsersDashboard />} path="dashboard" />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
