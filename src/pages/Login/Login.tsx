import React, { useState, useEffect } from "react";
import { AlertCircle, Award, Mail } from "lucide-react";
import "./css/Login.css";
import { useNavigate } from "react-router-dom";

export default function HCMUSLogin() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleSignIn = () => {
    setError("");
    setIsLoading(true);

    if (window.google) {
      // Use OAuth2 popup flow with account selection
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id:
          "454552409584-9tiufajnvspp5fh3orh58nvou320gs6b.apps.googleusercontent.com",
        scope: "openid email profile",
        prompt: "select_account", // Force account selection dialog
        hosted_domain: "itec.hcmus.edu.vn",
        callback: async (response) => {
          if (response.access_token) {
            try {
              // Fetch user info using access token
              const userInfoResponse = await fetch(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                  headers: {
                    Authorization: `Bearer ${response.access_token}`,
                  },
                }
              );

              const userInfo = await userInfoResponse.json();

              // Verify domain
              if (!userInfo.email.endsWith("@itec.hcmus.edu.vn")) {
                setError("Only @itec.hcmus.edu.vn email addresses are allowed");
                setIsLoading(false);
                return;
              }

              // Get ID token for backend verification
              await authenticateWithBackend(response.access_token, userInfo);
            } catch (err) {
              setError("Failed to get user info");
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        },
      });

      // Request access token - this will open the account picker
      client.requestAccessToken();
    } else {
      setIsLoading(false);
      setError("Google Sign-In is not loaded. Please refresh the page.");
    }
  };

  const handleCredentialResponse = (response) => {
    setIsLoading(true);

    const credential = response.credential;
    const payload = JSON.parse(atob(credential.split(".")[1]));

    if (!payload.email.endsWith("@itec.hcmus.edu.vn")) {
      setError("Only @itec.hcmus.edu.vn email addresses are allowed");
      setIsLoading(false);
      return;
    }

    authenticateWithBackend(credential, payload);
  };

  const authenticateWithBackend = async (credential, userInfo) => {
    try {
      setIsLoading(true);

      // Replace with your actual backend endpoint
      const response = await fetch("http://localhost:3001/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credential,
          email: userInfo.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the session token
        sessionStorage.setItem("authToken", data.access_token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        alert(
          `Login successful!\n\nName: ${userInfo.name}\nEmail: ${userInfo.email}\n\nIn production, you would be redirected to the dashboard.`
        );

        // Redirect to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
    //   <div className="w-full max-w-md">
    //     {/* Logo and Header */}
    //     <div className="text-center mb-8">
    //       <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
    //         <Award className="w-8 h-8 text-white" />
    //       </div>
    //       <h1 className="text-3xl font-bold text-gray-900 mb-2">
    //         OKR & KPI Management
    //       </h1>
    //       <p className="text-gray-600">University of Science - VNUHCM</p>
    //     </div>

    //     {/* Login Card */}
    //     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
    //       <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h2>
    //       <p className="text-gray-600 text-sm mb-6">
    //         Use your ITEC HCMUS Google Workspace account
    //       </p>

    //       {/* Error Message */}
    //       {error && (
    //         <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
    //           <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
    //           <p className="text-sm text-red-700">{error}</p>
    //         </div>
    //       )}

    //       {/* Google Sign-In Button */}
    //       <button
    //         onClick={handleGoogleSignIn}
    //         disabled={isLoading}
    //         className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border-2 border-gray-300 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
    //       >
    //         {isLoading ? (
    //           <>
    //             <svg
    //               className="animate-spin h-5 w-5 text-gray-700"
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //             >
    //               <circle
    //                 className="opacity-25"
    //                 cx="12"
    //                 cy="12"
    //                 r="10"
    //                 stroke="currentColor"
    //                 strokeWidth="4"
    //               ></circle>
    //               <path
    //                 className="opacity-75"
    //                 fill="currentColor"
    //                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    //               ></path>
    //             </svg>
    //             <span>Signing in...</span>
    //           </>
    //         ) : (
    //           <>
    //             <svg className="w-5 h-5" viewBox="0 0 24 24">
    //               <path
    //                 fill="#4285F4"
    //                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    //               />
    //               <path
    //                 fill="#34A853"
    //                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    //               />
    //               <path
    //                 fill="#FBBC05"
    //                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    //               />
    //               <path
    //                 fill="#EA4335"
    //                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    //               />
    //             </svg>
    //             <span>Sign in with Google</span>
    //           </>
    //         )}
    //       </button>

    //       <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    //         <div className="flex items-start space-x-2">
    //           <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
    //           <div className="text-sm text-blue-800">
    //             <p className="font-semibold mb-1">ITEC HCMUS Email Required</p>
    //             <p>
    //               Only accounts with @itec.hcmus.edu.vn domain can access this
    //               system.
    //             </p>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Footer Links */}
    //       <div className="mt-6 text-center">
    //         <p className="text-xs text-gray-500">
    //           Need help? Contact IT Support at support@hcmus.edu.vn
    //         </p>
    //       </div>
    //     </div>

    //     {/* Additional Info */}
    //     <div className="mt-6 text-center text-xs text-gray-500">
    //       <p>© 2024 University of Science - VNUHCM</p>
    //       <p className="mt-1">For authorized personnel only</p>
    //     </div>
    //   </div>
    // </div>

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
            Use your ITEC HCMUS Google Workspace account
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
                  ITEC HCMUS Email Required
                </div>
                <div className="login-info-text">
                  Only accounts with @itec.hcmus.edu.vn domain can access this
                  system.
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
