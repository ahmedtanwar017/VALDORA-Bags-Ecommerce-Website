// src/pages/Setting.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { FiUser, FiLock, FiShield, FiLogOut, FiEdit, FiKey, FiAward } from "react-icons/fi";

const Setting = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [userData, setUserData] = useState({ fullname: "", email: "" });
  const [formData, setFormData] = useState({ fullname: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", new: "" });

  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const { data } = await api.get("/users/me", { withCredentials: true });
      setUserData({ 
        fullname: data.fullname || "", 
        email: data.email || "" 
      });
      setFormData({ 
        fullname: data.fullname || "", 
        email: data.email || "" 
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch user data");
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put("/users/settings", formData, {
        withCredentials: true,
      });
      toast.success(data.message || "Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new) {
      return toast.error("Please fill all password fields");
    }
    try {
      setSaving(true);
      const { data } = await api.put("/users/change-password", passwords, {
        withCredentials: true,
      });
      toast.success(data.message || "Password updated");
      setPasswords({ current: "", new: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleMakeAdmin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return toast.error("Please enter an admin code");

    try {
      setLoading(true);
      const { data } = await api.put(
        "/users/settings",
        { code },
        { withCredentials: true }
      );
      toast.success(data.message || "Updated successfully");
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
      if (err.response?.status === 403) setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const SidebarButton = ({ tab, icon: Icon, label }) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all duration-300 transform
        ${
          activeTab === tab
            ? "bg-gradient-to-r from-[#5C4033] to-[#8B5A2B] text-white font-semibold shadow-lg scale-[1.02]"
            : "text-[#5C4033] hover:bg-[#F9F3EB] hover:text-[#5C4033] hover:translate-x-1"
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  const InputField = useCallback(({ label, value, onChange, type = "text", placeholder }) => (
    <div className="relative">
      <label className="block text-sm mb-2 font-medium text-[#8B5A2B]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-[#D6BCA8] bg-white focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
      />
    </div>
  ), []);

  const SubmitButton = useCallback(({ children, loading: isLoading }) => (
    <button
      type="submit"
      disabled={isLoading}
      className="px-8 py-3 bg-gradient-to-r from-[#5C4033] to-[#8B5A2B] text-white font-semibold rounded-xl hover:from-[#8B5A2B] hover:to-[#5C4033] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
    >
      {isLoading ? <Spinner size={20} /> : children}
    </button>
  ), []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FDF8F4] to-[#F9F3EB] text-[#5C4033]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5C4033] to-[#8B5A2B] bg-clip-text text-transparent">
          Account Settings
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#5C4033] font-semibold rounded-xl border border-[#D6BCA8] hover:bg-[#5C4033] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </header>

      {/* Main */}
      <div className="flex flex-1 p-6">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#D6BCA8] shadow-lg mr-6 h-fit">
          <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-[#F9F3EB] to-[#FDF8F4] rounded-xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#5C4033] to-[#8B5A2B] flex items-center justify-center text-white font-bold text-xl shadow-md">
              {userData.fullname?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="font-semibold text-[#5C4033]">{userData.fullname}</h2>
              <p className="text-sm text-[#8B5A2B]">{userData.email}</p>
            </div>
          </div>
          <nav className="space-y-3">
            <SidebarButton tab="profile" icon={FiUser} label="Profile" />
            <SidebarButton tab="security" icon={FiLock} label="Security" />
            <SidebarButton tab="admin" icon={FiShield} label="Admin Access" />
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#D6BCA8] shadow-lg">
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-[#F9F3EB] to-[#FDF8F4] rounded-xl">
                  <FiEdit className="w-6 h-6 text-[#8B5A2B]" />
                </div>
                <h2 className="text-2xl font-bold text-[#5C4033]">
                  Profile Information
                </h2>
              </div>
              <InputField
                label="Full Name"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              />
              <InputField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <SubmitButton loading={saving}>
                Save Changes
              </SubmitButton>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-[#F9F3EB] to-[#FDF8F4] rounded-xl">
                  <FiKey className="w-6 h-6 text-[#8B5A2B]" />
                </div>
                <h2 className="text-2xl font-bold text-[#5C4033]">
                  Security Settings
                </h2>
              </div>
              <InputField
                label="Current Password"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="Enter current password"
              />
              <InputField
                label="New Password"
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Enter new password"
              />
              <SubmitButton loading={saving}>
                Update Password
              </SubmitButton>
            </form>
          )}

          {activeTab === "admin" && (
            <form onSubmit={handleMakeAdmin} className="space-y-6 max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-[#F9F3EB] to-[#FDF8F4] rounded-xl">
                  <FiAward className="w-6 h-6 text-[#8B5A2B]" />
                </div>
                <h2 className="text-2xl font-bold text-[#5C4033]">
                  Admin Access
                </h2>
              </div>
              <InputField
                label="Secret Admin Code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter secret code"
              />
              <div className="bg-gradient-to-r from-[#F9F3EB] to-[#FDF8F4] p-4 rounded-xl border border-[#D6BCA8]">
                <p className="text-sm text-[#8B5A2B]">
                  Enter the special admin code to gain administrator privileges. This will give you access to additional features and controls.
                </p>
              </div>
              <SubmitButton loading={loading}>
                {loading ? "Verifying..." : "Verify Admin Access"}
              </SubmitButton>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default Setting;