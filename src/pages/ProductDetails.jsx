import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PackageCheck, Plus, Tag } from "lucide-react";
import { api, assetUrl } from "../api.js";
import OrderForm from "../components/OrderForm.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    api(`/api/products/${id}`).then(setProduct).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="empty-state">{error}</p>;
  if (!product) return <p className="empty-state">Loading product...</p>;

  return (
    <section className="details-page">
      <Link className="back-link" to="/"><ArrowLeft size={17} /> Back to shop</Link>
      <div className="details-layout">
        <div className="details-image">
          <img src={assetUrl(product.image_url)} alt={product.name} />
        </div>
        <div className="details-copy">
          <span className="pill"><Tag size={15} /> {product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="price-row">
            <strong>${Number(product.price).toFixed(2)}</strong>
            <span><PackageCheck size={17} /> {product.stock} in stock</span>
          </div>
          <button className="secondary-button detail-cart-button" type="button" onClick={() => addItem(product)} disabled={product.stock < 1}>
            <Plus size={18} /> Add to Cart
          </button>
          <OrderForm product={product} />
        </div>
      </div>
    </section>
  );
}
