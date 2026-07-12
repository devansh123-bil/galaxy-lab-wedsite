import { useState } from "react";
import { Send } from "lucide-react";
import { api } from "../api.js";

const initial = {
  quantity: 1,
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  shipping_address: "",
  notes: ""
};

export default function OrderForm({ product }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({ ...form, product_id: product.id, quantity: Number(form.quantity) })
      });
      setStatus("Order placed successfully. We will contact you shortly.");
      setForm(initial);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="order-form" onSubmit={submit}>
      <h2>Order Now</h2>
      <div className="form-grid">
        <label>Quantity<input name="quantity" type="number" min="1" max={product.stock} value={form.quantity} onChange={update} required /></label>
        <label>Name<input name="customer_name" value={form.customer_name} onChange={update} required /></label>
        <label>Email<input name="customer_email" type="email" value={form.customer_email} onChange={update} required /></label>
        <label>Phone<input name="customer_phone" value={form.customer_phone} onChange={update} required /></label>
      </div>
      <label>Address<textarea name="shipping_address" value={form.shipping_address} onChange={update} required /></label>
      <label>Notes<textarea name="notes" value={form.notes} onChange={update} /></label>
      <button className="primary-button" disabled={loading || product.stock < 1}>
        <Send size={18} /> {loading ? "Placing..." : "Place Order"}
      </button>
      {status && <p className="form-status">{status}</p>}
    </form>
  );
}
