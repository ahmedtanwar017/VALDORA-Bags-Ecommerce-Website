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
  Edit,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../api"; // Import the API configuration

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [productTab, setProductTab] = useState("list");

  // Product form state
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: 0,
    finalPrice: 0,
    image: "",
    backgroundColor: "#FFFFFF",
    category: "",
    stock: 0,
    tags: [],
    isActive: true,
  });

  // State for update product form
  const [updateProduct, setUpdateProduct] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    discount: 0,
    finalPrice: 0,
    image: "",
    backgroundColor: "#FFFFFF",
    category: "",
    stock: 0,
    tags: [],
    isActive: true,
  });

  // Products list (empty initially)
  const [products, setProducts] = useState([]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "products", label: "Products", icon: <Box size={18} /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { id: "users", label: "Users", icon: <User size={18} /> },
    { id: "payments", label: "Payments", icon: <CreditCard size={18} /> },
    { id: "coupons", label: "Coupons", icon: <Tag size={18} /> },
    { id: "reviews", label: "Reviews", icon: <Star size={18} /> },
    { id: "content", label: "Content", icon: <FileText size={18} /> },
    { id: "reports", label: "Reports", icon: <BarChart2 size={18} /> },
    { id: "settings", label: "Settings", icon: <Gear size={18} /> },
  ];

  // --- Handlers ---

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdateProductChange = (e) => {
    setUpdateProduct({ ...updateProduct, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const price = parseFloat(product.price) || 0;
      const discount = parseFloat(product.discount) || 0;
      const finalPrice = price - (price * (discount / 100));

      const newProduct = {
        ...product,
        price,
        discount,
        finalPrice,
        stock: parseInt(product.stock || 0),
        tags: product.tags || [],
      };

      // API call to create product
      const response = await api.post("/products/create", newProduct);
      
      // If successful, update local state
      setProducts([...products, response.data]);
      toast.success("✅ Product created successfully!");
      
      // Reset form
      setProduct({
        name: "",
        description: "",
        price: "",
        discount: 0,
        finalPrice: 0,
        image: "",
        backgroundColor: "#FFFFFF",
        category: "",
        stock: 0,
        tags: [],
        isActive: true,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("❌ Failed to create product. Please try again.");
    }
  };

  const handleUpdateProductSubmit = (e) => {
    e.preventDefault();
    const updatedProducts = products.map((p) =>
      p.id === updateProduct.id
        ? { ...updateProduct, finalPrice: updateProduct.price - (updateProduct.price * (updateProduct.discount / 100)) }
        : p
    );
    setProducts(updatedProducts);
    toast.success("✅ Product updated successfully!");
    setUpdateProduct({
      id: "",
      name: "",
      description: "",
      price: "",
      discount: 0,
      finalPrice: 0,
      image: "",
      backgroundColor: "#FFFFFF",
      category: "",
      stock: 0,
      tags: [],
      isActive: true,
    });
    setProductTab("list");
  };

  const handleDeleteProduct = (id) => {
    const filteredProducts = products.filter((p) => p.id !== id);
    setProducts(filteredProducts);
    toast.success("✅ Product deleted successfully!");
  };

  const handleEditClick = (product) => {
    setUpdateProduct({ ...product });
    setProductTab("update");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    // Add actual logout logic
  };

  // --- Render content ---
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <div className="text-lg">📊 Dashboard: stats, graphs, notifications</div>;

      case "products":
        return (
          <div>
            <h2 className="text-2xl font-bold text-amber-800 mb-4">👜 Product Management</h2>

            {/* Sub-options */}
            <div className="flex space-x-3 mb-6">
              {["create", "list", "update", "delete"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProductTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium shadow-sm transition ${
                    productTab === tab ? "bg-amber-700 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Create Product */}
            {productTab === "create" && (
              <div className="bg-white p-6 rounded-lg shadow max-w-lg">
                <h3 className="text-xl font-semibold mb-4 text-amber-800">➕ Create Product</h3>
                <form onSubmit={handleProductSubmit} className="space-y-4">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleProductChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={product.description}
                      onChange={handleProductChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter product description"
                      rows="3"
                    />
                  </div>

                  {/* Price & Discount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price ($) *</label>
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleProductChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter product price"
                        required
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={product.discount}
                        onChange={handleProductChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter discount"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Image & Background Color */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Image URL</label>
                      <input
                        type="text"
                        name="image"
                        value={product.image}
                        onChange={handleProductChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Background Color</label>
                      <input
                        type="text"
                        name="backgroundColor"
                        value={product.backgroundColor}
                        onChange={handleProductChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>

                  {/* Category & Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category *</label>
                      <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleProductChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter category"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleProductChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter stock quantity"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={product.tags.join(",")}
                      onChange={(e) =>
                        setProduct({ ...product, tags: e.target.value.split(",").map(tag => tag.trim()) })
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="e.g. leather, premium, handmade"
                    />
                  </div>

                  {/* IsActive */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={product.isActive}
                      onChange={(e) =>
                        setProduct({ ...product, isActive: e.target.checked })
                      }
                      className="h-4 w-4 text-amber-700 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <label className="text-sm font-medium text-gray-700">Active</label>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition"
                  >
                    Save Product
                  </button>
                </form>
              </div>
            )}

            {/* TODO: Add List, Update, Delete UI here (can use your previous implementation) */}
          </div>
        );

      case "orders":
        return <div>📦 Order Management: view/update orders, tracking, invoices</div>;
      case "users":
        return <div>👥 User Management: view/block users, purchase history</div>;
      case "payments":
        return <div>💳 Payments: history, refunds, filters</div>;
      case "coupons":
        return <div>🎟️ Coupons: create/manage discounts, flash sales</div>;
      case "reviews":
        return <div>⭐ Reviews: approve/delete, statistics</div>;
      case "content":
        return <div>📢 Content: banners, blogs, FAQ, policies</div>;
      case "reports":
        return <div>📈 Reports: sales, top products, demographics</div>;
      case "settings":
        return <div>⚙️ Settings: store info, shipping, taxes, payment gateways</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-amber-800 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-amber-700">Admin Panel</div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-3 py-2 rounded-md text-left transition ${
                activeTab === tab.id
                  ? "bg-amber-700 text-white"
                  : "text-amber-100 hover:bg-amber-700 hover:text-white"
              }`}
            >
              <span className="mr-3">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 flex items-center px-3 py-2 text-red-200 rounded-md hover:bg-red-600 hover:text-white transition"
        >
          <LogOut className="mr-2" size={18} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;