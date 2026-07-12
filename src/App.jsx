import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Atom, FlaskConical, Grid2X2, LayoutDashboard, Search, ShieldCheck, ShoppingCart, Tags } from "lucide-react";
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Admin from "./pages/Admin.jsx";
import Cart from "./pages/Cart.jsx";
import { useCart } from "./context/CartContext.jsx";
import { FaWhatsapp } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const { count } = useCart();

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-mark"><Atom size={22} /></span>
        Galaxy Lab
      </Link>
      <nav>
        <NavLink to="/"><FlaskConical size={18} /> Home</NavLink>
        <a href="/#products"><Grid2X2 size={18} /> Products</a>
        <a href="/#categories"><Tags size={18} /> Categories</a>
        <NavLink to="/cart"><ShoppingCart size={18} /> Cart {count > 0 && <span className="nav-count">{count}</span>}</NavLink>
        <NavLink to="/admin"><LayoutDashboard size={18} /> Admin Panel</NavLink>
      </nav>
      <button className="icon-button" onClick={() => navigate("/?focus=search")} title="Search products">
        <Search size={19} />
      </button>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>Galaxy Lab</strong>
        <p>Professional laboratory products, clean ordering, and precise admin control.</p>
      </div>
      <span><ShieldCheck size={18} /> Secure lab supply orders</span>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <a
  href="https://wa.me/917505695198"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#25D366",
    color: "white",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    fontSize: "30px",
    zIndex: 1000,
  }}
>
  <FaWhatsapp />
</a>
    </>
  );
}
