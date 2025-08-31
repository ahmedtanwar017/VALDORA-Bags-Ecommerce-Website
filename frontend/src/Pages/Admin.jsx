import { useState } from "react";
import {
  User,
  Settings as Gear,
  LogOut,
  Box,
  ShoppingCart,
  CreditCard,
  Tag,
  Star,
  FileText,
  BarChart2,
  Home,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home /> },
    { id: "products", label: "Products", icon: <Box /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart /> },
    { id: "users", label: "Users", icon: <User /> },
    { id: "payments", label: "Payments", icon: <CreditCard /> },
    { id: "coupons", label: "Coupons", icon: <Tag /> },
    { id: "reviews", label: "Reviews", icon: <Star /> },
    { id: "content", label: "Content", icon: <FileText /> },
    { id: "reports", label: "Reports", icon: <BarChart2 /> },
    { id: "settings", label: "Settings", icon: <Gear /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <div>📊 Dashboard Content: stats, graphs, notifications</div>;
      case "products":
        return <div>👜 Product Management: add/edit/delete products, categories, stock</div>;
      case "orders":
        return <div>📦 Order Management: view/update orders, tracking, invoices</div>;
      case "users":
        return <div>👥 User Management: view/block users, purchase history</div>;
      case "payments":
        return <div>💳 Payment & Transactions: history, refunds, filters</div>;
      case "coupons":
        return <div>🎟️ Coupons & Offers: create/manage discounts, flash sales</div>;
      case "reviews":
        return <div>⭐ Reviews & Ratings: approve/delete, statistics</div>;
      case "content":
        return <div>📢 Content Management: banners, blogs, FAQ, policies</div>;
      case "reports":
        return <div>📈 Reports & Analytics: sales, top products, customer demographics</div>;
      case "settings":
        return <div>⚙️ Settings: store info, shipping, taxes, payment gateways</div>;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    // Add logout logic here
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 text-xl font-bold border-b">Admin Panel</div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                activeTab === tab.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 flex items-center px-3 py-2 text-red-600 rounded-md hover:bg-red-100"
        >
          <LogOut className="mr-2" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;
