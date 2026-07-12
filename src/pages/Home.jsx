import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Search, SlidersHorizontal } from "lucide-react";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("focus") === "search") setTimeout(() => searchRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    api(`/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => {
    api("/api/products/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  const featured = useMemo(() => products.slice(0, 3), [products]);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><FlaskConical size={18} /> Laboratory Essentials</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>Galaxy Lab</motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            Source scientific equipment, glassware, reagents, and lab-ready supplies from a clean professional storefront.
          </motion.p>
        </div>
      </section>

      <section className="toolbar" id="categories">
        <label className="search-box">
          <Search size={18} />
          <input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
        </label>
        <label className="select-box">
          <SlidersHorizontal size={18} />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All lab categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </section>

      {featured.length > 0 && (
        <section className="featured-strip">
          {featured.map((product) => (
            <div key={product.id}>
              <span>{product.category}</span>
              <strong>{product.name}</strong>
            </div>
          ))}
        </section>
      )}

      <section className="product-section" id="products">
        <div className="section-heading">
          <h2>Lab Products</h2>
          <p>{products.length} products available</p>
        </div>
        {loading ? <p className="empty-state">Loading products...</p> : null}
        {!loading && products.length === 0 ? <p className="empty-state">No products yet. Add your first Galaxy Lab product in the admin panel.</p> : null}
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
