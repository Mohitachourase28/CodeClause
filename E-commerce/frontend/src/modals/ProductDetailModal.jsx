import React from "react";
import { X, Plus, Star } from "lucide-react";

const ProductDetailModal = ({ product, onClose, addToCart }) => {
  //render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++)
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    if (hasHalfStar)
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
        />
      );
    for (let i = stars.length; i < 5; i++)
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);

    return stars;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />

            <div>
              <div className="flex items-center mb-3">
                <div className="flex mr-2">{renderStars(product.rating)}</div>
                <span className="text-gray-600">({product.rating})</span>
              </div>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <div className="mb-4 text-3xl font-bold text-blue-600">
                ${product.price}
              </div>
              <div className="mb-4 text-sm text-gray-600">
                Category: {product.category}
              </div>
              <div className="mb-6">
                <span
                  className={`text-sm ${
                    product.inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inStock
                    ? `In Stock (${product.stock} available)`
                    : "Out of Stock"}
                </span>
              </div>

              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                disabled={!product.inStock}
                className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  product.inStock
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Plus className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
