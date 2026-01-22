import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminSettings from "../pages/AdminSetting/AdminSetting";
// import Department from "../pages/Department/Department";
import DepartmentManagerPage from "../pages/Department/Department";

// 1. Hook check đăng nhập
function useAuth() {
  // const authToken = sessionStorage.getItem("authToken");
  // return !!authToken;
  return true;
}

// 2. Hàm check Role lấy từ Session
function getUserRole() {
  // const userStr = sessionStorage.getItem("user");
  // if (!userStr) return null;
  // try {
  //   const user = JSON.parse(userStr);
  //   return user.role; // Trả về 'admin' hoặc 'user'
  // } catch {
  //   return null;
  // }
  return 'admin';
}

// ... (Giữ nguyên ProtectedRoute và PublicRoute như cũ) ...
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth();
  const location = useLocation();
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }
  return <>{children}</>;
}

function App() {
  const isAuthenticated = useAuth();
  const userRole = getUserRole(); // Lấy role hiện tại

  return (
    <Routes>
      {/* --- SỬA ĐOẠN NÀY: Root Redirect thông minh hơn --- */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            // Nếu là Admin thì về Admin Settings, ngược lại về Dashboard
            userRole?.toLowerCase() === "admin" ? (
              <Navigate to="/admin/settings" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* -------------------------------------------------- */}

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Route Admin */}
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/department" element={<DepartmentManagerPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;