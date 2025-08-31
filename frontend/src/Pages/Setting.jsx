import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Settings as Gear,
  Bell,
  ShieldCheck,
  KeyRound,
  LogOut,
} from "lucide-react";

const Setting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [secretCode, setSecretCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [preferences, setPreferences] = useState({
    language: "English",
    timezone: "UTC+00:00 (GMT)",
    theme: "Light",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch {
        toast.error("⚠️ Failed to load user details");
      }
    };
    fetchUser();
  }, []);

  // Save profile
  const handleSaveProfile = async () => {
    if (!user?.fullname || !user?.email) {
      return toast.error("⚠️ Full Name and Email are required");
    }
    setLoading(true);
    try {
      await api.put("/users/me", user);
      toast.success("✅ Profile updated successfully");
    } catch {
      toast.error("⚠️ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!user?.password) return toast.error("⚠️ Enter a new password first");
    setLoading(true);
    try {
      await api.put("/users/update-password", { password: user.password });
      toast.success("🔑 Password updated");
      setUser({ ...user, password: "" });
    } catch {
      toast.error("⚠️ Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Preferences
  const handlePreferenceChange = (key, value) =>
    setPreferences((prev) => ({ ...prev, [key]: value }));

  // Notifications
  const handleNotificationChange = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  // Admin login using navigate
  const handleAdminLogin = async () => {
    if (!secretCode.trim()) return toast.error("⚠️ Secret code is required");
    setLoading(true);
    try {
      const res = await api.post("/admins/verify", { secretCode });
      if (res.data?.success) {
        setIsAdmin(true);
        toast.success("✅ Admin access granted!");
        navigate("/admin", { replace: true });
      } else {
        toast.error(res.data?.message || "❌ Invalid secret code");
      }
    } catch {
      toast.error("⚠️ Server error while verifying admin");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.get("/users/logout");
      setIsAdmin(false);
      setUser(null);
      toast.success("👋 Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("⚠️ Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
    { id: "preferences", label: "Preferences", icon: <Gear className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "admin", label: "Admin Access", icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md rounded-r-2xl p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">⚙️ Settings</h2>
          <nav className="flex flex-col gap-2">
            {tabs.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                }}
                className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === item.id
                    ? "bg-amber-100 text-amber-800 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-amber-50"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
                {item.id === "admin" && isAdmin && (
                  <span className="ml-auto bg-amber-700 text-white text-xs px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center px-4 py-3 mt-6 rounded-xl text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="bg-white rounded-2xl shadow p-8">
          {/* Profile */}
          {activeTab === "profile" && (
            <div id="profile">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-amber-700" /> Profile Settings
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={user?.fullname || ""}
                  onChange={(e) => setUser({ ...user, fullname: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={user?.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-3 bg-amber-600 text-white rounded-xl shadow hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div id="security">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-amber-700" /> Security
              </h2>
              <input
                type="password"
                placeholder="New Password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full p-3 border rounded-lg mb-4"
              />
              <button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Password
              </button>
            </div>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <div id="preferences">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Gear className="w-6 h-6 mr-2 text-amber-700" /> Preferences
              </h2>
              <div className="space-y-4">
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange("language", e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>Hindi</option>
                </select>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceChange("timezone", e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option>UTC+00:00 (GMT)</option>
                  <option>UTC+05:30 (IST)</option>
                  <option>UTC-08:00 (PST)</option>
                </select>
                <select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div id="notifications">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Bell className="w-6 h-6 mr-2 text-amber-700" /> Notifications
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange("email")}
                  />
                  Email Notifications
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange("push")}
                  />
                  Push Notifications
                </label>
              </div>
            </div>
          )}

          {/* Admin */}
          {activeTab === "admin" && (
            <div id="admin">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2 text-amber-700" /> Admin Access
              </h2>
              {isAdmin ? (
                <p className="text-green-600">✅ You have admin privileges</p>
              ) : (
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Enter Secret Code"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  />
                  <button
                    onClick={handleAdminLogin}
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <KeyRound className="w-5 h-5 mr-2" /> Verify Admin
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Setting;
