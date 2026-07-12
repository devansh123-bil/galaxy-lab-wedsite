import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Plus, ShoppingCart } from "lucide-react";
import { assetUrl } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <motion.article className="product-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }}>
      <Link to={`/products/${product.id}`} className="product-image">
        <img src={assetUrl(product.image_url)} alt={product.name} />
        <span>{product.category}</span>
      </Link>
      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-meta">
          <strong>₹{Number(product.price).toFixed(2)}</strong>
          <span>{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</span>
        </div>
        <div className="card-actions">
          <button className="secondary-button" type="button" onClick={() => addItem(product)} disabled={product.stock < 1}>
            <Plus size={17} /> Add
          </button>
          <Link className="primary-link" to={`/products/${product.id}`}>
            <ShoppingCart size={17} /> Order Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
