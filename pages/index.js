import { useMemo, useState } from "react";
import Head from "next/head";

export default function Home() {
  // --- Chatbot ---
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const appendMessage = (text, sender) =>
    setMessages((prev) => [...prev, { text, sender }]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    appendMessage(input, "user");
    setInput("");
    appendMessage("Mikuzka está respondiendo...", "bot");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: data?.reply || "Gracias por escribirnos 🙌", sender: "bot" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Error: No pudimos obtener respuesta.", sender: "bot" },
      ]);
    }
  };

  // --- Catalog ---
  const catalog = {
    salsa_chilli_churri_300ml: {
      id: "salsa_chilli_churri_300ml",
      name: "Salsa Chilli-Churri (300ml)",
      desc:
        "Nuestra salsa estrella: chiles secos, ajo y especias con notas ahumadas irresistibles.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/5-1.jpg",
      priceCents: 6000,
      featured: true,
    },
    aderezo_cilantro_300ml: {
      id: "aderezo_cilantro_300ml",
      name: "Aderezo Cilantro (300ml)",
      desc: "Refrescante y herbal — ideal para tacos, carnes y ensaladas.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Diseno-sin-titulo-3.png",
      priceCents: 6000,
    },
    salsa_cremo_haba_300ml: {
      id: "salsa_cremo_haba_300ml",
      name: "Salsa Cremo Haba (300ml)",
      desc: "Cremosa con habanero suave y un toque ahumado equilibrado.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/6-1.jpg",
      priceCents: 6000,
    },
    salsa_habanero_300ml: {
      id: "salsa_habanero_300ml",
      name: "Salsa Habanero (300ml)",
      desc: "Picante e intensa — para verdaderos amantes del fuego.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/7.jpg",
      priceCents: 6000,
    },
  };

  const products = Object.values(catalog);

  // --- Cart state ---
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = useMemo(
    () => cart.reduce((sum, it) => sum + it.qty, 0),
    [cart]
  );

  const addToCart = (id) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === id);
      if (exists) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id, qty: 1 }];
    });
    setCartOpen(true);
  };

  const incQty = (id) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );

  const decQty = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
        .filter((i) => i.qty > 0)
    );

  const removeItem = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotalCents = useMemo(
    () =>
      cart.reduce(
        (sum, it) => sum + (catalog[it.id]?.priceCents || 0) * it.qty,
        0
      ),
    [cart]
  );

  const formatMXN = (cents) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(cents / 100);

  // --- Checkout ---
  const handleCheckout = async () => {
    if (!cart.length) {
      alert("Tu carrito está vacío 🛒");
      return;
    }

    try {
      console.log("Checkout clicked ✅ Cart:", cart);
      const lineItems = cart.map((it) => ({
        id: it.id,
        quantity: it.qty,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lineItems }),
      });

      const data = await res.json();
      console.log("Stripe checkout response:", data);

      if (res.ok && data?.url) {
        window.location.href = data.url;
      } else {
        alert("❌ Error al crear el pago: " + (data.error || "Error desconocido."));
      }
    } catch (e) {
      console.error("Stripe fetch error:", e);
      alert("⚠️ Error al conectar con el servidor de Stripe.");
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fff8f0",
        color: "#1f2937",
      }}
    >
      <Head>
        <title>Mikuzka | La salsa que más gusta 🌶️</title>
        <meta
          name="description"
          content="Salsas artesanales con ingredientes frescos y auténticos sabores mexicanos."
        />
      </Head>

      {/* NAVBAR */}
      <nav
        style={{
          background: "linear-gradient(90deg, #f97316, #b91c1c)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 18px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Mikuzka</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="#inicio" style={{ color: "#fff", textDecoration: "none" }}>
            Inicio
          </a>
          <a href="#productos" style={{ color: "#fff", textDecoration: "none" }}>
            Productos
          </a>
          <a href="#contacto" style={{ color: "#fff", textDecoration: "none" }}>
            Contacto
          </a>
          <button
            onClick={() => setCartOpen((prev) => !prev)}
            aria-label="Abrir carrito"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            🛒 {cartCount}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header
        id="inicio"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2016/04/13/22/31/chili-1327669_1280.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
          padding: "120px 20px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: 680,
            margin: "0 auto",
            backgroundColor: "rgba(0,0,0,0.45)",
            borderRadius: 18,
            padding: "36px 20px",
          }}
        >
          <h2 style={{ fontSize: "2.6rem", fontWeight: 800, lineHeight: 1.2 }}>
            El sabor que enciende tus sentidos 🌶️
          </h2>
          <p style={{ fontSize: "1.15rem", margin: "16px 0 22px" }}>
            Ingredientes frescos y amor artesanal — directo a tu mesa.
          </p>
          <a
            href="#productos"
            style={{
              background: "linear-gradient(90deg,#f59e0b,#f97316)",
              color: "white",
              padding: "12px 22px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 700,
              boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
            }}
          >
            Ver productos
          </a>
        </div>
      </header>

      {/* PRODUCTS */}
      <section
        id="productos"
        style={{
          maxWidth: 1120,
          margin: "88px auto",
          padding: "0 18px",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: "2.2rem",
            color: "#b91c1c",
            marginBottom: 44,
            fontWeight: 800,
          }}
        >
          Nuestras Salsas Artesanales
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                background: "white",
                borderRadius: 18,
                boxShadow: p.featured
                  ? "0 0 24px rgba(245,158,11,0.85)"
                  : "0 8px 18px rgba(0,0,0,0.12)",
                border: p.featured ? "3px solid #f59e0b" : "1px solid #eee",
                textAlign: "center",
                overflow: "hidden",
                transform: p.featured ? "scale(1.03)" : "none",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{ width: "100%", height: 240, objectFit: "cover" }}
              />
              <div style={{ padding: 18 }}>
                {p.featured && (
                  <div
                    style={{
                      background: "linear-gradient(90deg,#f59e0b,#f97316)",
                      color: "white",
                      borderRadius: 999,
                      padding: "4px 12px",
                      display: "inline-block",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      marginBottom: 10,
                    }}
                  >
                    ⭐ Top Seller
                  </div>
                )}
                <h4 style={{ color: "#b91c1c", fontWeight: 800 }}>{p.name}</h4>
                <p style={{ color: "#374151", fontSize: "0.95rem" }}>{p.desc}</p>
                <p style={{ color: "#065f46", fontWeight: 800 }}>
                  {formatMXN(p.priceCents)}
                </p>
                <button
                  onClick={() => addToCart(p.id)}
                  style={{
                    background: "linear-gradient(90deg,#f59e0b,#f97316)",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  🛒 Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CART OVERLAY */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 40,
          }}
        />
      )}

      {/* CART SIDEBAR */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: cartOpen ? 0 : "-400px",
          width: "100%",
          maxWidth: 380,
          height: "100vh",
          background: "white",
          boxShadow: "0 0 24px rgba(0,0,0,0.25)",
          zIndex: 50,
          transition: "right 0.25s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>Tu carrito</strong>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 14, overflowY: "auto", flex: 1 }}>
          {cart.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Tu carrito está vacío.</p>
          ) : (
            cart.map((it) => {
              const p = catalog[it.id];
              if (!p) return null;
              return (
                <div
                  key={it.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px 1fr auto",
                    gap: 10,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ color: "#065f46", fontWeight: 700 }}>
                      {formatMXN(p.priceCents)}
                    </div>
                    <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                      <button onClick={() => decQty(it.id)} style={qtyBtnStyle}>
                        −
                      </button>
                      <span>{it.qty}</span>
                      <button onClick={() => incQty(it.id)} style={qtyBtnStyle}>
                        +
                      </button>
                      <button
                        onClick={() => removeItem(it.id)}
                        style={{
                          ...qtyBtnStyle,
                          background: "transparent",
                          border: "1px solid #ef4444",
                          color: "#ef4444",
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: 16, borderTop: "1px solid "#eee" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span>Subtotal</span>
            <strong>{formatMXN(subtotalCents)}</strong>
          </div>
          <div
            style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: 12 }}
          >
            Envío calculado en el Checkout (MX: <b>$200 MXN</b>, Intl:{" "}
            <b>$700 MXN</b>).
          </div>
          <button
            disabled={!cart.length}
            onClick={handleCheckout}
            style={{
              width: "100%",
              background: "linear-gradient(90deg,#f59e0b,#f97316)",
              color: "white",
              border: "none",
              padding: "12px 16px",
              borderRadius: 10,
              cursor: cart.length ? "pointer" : "not-allowed",
              fontWeight: 800,
            }}
          >
            Pagar con Stripe
          </button>
        </div>
      </aside>

      {/* CHAT WIDGET */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: "92%",
          maxWidth: 320,
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          zIndex: 60,
        }}
      >
        <div
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            backgroundColor: "#f97316",
            color: "white",
            padding: "12px 15px",
            fontWeight: 700,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          💬 Soporte Mikuzka {chatOpen ? "▾" : "▸"}
        </div>

        {chatOpen && (
          <div
            style={{
              background: "#f9fafb",
              display: "flex",
              flexDirection: "column",
              height: 350,
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    margin: "8px 0",
                    padding: "8px 12px",
                    borderRadius: 12,
                    maxWidth: "80%",
                    backgroundColor:
                      msg.sender === "user" ? "#f97316" : "#e5e7eb",
                    color: msg.sender === "user" ? "white" : "#111827",
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={handleChatSubmit}
              style={{ display: "flex", borderTop: "1px solid #d1d5db" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                style={{
                  flex: 1,
                  border: "none",
                  padding: 10,
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#f97316",
                  color: "white",
                  border: "none",
                  padding: "0 15px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Enviar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  background: "transparent",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "2px 10px",
  cursor: "pointer",
  fontWeight: 700,
};
