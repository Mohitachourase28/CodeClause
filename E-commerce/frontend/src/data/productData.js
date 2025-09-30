import img1 from "../assets/1.png";
import img3 from "../assets/3.png";
import img7 from "../assets/7.png";
import img8 from "../assets/8.png";
import img9 from "../assets/9.png";
import img10 from "../assets/10.png"; 
import img11 from "../assets/11.png"; 
import img12 from "../assets/12.png"; 
import img13 from "../assets/13.png"; 
import img14 from "../assets/14.png";
import img15 from "../assets/15.png";
import img16 from "../assets/16.png";


const productBatches = {
  electronics: [
    { id: 1, name: "Premium Wireless Headphones", price: 299.99, category: "Electronics", image: img1, rating: 4.5, description: "...", inStock: true, stock: 15 },
    { id: 9, name: "Gaming Mechanical Keyboard", price: 159.99, category: "Electronics", image: img9, rating: 4.6, description: "...", inStock: true, stock: 22 },
    { id: 10, name: "4K Webcam", price: 89.99, category: "Electronics", image: img10, rating: 4.3, description: "...", inStock: true, stock: 31 }
  ],
  clothing: [
    { id: 3, name: "Organic Cotton T-Shirt", price: 29.99, category: "Clothing", image: img3, rating: 4.7, description: "...", inStock: true, stock: 42 },
    { id: 11, name: "Denim Jacket", price: 79.99, category: "Clothing", image: img11, rating: 4.4, description: "...", inStock: true, stock: 19 },
    { id: 12, name: "Wool Sweater", price: 119.99, category: "Clothing", image: img12, rating: 4.8, description: "...", inStock: true, stock: 14 }
  ],
  sports: [
    { id: 8, name: "Yoga Mat", price: 39.99, category: "Sports", image: img8, rating: 4.8, description: "...", inStock: true, stock: 35 },
    { id: 13, name: "Resistance Bands Set", price: 24.99, category: "Sports", image: img13, rating: 4.5, description: "...", inStock: true, stock: 28 },
    { id: 14, name: "Protein Shaker Bottle", price: 15.99, category: "Sports", image: img14, rating: 4.2, description: "...", inStock: true, stock: 67 }
  ],
  home: [
    { id: 7, name: "Coffee Maker", price: 89.99, category: "Home", image: img7, rating: 4.1, description: "...", inStock: true, stock: 12 },
    { id: 15, name: "Essential Oil Diffuser", price: 45.99, category: "Home", image: img15, rating: 4.6, description: "...", inStock: true, stock: 21 },
    { id: 16, name: "Smart Plant Sensor", price: 34.99, category: "Home", image: img16, rating: 4.3, description: "...", inStock: true, stock: 18 }
  ]
};

export default productBatches;
