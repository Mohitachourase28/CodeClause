import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter } from 'lucide-react';

//components
import ProductCard from '../components/ProductCard.jsx';
import ProductSkeleton from '../components/ProductSkeleton.jsx';
import DynamicFilters from '../components/DynamicFilters.jsx';

//modals
import ProductDetailModal from '../modals/ProductDetailModal.jsx';
import CartModal from '../modals/CartModal.jsx';
import CheckoutModal from '../modals/CheckoutModal.jsx';

//data
import productBatches from '../data/productData.js';

const EcommerceCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  /* Load initial products */
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const initialProducts = [
        ...productBatches.electronics.slice(0, 1),
        ...productBatches.clothing.slice(0, 1),
        ...productBatches.sports.slice(0, 1),
        ...productBatches.home.slice(0, 1),
      ];
      setProducts(initialProducts);
      setLoading(false);
    }, 1000);
  }, []);

  /* Load products dynamically by category */
  const loadProductsByCategory = (category) => {
    setLoading(true);
    setTimeout(() => {
      const categoryKey = category.toLowerCase();
      if (productBatches[categoryKey]) {
        const newProducts = [...products];
        productBatches[categoryKey].forEach(p => {
          if (!newProducts.find(prod => prod.id === p.id)) newProducts.push(p);
        });
        setProducts(newProducts);
      }
      setLoading(false);
    }, 800);
  };

  /* Load more products */
  const loadMoreProducts = () => {
    setLoading(true);
    setTimeout(() => {
      const allProducts = Object.values(productBatches).flat();
      const newProducts = allProducts
        .filter(p => !products.find(prod => prod.id === p.id))
        .slice(0, 4);

      if (newProducts.length > 0) setProducts(prev => [...prev, ...newProducts]);
      setLoading(false);
    }, 1000);
  };

  /* Sorting */
  const sortProducts = (productsToSort, sortType) => {
    const sorted = [...productsToSort];
    switch (sortType) {
      case 'price-low': return sorted.sort((a, b) => a.price - b.price);
      case 'price-high': return sorted.sort((a, b) => b.price - a.price);
      case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':
      default: return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  /* Filter and sort products */
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    filtered = sortProducts(filtered, sortBy);

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products, sortBy, priceRange]);

  /* Category change handler */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category !== 'All') loadProductsByCategory(category);
  };

  /* Cart actions */
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
//   const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">E-Shop</h1>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products dynamically..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filters component */}
        <DynamicFilters
          showFilters={showFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          loadMoreProducts={loadMoreProducts}
          loading={loading}
          resetFilters={() => {
            setSearchTerm('');
            setSelectedCategory('All');
            setSortBy('name');
            setPriceRange({ min: 0, max: 1000 });
          }}
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && products.length === 0
            ? Array(8).fill(0).map((_, idx) => <ProductSkeleton key={idx} />)
            : filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                setSelectedProduct={setSelectedProduct}
                addToCart={addToCart}
              />
            ))
          }
          {loading && products.length > 0 && Array(4).fill(0).map((_, idx) => <ProductSkeleton key={`loading-${idx}`} />)}
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
        />
      )}
      {showCart && (
        <CartModal
          cart={cart}
          onClose={() => setShowCart(false)}
          updateCartQuantity={updateCartQuantity}
          setShowCheckout={setShowCheckout}
        />
      )}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          setCart={setCart}
        />
      )}
    </div>
  );
};

export default EcommerceCatalog;
