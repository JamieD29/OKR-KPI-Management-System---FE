import React, { useState, useEffect } from "react";
// import { AlertCircle } from "lucide-react"; // Mày import nhưng chưa dùng, tao comment lại cho đỡ warning nha
import "./css/Login.css";
import { useNavigate } from "react-router-dom";

// --- FIX LỖI TYPESCRIPT ---
// Khai báo mở rộng cho interface Window để TS hiểu biến google
declare global {
  interface Window {
    google: any;
  }
}
// --------------------------

export default function HCMUSLogin() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load allowed domains from backend
    fetchAllowedDomains();

    // Load Google Sign-In
    const googleScript = document.createElement("script");
    googleScript.src = "https://accounts.google.com/gsi/client";
    googleScript.async = true;
    googleScript.defer = true;
    document.body.appendChild(googleScript);

    return () => {
      if (document.body.contains(googleScript)) {
        document.body.removeChild(googleScript);
      }
    };
  }, []);

  const fetchAllowedDomains = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/allowed-domains");
      if (response.ok) {
        const data = await response.json();
        setAllowedDomains(data.domains || ["itec.hcmus.edu.vn"]);
      } else {
        // Fallback to default domain
        setAllowedDomains(["itec.hcmus.edu.vn"]);
      }
    } catch (err) {
      console.error("Failed to fetch allowed domains:", err);
      setAllowedDomains(["itec.hcmus.edu.vn"]);
    }
  };

  const validateEmailDomain = (email: string): boolean => {
    return allowedDomains.some(domain => email.endsWith(`@${domain}`));
  };

  const handleGoogleSignIn = () => {
    setError("");
    setIsLoading(true);

    if (window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: "454552409584-9tiufajnvspp5fh3orh58nvou320gs6b.apps.googleusercontent.com",
        scope: "openid email profile",
        prompt: "select_account",
        // --- FIX LỖI TYPESCRIPT: Thêm type 'any' cho response ---
        callback: async (response: any) => {
          if (response.access_token) {
            try {
              const userInfoResponse = await fetch(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                  headers: {
                    Authorization: `Bearer ${response.access_token}`,
                  },
                }
              );

              const userInfo = await userInfoResponse.json();

              // Validate against allowed domains
              if (!validateEmailDomain(userInfo.email)) {
                setError(
                  `Only emails from the following domains are allowed: ${allowedDomains.join(", ")}`
                );
                setIsLoading(false);
                return;
              }

              await authenticateWithBackend(response.access_token, userInfo, "google");
            } catch (err) {
              setError("Failed to get user info");
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        },
      });

      client.requestAccessToken();
    } else {
      setIsLoading(false);
      setError("Google Sign-In is not loaded. Please refresh the page.");
    }
  };

  const handleMicrosoftSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Redirect to Microsoft OAuth endpoint
      const microsoftAuthUrl = `http://localhost:3001/auth/microsoft`;
      window.location.href = microsoftAuthUrl;
    } catch (err) {
      setError("Failed to initiate Microsoft sign-in");
      setIsLoading(false);
    }
  };

  const authenticateWithBackend = async (
    credential: string,
    userInfo: any,
    provider: "google" | "microsoft"
  ) => {
    try {
      setIsLoading(true);

      const response = await fetch(`http://localhost:3001/auth/${provider}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credential,
          email: userInfo.email,
          name: userInfo.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the session token
        sessionStorage.setItem("authToken", data.access_token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Authentication failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-circle">
            <svg
              width="32"
              height="32"
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
          <h1 className="login-title">OKR & KPI Management</h1>
          <p className="login-subtitle">University of Science - VNUHCM</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h2 className="login-card-title">Sign In</h2>
          <p className="login-card-subtitle">
            Use your institutional account to continue
          </p>

          {/* Error Message */}
          {error && (
            <div className="login-error-box">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="login-error-text">{error}</p>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? (
              <>
                <svg
                  className="login-spinner"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    opacity="0.25"
                  />
                  <path
                    fill="currentColor"
                    opacity="0.75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
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
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* Microsoft Sign-In Button */}
          <button
            onClick={handleMicrosoftSignIn}
            disabled={isLoading}
            className="login-button login-button-microsoft"
          >
            <svg width="20" height="20" viewBox="0 0 23 23">
              <path fill="#f35325" d="M0 0h11v11H0z" />
              <path fill="#81bc06" d="M12 0h11v11H12z" />
              <path fill="#05a6f0" d="M0 12h11v11H0z" />
              <path fill="#ffba08" d="M12 12h11v11H12z" />
            </svg>
            <span>Sign in with Microsoft</span>
          </button>

          <div className="login-info-box">
            <div className="login-info-content">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <polyline points="3,4 12,13 21,4" />
              </svg>
              <div>
                <div className="login-info-text login-info-title">
                  Authorized Email Required
                </div>
                <div className="login-info-text">
                  {allowedDomains.length > 0 ? (
                    <>Only accounts with {allowedDomains.join(", ")} domains can access this system.</>
                  ) : (
                    <>Please contact your administrator for access.</>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p className="login-footer-text">
              Need help? Contact IT Support at support@hcmus.edu.vn
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="login-bottom-footer">
          <p className="login-footer-text">
            © 2025 University of Science - VNUHCM
          </p>
          <p className="login-footer-text" style={{ marginTop: "4px" }}>
            For authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}