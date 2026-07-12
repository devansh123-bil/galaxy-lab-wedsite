import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Send, ShoppingCart, Trash2 } from "lucide-react";
import { api, assetUrl } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

const initial = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  shipping_address: "",
  notes: ""
};

export default function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    if (!items.length) return;

    setLoading(true);
    setStatus("");
    try {
      for (const item of items) {
        await api("/api/orders", {
          method: "POST",
          body: JSON.stringify({
            ...form,
            product_id: item.id,
            quantity: item.quantity,
            notes: `${form.notes ? `${form.notes}\n\n` : ""}Cart order total: $${total.toFixed(2)}`
          })
        });
      }
      clearCart();
      setForm(initial);
      setStatus("Order placed successfully. Admin can view it in Order Management.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="cart-page" id="cart">
      <div className="section-heading">
        <div>
          <span className="eyebrow"><ShoppingCart size={17} /> Cart</span>
          <h1>Your Lab Cart</h1>
        </div>
        <strong className="cart-total">${total.toFixed(2)}</strong>
      </div>

      {!items.length ? (
        <div className="empty-panel">
          <p>Your cart is empty.</p>
          <Link className="primary-link inline-link" to="/#products">Browse Products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-row" key={item.id}>
                <img src={assetUrl(item.image_url)} alt={item.name} />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>${Number(item.price).toFixed(2)}</p>
                </div>
                <div className="quantity-control">
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} title="Decrease quantity"><Minus size={16} /></button>
                  <input value={item.quantity} type="number" min="1" onChange={(event) => updateQuantity(item.id, event.target.value)} />
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} title="Increase quantity"><Plus size={16} /></button>
                </div>
                <button className="danger-button icon-only" type="button" onClick={() => removeItem(item.id)} title="Remove item"><Trash2 size={17} /></button>
              </article>
            ))}
          </div>

          <form className="order-form" onSubmit={submit}>
            <h2>Checkout</h2>
            <div className="form-grid">
              <label>Name<input name="customer_name" value={form.customer_name} onChange={update} required /></label>
              <label>Email<input name="customer_email" type="email" value={form.customer_email} onChange={update} required /></label>
              <label>Phone Number<input name="customer_phone" value={form.customer_phone} onChange={update} required /></label>
              <label>Total Price<input value={`$${total.toFixed(2)}`} readOnly /></label>
            </div>
            <label>Address<textarea name="shipping_address" value={form.shipping_address} onChange={update} required /></label>
            <label>Notes<textarea name="notes" value={form.notes} onChange={update} /></label>
            <button className="primary-button" disabled={loading}>
              <Send size={18} /> {loading ? "Placing..." : "Place Order"}
            </button>
            {status && <p className="form-status">{status}</p>}
          </form>
        </div>
      )}
    </section>
  );
}
