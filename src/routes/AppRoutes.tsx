import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AdminSettings from '../pages/AdminSetting';
import ProfileSettings from '../pages/ProfileSetting';
import Department from '../Department/Department';
import AuthCallback from '../pages/AuthCallback'; // Import thêm
import AcceptInvitation from '../components/AcceptInvitation'; // Import thêm

// Import Layouts
import MainLayout from '../layouts/MainLayout';

// 1. Hook check đăng nhập
function useAuth() {
  const authToken = sessionStorage.getItem('authToken');
  return !!authToken;
}

// 2. Component bảo vệ Admin (CÓ LOG DEBUG)
function AdminRoute({ children }: { children: React.ReactNode }) {
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const roles = user.roles || []; // Mảng roles từ backend

  // --- DEBUG LOG (Mở F12 xem cái này in ra gì) ---
  console.log('👮 AdminRoute Check:', { roles });

  // Check quyền (SYSTEM_ADMIN từ backend, hoặc admin thường)
  const isAdmin = roles.includes('SYSTEM_ADMIN') || roles.includes('admin');

  if (!isAdmin) {
    console.warn('⛔ Access Denied: Not an Admin -> Redirecting to Dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// 3. Component bảo vệ Route thường
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth();
  const location = useLocation();
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

// 4. Component Route công khai
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- CÁC ROUTE PHỤ (Auth, Invite) --- */}
      <Route path="/auth/microsoft/callback" element={<AuthCallback />} />
      <Route path="/invite/accept/:token" element={<AcceptInvitation />} />

      {/* --- ROOT REDIRECT --- */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* --- LOGIN --- */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* --- MAIN LAYOUT GROUP --- */}
      <Route
        element={
          // <ProtectedRoute>
          //   <MainLayout />
          // </ProtectedRoute>
          <MainLayout />
        }
      >
        {/* Các trang User thường */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/admin/department" element={<Department />} />

        {/* Trang Admin (Được bảo vệ 2 lớp) */}
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
      </Route>

      {/* --- CATCH ALL --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
