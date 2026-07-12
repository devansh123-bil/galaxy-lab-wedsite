import { Fragment, useEffect, useState } from "react";
import { Boxes, Edit3, FlaskConical, LogIn, Plus, RefreshCcw, Save, ShoppingBag, X } from "lucide-react";
import { api, assetUrl } from "../api.js";

const emptyProduct = { name: "", price: "", description: "", category: "", stock: "" };

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [login, setLogin] = useState({ email: "", password: "" });
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const loadAdminData = async () => {
    const [productRows, orderRows] = await Promise.all([api("/api/products"), api("/api/orders")]);
    setProducts(productRows);
    setOrders(orderRows);
  };

  useEffect(() => {
    if (token) loadAdminData().catch((error) => setMessage(error.message));
  }, [token]);

  async function submitLogin(event) {
    event.preventDefault();
    try {
      const data = await api("/api/auth/login", { method: "POST", body: JSON.stringify(login) });
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setMessage("Signed in successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitProduct(event) {
    event.preventDefault();
    const form = new FormData();
    Object.entries(productForm).forEach(([key, value]) => form.append(key, value));
    if (image) form.append("image", image);

    try {
      if (editingProductId) {
        await api(`/api/products/${editingProductId}`, { method: "PUT", body: form });
      } else {
        await api("/api/products", { method: "POST", body: form });
      }
      setMessage(editingProductId ? "Product updated." : "Product added.");
      setProductForm(emptyProduct);
      setEditingProductId(null);
      setImage(null);
      event.currentTarget.reset();
      await loadAdminData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function startEdit(product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock
    });
    setImage(null);
    setMessage(`Editing ${product.name}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingProductId(null);
    setProductForm(emptyProduct);
    setImage(null);
    setMessage("");
  }

  async function updateStatus(id, status) {
    try {
      await api(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await loadAdminData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteProduct(id) {
    try {
      await api(`/api/products/${id}`, { method: "DELETE" });
      await loadAdminData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!token) {
    return (
      <section className="admin-shell narrow">
        <form className="admin-card" onSubmit={submitLogin}>
          <h1><LogIn size={24} /> Galaxy Lab Admin</h1>
          <label>Email<input type="email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} required /></label>
          <label>Password<input type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} required /></label>
          <button className="primary-button"><LogIn size={18} /> Sign In</button>
          {message && <p className="form-status">{message}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <div className="admin-top">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage Galaxy Lab products, images, stock, and customer orders.</p>
        </div>
        <button className="secondary-button" onClick={loadAdminData}><RefreshCcw size={17} /> Refresh</button>
      </div>
      {message && <p className="form-status">{message}</p>}

      <div className="admin-grid">
        <form className="admin-card" onSubmit={submitProduct}>
          <h2>{editingProductId ? <Edit3 size={21} /> : <Plus size={21} />} {editingProductId ? "Edit Product" : "Add Product"}</h2>
          <div className="form-grid">
            <label>Name<input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required /></label>
            <label>Price<input type="number" step="0.01" min="0" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required /></label>
            <label>Category<input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required /></label>
            <label>Stock<input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required /></label>
          </div>
          <label>Description<textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required /></label>
          <label>Product Image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setImage(e.target.files[0])} /></label>
          <div className="admin-actions">
            <button className="primary-button">{editingProductId ? <Save size={18} /> : <ShoppingBag size={18} />} {editingProductId ? "Update Product" : "Save Product"}</button>
            {editingProductId && <button className="secondary-button" type="button" onClick={cancelEdit}><X size={18} /> Cancel</button>}
          </div>
        </form>

        <div className="admin-card">
          <h2><Boxes size={21} /> Products</h2>
          <div className="admin-list">
            {products.map((product) => (
              <div className="admin-row" key={product.id}>
                <img src={assetUrl(product.image_url)} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <span>${Number(product.price).toFixed(2)} - {product.category} - {product.stock} stock</span>
                </div>
                <div className="row-actions">
                  <button className="secondary-button icon-only" type="button" onClick={() => startEdit(product)} title="Edit product"><Edit3 size={17} /></button>
                  <button className="danger-button" type="button" onClick={() => deleteProduct(product.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2><FlaskConical size={21} /> Order Management</h2>
        <div className="order-table">
          <div className="order-head">Ordered Products</div>
          <div className="order-head">Customer</div>
          <div className="order-head">Total Price</div>
          <div className="order-head">Status</div>
          {orders.map((order) => (
            <Fragment key={order.id}>
              <div>#{order.id}<br /><span>{order.product_name} x {order.quantity}</span></div>
              <div>{order.customer_name}<br /><span>{order.customer_phone}</span><span>{order.shipping_address}</span></div>
              <div>${Number(order.total_amount).toFixed(2)}</div>
              <div>
                <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}>
                  <option value="new">New</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
