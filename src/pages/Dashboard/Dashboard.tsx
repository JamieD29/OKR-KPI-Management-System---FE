import React, { useState } from "react";
import {
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  Search,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [user] = useState({
    name: "Triết Đặng Minh Triết",
    email: "1959042@itec.hcmus.edu.vn",
    role: "Lecturer",
  });

  const stats = [
    {
      label: "Total OKRs",
      value: "12",
      change: "+2 this month",
      icon: Target,
      color: "#1976d2",
    },
    {
      label: "Completed KPIs",
      value: "8/15",
      change: "53% completion",
      icon: CheckCircle2,
      color: "#2e7d32",
    },
    {
      label: "Team Members",
      value: "24",
      change: "+3 this quarter",
      icon: Users,
      color: "#ed6c02",
    },
    {
      label: "At Risk",
      value: "3",
      change: "Needs attention",
      icon: AlertCircle,
      color: "#d32f2f",
    },
  ];

  const okrs = [
    {
      id: 1,
      title: "Improve Research Output",
      progress: 75,
      status: "On Track",
      dueDate: "2024-12-31",
      keyResults: [
        {
          text: "Publish 3 papers in Q-indexed journals",
          completed: 2,
          total: 3,
        },
        { text: "Secure 2 research grants", completed: 1, total: 2 },
        {
          text: "Present at 2 international conferences",
          completed: 2,
          total: 2,
        },
      ],
    },
    {
      id: 2,
      title: "Enhance Student Learning Experience",
      progress: 60,
      status: "On Track",
      dueDate: "2024-12-31",
      keyResults: [
        {
          text: "Achieve 90% student satisfaction rate",
          completed: 85,
          total: 90,
        },
        { text: "Develop 5 new course materials", completed: 3, total: 5 },
        {
          text: "Implement 2 innovative teaching methods",
          completed: 1,
          total: 2,
        },
      ],
    },
    {
      id: 3,
      title: "Expand Industry Collaboration",
      progress: 40,
      status: "At Risk",
      dueDate: "2024-12-31",
      keyResults: [
        { text: "Partner with 3 tech companies", completed: 1, total: 3 },
        { text: "Launch 2 joint projects", completed: 0, total: 2 },
        { text: "Organize 1 industry workshop", completed: 0, total: 1 },
      ],
    },
  ];

  const recentActivity = [
    {
      action: "Updated KPI",
      target: "Research Paper Submission",
      time: "2 hours ago",
    },
    {
      action: "Completed",
      target: "Student Survey Analysis",
      time: "5 hours ago",
    },
    { action: "Created OKR", target: "Q4 Teaching Goals", time: "1 day ago" },
    {
      action: "Reviewed",
      target: "Team Performance Metrics",
      time: "2 days ago",
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login", { replace: true });
;
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "260px" : "0",
          backgroundColor: "#1976d2",
          color: "white",
          transition: "width 0.3s",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Target size={32} />
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                OKR & KPI
              </h2>
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>
                Management System
              </p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "20px 0" }}>
          {[
            { icon: TrendingUp, label: "Dashboard", active: true },
            { icon: Target, label: "My OKRs", active: false },
            { icon: CheckCircle2, label: "KPIs", active: false },
            { icon: Users, label: "Team", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((item, i) => (
            <button
              key={i}
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "none",
                backgroundColor: item.active
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = item.active
                  ? "rgba(255,255,255,0.1)"
                  : "transparent")
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div
          style={{
            padding: "20px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#ff9800",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              T
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  opacity: 0.8,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid rgba(255,255,255,0.3)",
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "14px",
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: "white",
            padding: "16px 24px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: "8px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              Dashboard
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Search
                size={20}
                style={{ position: "absolute", left: "12px", color: "#666" }}
              />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  padding: "8px 12px 8px 40px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  width: "250px",
                  fontSize: "14px",
                }}
              />
            </div>
            <button
              style={{
                padding: "8px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Bell size={24} />
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#d32f2f",
                  borderRadius: "50%",
                }}
              ></span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                      {stat.label}
                    </p>
                    <h3
                      style={{
                        margin: "8px 0",
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "#1a1a1a",
                      }}
                    >
                      {stat.value}
                    </h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                      {stat.change}
                    </p>
                  </div>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: stat.color + "15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <stat.icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* OKRs Section */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
                Active OKRs
              </h2>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <Plus size={16} />
                New OKR
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              {okrs.map((okr) => (
                <div
                  key={okr.id}
                  style={{
                    marginBottom: "20px",
                    padding: "16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        {okr.title}
                      </h3>
                      <span
                        style={{
                          padding: "4px 12px",
                          backgroundColor:
                            okr.status === "At Risk" ? "#ffebee" : "#e8f5e9",
                          color:
                            okr.status === "At Risk" ? "#d32f2f" : "#2e7d32",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {okr.status}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      Due: {okr.dueDate}
                    </span>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        Progress
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>
                        {okr.progress}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${okr.progress}%`,
                          height: "100%",
                          backgroundColor:
                            okr.status === "At Risk" ? "#ff9800" : "#4caf50",
                          transition: "width 0.3s",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#666",
                      }}
                    >
                      Key Results:
                    </p>
                    {okr.keyResults.map((kr, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#f9f9f9",
                          borderRadius: "4px",
                          marginBottom: "4px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "14px", color: "#333" }}>
                          {kr.text}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color:
                              kr.completed === kr.total ? "#2e7d32" : "#666",
                          }}
                        >
                          {kr.completed}/{kr.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
                Recent Activity
              </h2>
            </div>
            <div style={{ padding: "20px" }}>
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom:
                      i < recentActivity.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "14px",
                        color: "#333",
                      }}
                    >
                      <strong>{activity.action}</strong> {activity.target}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                      {activity.time}
                    </p>
                  </div>
                  <ChevronRight size={20} style={{ color: "#999" }} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
