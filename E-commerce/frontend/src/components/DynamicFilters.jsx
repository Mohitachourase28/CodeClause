import React from 'react';

const DynamicFilters = ({
  showFilters,
  sortBy,
  setSortBy,
  categories,
  selectedCategory,
  handleCategoryChange,
  priceRange,
  setPriceRange,
  loadMoreProducts,
  loading,
  resetFilters
}) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Min Price: ${priceRange.min}</label>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Max Price: ${priceRange.max}</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={loadMoreProducts}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Load More Products'}
        </button>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default DynamicFilters;
