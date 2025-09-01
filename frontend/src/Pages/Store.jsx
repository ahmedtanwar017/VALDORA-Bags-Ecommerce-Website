import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../api";
import { toast } from "react-toastify";

const categories = [
  "all",
  "laptop backpacks",
  "laptop briefcases",
  "laptop messengers",
  "laptop sleeves",
  "laptop totes",
  "laptop duffles",
  "tech organizers"
];

// Enhanced ProductCard with laptop-specific features
const ProductCard = React.memo(({ product, addToCart }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 group">
    <div className="h-64 overflow-hidden rounded-t-xl relative">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      {product.featured && (
        <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
          FEATURED
        </span>
      )}
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-amber-900 mb-1">{product.name}</h3>
      <div className="flex items-center mb-2">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-amber-600 text-sm ml-2">(42)</span>
      </div>
      <p className="text-amber-700 text-sm mb-3 line-clamp-2">{product.description}</p>
      <div className="flex items-center text-sm text-amber-600 mb-3">
        <svg className="w-4 h-4 mr-1 fill-current text-amber-600" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Fits up to {product.laptopSize || '15"'} laptop
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-amber-900">${product.price.toFixed(2)}</span>
        <button
          onClick={() => addToCart(product)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium shadow-md hover:shadow-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

const CartItem = ({ item, index, removeFromCart }) => (
  <div className="flex items-center justify-between border-b border-amber-100 pb-4">
    <div className="flex items-center">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-12 h-12 object-cover rounded" 
        loading="lazy"
      />
      <div className="ml-3">
        <p className="text-sm font-medium text-amber-900">{item.name}</p>
        <p className="text-amber-700 font-medium">${item.price.toFixed(2)}</p>
      </div>
    </div>
    <button 
      onClick={() => removeFromCart(index)}
      className="text-amber-500 hover:text-red-500 transition-colors"
      aria-label={`Remove ${item.name} from cart`}
    >
      ✕
    </button>
  </div>
);

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/products/store");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = useCallback((product) => {
    setCart((prev) => [...prev, product]);
    toast.success(`${product.name} added to cart!`);
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
    toast.info("Item removed from cart");
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filter === "all" || product.category === filter;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, filter, searchQuery]);

  const featuredProduct = useMemo(() => 
    products.find((p) => p.featured), 
    [products]
  );

  const cartTotal = useMemo(() => 
    cart.reduce((total, item) => total + item.price, 0).toFixed(2), 
    [cart]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartVisible && !e.target.closest('.cart-sidebar') && !e.target.closest('.cart-button')) {
        setCartVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cartVisible]);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header */}
      <header className="bg-amber-900 text-white sticky top-0 shadow-md z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-amber-700 h-8 w-8 rounded-md flex items-center justify-center mr-2">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">VALDORA</h1>
          </div>
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
            className="cart-button bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            aria-label="Open shopping cart"
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
      <section id="home" className="bg-gradient-to-r from-amber-700 to-amber-800 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Professional Laptop Bags</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Protect your tech in style with our premium collection of laptop bags designed for professionals
          </p>
          <a 
            href="#products" 
            className="inline-block bg-white text-amber-900 px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            Explore Collection
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Secure Protection</h3>
              <p className="text-amber-700">Padded compartments to keep your devices safe from impacts</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Premium Materials</h3>
              <p className="text-amber-700">Water-resistant fabrics and durable construction for everyday use</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Smart Organization</h3>
              <p className="text-amber-700">Multiple compartments for laptops, tablets, and accessories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      {featuredProduct && (
        <section className="py-16 bg-amber-50" aria-labelledby="featured-heading">
          <div className="container mx-auto px-4">
            <h2 id="featured-heading" className="text-3xl font-bold text-amber-900 mb-10 text-center">
              Featured Product
            </h2>
            <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg overflow-hidden max-w-5xl mx-auto border border-amber-200">
              <div className="md:w-1/2 h-96">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-8 md:w-1/2 text-left">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">
                  {featuredProduct.name}
                </h3>
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-amber-600 text-sm ml-2">(128 reviews)</span>
                </div>
                <p className="text-amber-700 mb-6">{featuredProduct.description}</p>
                <div className="flex items-center text-amber-700 mb-4">
                  <svg className="w-5 h-5 mr-2 fill-current text-amber-600" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fits up to {featuredProduct.laptopSize || '17"'} laptops
                </div>
                <p className="text-2xl font-bold text-amber-900 mb-6">${featuredProduct.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(featuredProduct)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section id="products" className="py-16 flex-1" aria-labelledby="products-heading">
        <div className="container mx-auto px-4">
          <h2 id="products-heading" className="text-3xl font-bold text-center text-amber-900 mb-10">Laptop Bag Collection</h2>

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
                placeholder="Search laptop bags by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full p-4 pl-10 text-sm text-amber-900 border border-amber-300 rounded-lg bg-amber-50 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 bottom-2.5 text-amber-700 hover:text-amber-900 p-2 transition-colors"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12" role="group" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2.5 rounded-full transition-all ${
                  filter === category
                    ? "bg-amber-600 text-white shadow-md"
                    : "bg-white text-amber-900 hover:bg-amber-100 border border-amber-200"
                }`}
                aria-pressed={filter === category}
              >
                {category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading & Empty */}
          {loading && !error && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4"></div>
              <p className="text-amber-700 text-lg">Loading products...</p>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && !searchQuery && !error && (
            <div className="text-center py-12">
              <p className="text-amber-700 text-lg">No products found in this category.</p>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && searchQuery && !error && (
            <div className="text-center py-12">
              <p className="text-amber-700 text-lg">No products found matching "{searchQuery}".</p>
              <button 
                onClick={() => setSearchQuery("")} 
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
              >
                Clear Search
              </button>
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
        <div className="cart-sidebar fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-20 p-6 border-l border-amber-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-amber-900">Your Cart</h3>
            <button 
              onClick={() => setCartVisible(false)} 
              className="text-amber-700 hover:text-amber-900"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-amber-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-amber-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <CartItem 
                    key={`${item._id}-${index}`} 
                    item={item} 
                    index={index} 
                    removeFromCart={removeFromCart} 
                  />
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="border-t border-amber-200 pt-4 mt-auto">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-amber-900">Total:</span>
                <span className="font-bold text-amber-900">${cartTotal}</span>
              </div>
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-amber-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-amber-700 h-8 w-8 rounded-md flex items-center justify-center mr-2">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h4 className="font-bold text-lg">VALDORA</h4>
            </div>
            <p className="text-sm text-amber-200">
              Premium laptop bags and tech accessories for professionals.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-200">Shop</h4>
            <ul className="space-y-2 text-amber-200 text-sm">
              <li><a href="#products" className="hover:text-white transition-colors">All Products</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Featured</a></li>
              <li><a href="/setting" className="hover:text-white transition-colors">Settings</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-200">Company</h4>
            <ul className="space-y-2 text-amber-200 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-200">Support</h4>
            <ul className="space-y-2 text-amber-200 text-sm">
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#shipping" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#returns" className="hover:text-white transition-colors">Returns & Warranty</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-amber-200 text-sm py-4 border-t border-amber-800">
          © {new Date().getFullYear()} VALDORA. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Store;