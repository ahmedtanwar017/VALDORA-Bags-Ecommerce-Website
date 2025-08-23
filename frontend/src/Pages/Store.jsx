// src/pages/Store.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCog,
  FaBoxOpen,
  FaSearch,
} from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { MdLocalOffer } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";
import api from "../api";
import Spinner from "../Components/Spinner";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.message ? [] : data);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#5C4033]">
      {/* Top Navbar */}
      <header className="bg-white sticky top-0 z-50 shadow-md">
        <div className="px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <h1
            className="text-3xl font-extrabold tracking-widest cursor-pointer text-[#5C4033] hover:text-[#A67C52] transition"
            onClick={() => navigate("/store")}
          >
            VALDORA
          </h1>

          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-72 sm:w-96">
            <FaSearch className="text-[#5C4033]" />
            <input
              type="text"
              placeholder="Search for products..."
              className="ml-2 w-full outline-none text-[#5C4033] bg-transparent placeholder-[#A67C52]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 text-lg">
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 text-[#A67C52] hover:text-[#5C4033] transition"
            >
              <FaUserCog /> <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-[#A67C52] hover:text-[#5C4033] transition"
            >
              <FaShoppingCart /> <span className="hidden sm:inline">Cart</span>
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-2 text-[#A67C52] hover:text-[#5C4033] transition"
            >
              <FaBoxOpen /> <span className="hidden sm:inline">Orders</span>
            </button>
          </div>
        </div>

        {/* Secondary Navbar */}
        <nav className="bg-white text-[#5C4033] px-6 py-2 flex gap-8 text-sm sm:text-base border-t border-gray-200 overflow-x-auto whitespace-nowrap">
          <button className="hover:text-[#A67C52] flex items-center gap-2 transition">
            <AiOutlineInfoCircle /> About
          </button>
          <button className="hover:text-[#A67C52] flex items-center gap-2 transition">
            <MdLocalOffer /> Offers
          </button>
          <button className="hover:text-[#A67C52] flex items-center gap-2 transition">
            <FiHelpCircle /> Help
          </button>
          <button className="hover:text-[#A67C52] flex items-center gap-2 transition">
            Careers
          </button>
          <button className="hover:text-[#A67C52] flex items-center gap-2 transition">
            Blog
          </button>
        </nav>
      </header>

      {/* Products Section */}
      <main className="flex-1 px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600 text-xl">
            No products available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-2 transition-all p-5 flex flex-col group border border-gray-200"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="h-56 w-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-3 left-3 bg-white border border-[#5C4033] text-[#5C4033] text-xs px-2 py-1 rounded-md font-bold">
                    New
                  </span>
                </div>

                {/* Product Info */}
                <h2 className="mt-4 font-semibold text-lg text-[#5C4033] line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-[#A67C52] text-sm line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-2 font-bold text-lg text-[#5C4033]">
                  ${product.price}
                </p>

                {/* Action */}
                <button
                  className="mt-auto bg-[#5C4033] hover:bg-[#A67C52] text-white font-semibold py-2 rounded-lg shadow-md transition"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white text-[#5C4033] px-6 py-10 mt-auto border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="font-bold mb-2">About VALDORA</h3>
            <p className="text-[#A67C52] text-sm">
              Premium bags & accessories crafted with style and durability.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Customer Care</h3>
            <ul className="space-y-1 text-[#A67C52] text-sm">
              <li>Help Center</li>
              <li>Shipping & Returns</li>
              <li>Track My Order</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Stay Connected</h3>
            <ul className="space-y-1 text-[#A67C52] text-sm">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>
        <div className="text-[#A67C52] text-sm border-t border-gray-200 pt-4 flex justify-between">
          <p>© 2025 VALDORA Inc. All rights reserved.</p>
          <p>English | $USD - United States</p>
        </div>
      </footer>
    </div>
  );
};

export default Store;
