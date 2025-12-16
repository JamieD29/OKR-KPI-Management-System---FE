import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

// Auth check hook
function useAuth() {
  const authToken = sessionStorage.getItem("authToken");
  return !!authToken;
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Get the page they were trying to visit before login, or default to dashboard
    const from = (location.state as any)?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Root redirects to dashboard or login based on auth */}
      <Route
        path="/"
        element={
          useAuth() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public route - login page */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes - require authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
