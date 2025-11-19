import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Nhập các trang đã tạo
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Định nghĩa đường dẫn */}
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/technician" element={<TechnicianDashboard />} />
      </Routes>
    </div>
  );
}

export default App;