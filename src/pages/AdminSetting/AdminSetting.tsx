import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, AlertCircle, CheckCircle, X } from "lucide-react";
import "./css/AdminSettings.css";

interface Domain {
  id: string;
  domain: string;
  addedAt: string;
}

export default function AdminSettings() {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is admin
    const authToken = sessionStorage.getItem("authToken");
    const userInfo = sessionStorage.getItem("user");

    if (!authToken || !userInfo) {
      navigate("/login", { replace: true });
      return;
    }

    const parsedUser = JSON.parse(userInfo);
    setUser(parsedUser);

    // Check if user has admin role
    if (parsedUser.role !== "admin") {
      navigate("/dashboard", { replace: true });
      return;
    }

    fetchDomains();
  }, [navigate]);

  const fetchDomains = async () => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/admin/domains", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
      } else {
        showMessage("error", "Failed to load domains");
      }
    } catch (err) {
      console.error("Failed to fetch domains:", err);
      showMessage("error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      showMessage("error", "Please enter a domain name");
      return;
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain.trim())) {
      showMessage("error", "Invalid domain format. Example: example.com");
      return;
    }

    // Check for duplicates
    if (domains.some((d) => d.domain === newDomain.trim())) {
      showMessage("error", "This domain already exists");
      return;
    }

    setIsSaving(true);
    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/admin/domains", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: newDomain.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setDomains([...domains, data.domain]);
        setNewDomain("");
        showMessage("success", "Domain added successfully");
      } else {
        const errorData = await response.json();
        showMessage("error", errorData.message || "Failed to add domain");
      }
    } catch (err) {
      showMessage("error", "Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm("Are you sure you want to remove this domain? Users with this domain will no longer be able to log in.")) {
      return;
    }

    setIsSaving(true);
    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/admin/domains/${domainId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setDomains(domains.filter((d) => d.id !== domainId));
        showMessage("success", "Domain removed successfully");
      } else {
        const errorData = await response.json();
        showMessage("error", errorData.message || "Failed to remove domain");
      }
    } catch (err) {
      showMessage("error", "Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <button className="admin-back-button" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
          <h1 className="admin-header-title">Admin Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          {/* Message Alert */}
          {message && (
            <div className={`admin-alert admin-alert-${message.type}`}>
              <div className="admin-alert-content">
                {message.type === "success" ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{message.text}</span>
              </div>
              <button
                className="admin-alert-close"
                onClick={() => setMessage(null)}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Domain Management Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Allowed Email Domains</h2>
                <p className="admin-card-subtitle">
                  Manage which email domains can access the system
                </p>
              </div>
            </div>

            {/* Add Domain Section */}
            <div className="admin-add-domain">
              <input
                type="text"
                className="admin-input"
                placeholder="example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddDomain();
                  }
                }}
                disabled={isSaving}
              />
              <button
                className="admin-button-primary"
                onClick={handleAddDomain}
                disabled={isSaving}
              >
                <Plus size={18} />
                <span>Add Domain</span>
              </button>
            </div>

            {/* Domain List */}
            <div className="admin-domain-list">
              {domains.length > 0 ? (
                domains.map((domain) => (
                  <div key={domain.id} className="admin-domain-item">
                    <div className="admin-domain-info">
                      <div className="admin-domain-name">@{domain.domain}</div>
                      <div className="admin-domain-date">
                        Added on {new Date(domain.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      className="admin-button-danger"
                      onClick={() => handleDeleteDomain(domain.id)}
                      disabled={isSaving}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <p>No domains configured. Add your first domain to get started.</p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="admin-info-box">
              <AlertCircle size={18} />
              <div>
                <div className="admin-info-title">Important Note</div>
                <div className="admin-info-text">
                  Only users with email addresses from these domains will be able to
                  log in to the system. Removing a domain will immediately prevent
                  users with that domain from accessing the system.
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings Card (Placeholder) */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Authentication Providers</h2>
                <p className="admin-card-subtitle">
                  Configure available authentication methods
                </p>
              </div>
            </div>

            <div className="admin-provider-list">
              <div className="admin-provider-item">
                <div className="admin-provider-info">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <div>
                    <div className="admin-provider-name">Google</div>
                    <div className="admin-provider-status admin-provider-status-active">
                      Active
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-provider-item">
                <div className="admin-provider-info">
                  <svg width="20" height="20" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M0 0h11v11H0z" />
                    <path fill="#81bc06" d="M12 0h11v11H12z" />
                    <path fill="#05a6f0" d="M0 12h11v11H0z" />
                    <path fill="#ffba08" d="M12 12h11v11H12z" />
                  </svg>
                  <div>
                    <div className="admin-provider-name">Microsoft</div>
                    <div className="admin-provider-status admin-provider-status-active">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}