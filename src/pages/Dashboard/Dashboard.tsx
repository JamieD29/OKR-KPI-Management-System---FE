import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import "./css/Dashboard.css";

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface OKRData {
  id: string;
  title: string;
  progress: number;
  status: "on-track" | "at-risk" | "behind";
  dueDate: string;
}

interface KPIData {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [okrs, setOkrs] = useState<OKRData[]>([]);
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check authentication
    const authToken = sessionStorage.getItem("authToken");
    const userInfo = sessionStorage.getItem("user");

    if (!authToken || !userInfo) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(JSON.parse(userInfo));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      
      // Fetch OKRs
      const okrResponse = await fetch("http://localhost:3001/api/okrs", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Fetch KPIs
      const kpiResponse = await fetch("http://localhost:3001/api/kpis", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (okrResponse.ok && kpiResponse.ok) {
        const okrData = await okrResponse.json();
        const kpiData = await kpiResponse.json();
        setOkrs(okrData);
        setKpis(kpiData);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleProfileSettings = () => {
    navigate("/profile");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "#22c55e";
      case "at-risk":
        return "#f59e0b";
      case "behind":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <div className="dashboard-logo-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="dashboard-logo-text">OKR & KPI Management</span>
          </div>

          <div className="dashboard-user-menu">
            <button
              className="dashboard-user-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="dashboard-user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="dashboard-user-info">
                <span className="dashboard-user-name">{user?.name}</span>
                <span className="dashboard-user-email">{user?.email}</span>
              </div>
              <ChevronDown size={16} />
            </button>

            {showProfileMenu && (
              <div className="dashboard-dropdown-menu">
                <button
                  className="dashboard-dropdown-item"
                  onClick={handleProfileSettings}
                >
                  <Settings size={16} />
                  <span>Profile Settings</span>
                </button>
                <div className="dashboard-dropdown-divider"></div>
                <button
                  className="dashboard-dropdown-item"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <h1 className="dashboard-title">Welcome back, {user?.name?.split(" ")[0]}!</h1>
            <p className="dashboard-subtitle">
              Here's an overview of your OKRs and KPIs performance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ backgroundColor: "#eff6ff" }}>
                <Target size={24} color="#3b82f6" />
              </div>
              <div className="dashboard-stat-content">
                <div className="dashboard-stat-label">Active OKRs</div>
                <div className="dashboard-stat-value">{okrs.length}</div>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ backgroundColor: "#f0fdf4" }}>
                <TrendingUp size={24} color="#22c55e" />
              </div>
              <div className="dashboard-stat-content">
                <div className="dashboard-stat-label">On Track</div>
                <div className="dashboard-stat-value">
                  {okrs.filter((o) => o.status === "on-track").length}
                </div>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ backgroundColor: "#fef3c7" }}>
                <Calendar size={24} color="#f59e0b" />
              </div>
              <div className="dashboard-stat-content">
                <div className="dashboard-stat-label">At Risk</div>
                <div className="dashboard-stat-value">
                  {okrs.filter((o) => o.status === "at-risk").length}
                </div>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ backgroundColor: "#f0f9ff" }}>
                <Users size={24} color="#0ea5e9" />
              </div>
              <div className="dashboard-stat-content">
                <div className="dashboard-stat-label">Active KPIs</div>
                <div className="dashboard-stat-value">{kpis.length}</div>
              </div>
            </div>
          </div>

          {/* OKRs Section */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Your OKRs</h2>
              <button className="dashboard-button-primary">+ New OKR</button>
            </div>

            <div className="dashboard-card-list">
              {okrs.length > 0 ? (
                okrs.map((okr) => (
                  <div key={okr.id} className="dashboard-okr-card">
                    <div className="dashboard-okr-header">
                      <h3 className="dashboard-okr-title">{okr.title}</h3>
                      <span
                        className="dashboard-status-badge"
                        style={{ backgroundColor: getStatusColor(okr.status) }}
                      >
                        {okr.status.replace("-", " ")}
                      </span>
                    </div>
                    <div className="dashboard-progress-bar">
                      <div
                        className="dashboard-progress-fill"
                        style={{
                          width: `${okr.progress}%`,
                          backgroundColor: getStatusColor(okr.status),
                        }}
                      ></div>
                    </div>
                    <div className="dashboard-okr-footer">
                      <span className="dashboard-okr-progress">{okr.progress}% Complete</span>
                      <span className="dashboard-okr-date">Due: {okr.dueDate}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty-state">
                  <Target size={48} color="#d1d5db" />
                  <p>No OKRs yet. Create your first OKR to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* KPIs Section */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Key Performance Indicators</h2>
              <button className="dashboard-button-primary">+ New KPI</button>
            </div>

            <div className="dashboard-kpi-grid">
              {kpis.length > 0 ? (
                kpis.map((kpi) => (
                  <div key={kpi.id} className="dashboard-kpi-card">
                    <h4 className="dashboard-kpi-name">{kpi.name}</h4>
                    <div className="dashboard-kpi-values">
                      <div className="dashboard-kpi-current">
                        {kpi.current}
                        <span className="dashboard-kpi-unit">{kpi.unit}</span>
                      </div>
                      <div className="dashboard-kpi-target">
                        / {kpi.target} {kpi.unit}
                      </div>
                    </div>
                    <div className="dashboard-progress-bar dashboard-progress-bar-small">
                      <div
                        className="dashboard-progress-fill"
                        style={{
                          width: `${(kpi.current / kpi.target) * 100}%`,
                          backgroundColor: "#3b82f6",
                        }}
                      ></div>
                    </div>
                    <div className="dashboard-kpi-percentage">
                      {Math.round((kpi.current / kpi.target) * 100)}% of target
                    </div>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty-state">
                  <TrendingUp size={48} color="#d1d5db" />
                  <p>No KPIs yet. Add your first KPI to track performance!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}