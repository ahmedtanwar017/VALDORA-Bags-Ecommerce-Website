import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

const categories = [
  "all",
  "totes",
  "backpacks",
  "crossbody",
  "briefcases",
  "duffles",
  "clutches",
  "messenger",
  "handbags",
];

// Reusable card component
const ProductCard = ({ product, addToCart }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100">
    <div className="h-64 overflow-hidden rounded-t-xl">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-amber-900 mb-1">{product.name}</h3>
      <p className="text-amber-700 text-sm mb-3 line-clamp-2">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-amber-900">${product.price}</span>
        <button
          onClick={() => addToCart(product)}
          className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/store");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    toast.success(`${product.name} added to cart!`);
  };

  // Filter and search
  const filteredProducts = products.filter((product) => {
    const matchesCategory = filter === "all" || product.category === filter;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProduct = products.find((p) => p.featured);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header */}
      <header className="bg-amber-900 text-white sticky top-0 shadow-md z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">VALDORA</h1>
          <nav className="hidden md:block">
            <ul className="flex gap-6">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-amber-200 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <a href="/setting" className="hover:text-amber-200 transition-colors">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
          <button
            onClick={() => setCartVisible(!cartVisible)}
            className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Cart ({cart.length})
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-amber-700 to-amber-800 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Elevate Your Style</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Discover our premium collection of bags crafted with excellence for every occasion
          </p>
          <button className="bg-white text-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-100 transition-colors shadow-md">
            Shop Collection
          </button>
        </div>
      </section>

      {/* Featured Product */}
      {featuredProduct && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-900 mb-10 text-center">
              Featured Product
            </h2>
            <div className="flex flex-col md:flex-row items-center bg-amber-50 rounded-2xl shadow-lg overflow-hidden max-w-5xl mx-auto border border-amber-200">
              <div className="md:w-1/2 h-96">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2 text-left">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">
                  {featuredProduct.name}
                </h3>
                <p className="text-amber-700 mb-6">{featuredProduct.description}</p>
                <p className="text-2xl font-bold text-amber-900 mb-6">${featuredProduct.price}</p>
                <button
                  onClick={() => addToCart(featuredProduct)}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-lg transition-colors font-medium shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section id="products" className="py-16 flex-1">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-10">Our Collection</h2>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full p-4 pl-10 text-sm text-amber-900 border border-amber-300 rounded-lg bg-amber-50 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 bottom-2.5 text-amber-700 hover:text-amber-900 p-2 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2.5 rounded-full transition-all ${
                  filter === category
                    ? "bg-amber-700 text-white shadow-md"
                    : "bg-white text-amber-900 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading & Empty */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700 mb-4"></div>
              <p className="text-amber-700 text-lg">Loading products...</p>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <p className="text-amber-700 text-lg">No products found in this category.</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} addToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cart Sidebar */}
      {cartVisible && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-20 p-6 border-l border-amber-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-amber-900">Your Cart</h3>
            <button onClick={() => setCartVisible(false)} className="text-amber-700 hover:text-amber-900">✕</button>
          </div>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-amber-700">Your cart is empty</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center border-b border-amber-100 pb-4">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-amber-900">{item.name}</p>
                    <p className="text-amber-700">${item.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-amber-200 bg-white">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-amber-900">
                  ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
                </span>
              </div>
              <button className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-medium transition-colors">
                Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-amber-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">VALDORA</h4>
            <p className="text-sm text-amber-200">
              Premium bags and accessories crafted for your style.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-amber-200 text-sm">
              <li><a href="#products" className="hover:underline">All Products</a></li>
              <li><a href="#home" className="hover:underline">Featured</a></li>
              <li><a href="/setting" className="hover:underline">Settings</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-amber-200 text-sm">
              <li><a href="#about" className="hover:underline">About Us</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
              <li><a href="#careers" className="hover:underline">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-amber-200 text-sm">
              <li><a href="#faq" className="hover:underline">FAQ</a></li>
              <li><a href="#shipping" className="hover:underline">Shipping</a></li>
              <li><a href="#returns" className="hover:underline">Returns</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-amber-200 text-sm py-4 border-t border-amber-700">
          © {new Date().getFullYear()} VALDORA. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Store;
