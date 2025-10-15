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

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

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

  const handleCheckout = async () => {
    if (!cart.length) {
      alert("Tu carrito está vacío 🛒");
      return;
    }

    try {
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

  // --- Schema for Google SEO ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Mikuzka Salsas Artesanales",
    description:
      "Salsas mexicanas artesanales hechas con ingredientes frescos, especias auténticas y pasión por el sabor.",
    image: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/5-1.jpg",
    address: { "@type": "PostalAddress", addressCountry: "MX" },
    brand: "Mikuzka",
    url: "https://mikuzka.com.mx",
    sameAs: ["https://www.instagram.com/mikuzka", "https://facebook.com/mikuzka"],
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff8f0" }}>
      <Head>
        <title>Mikuzka | Salsas Artesanales Mexicanas 🌶️</title>
        <meta
          name="description"
          content="Compra salsas mexicanas artesanales de Mikuzka. Hechas con ingredientes naturales, amor y un toque picante auténtico."
        />
        <meta
          name="keywords"
          content="salsa mexicana, salsas artesanales, chile habanero, aderezo cilantro, salsa picante, salsa gourmet, Mikuzka"
        />
        <meta name="author" content="Mikuzka Salsas Artesanales" />
        <meta property="og:title" content="Mikuzka | Salsas Artesanales Mexicanas" />
        <meta
          property="og:description"
          content="Descubre las salsas artesanales mexicanas más deliciosas — Chilli-Churri, Habanero, Cremo Haba y más."
        />
        <meta
          property="og:image"
          content="https://www.mikuzka.com.mx/wp-content/uploads/2025/07/5-1.jpg"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mikuzka.com.mx" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
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
            "url('https://cdn.pixabay.com/photo/2017/01/04/19/00/pepper-1958419_1280.jpg')",
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
            maxWidth: 700,
            margin: "0 auto",
            backgroundColor: "rgba(0,0,0,0.45)",
            borderRadius: 18,
            padding: "36px 20px",
          }}
        >
          <h2 style={{ fontSize: "2.6rem", fontWeight: 800 }}>
            Salsas Artesanales Mexicanas
          </h2>
          <p style={{ fontSize: "1.1rem", margin: "16px 0 22px" }}>
            Picante, fresca y llena de sabor — hechas a mano en México 🇲🇽
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
            }}
          >
            Ver productos
          </a>
        </div>
      </header>

      {/* PRODUCTS */}
      <main
        id="productos"
        style={{
          maxWidth: 1120,
          margin: "88px auto",
          padding: "0 18px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#b91c1c",
            fontSize: "2rem",
            fontWeight: 800,
          }}
        >
          Nuestras Salsas
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: 40,
          }}
        >
          Descubre nuestras salsas únicas: Chilli-Churri, Cilantro, Cremo Haba y Habanero.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {products.map((p) => (
            <article
              key={p.id}
              style={{
                background: "white",
                borderRadius: 18,
                boxShadow: p.featured
                  ? "0 0 24px rgba(245,158,11,0.85)"
                  : "0 8px 18px rgba(0,0,0,0.12)",
                textAlign: "center",
                border: p.featured ? "3px solid #f59e0b" : "1px solid #eee",
              }}
            >
              <img
                src={p.img}
                alt={`${p.name} - ${p.desc}`}
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
                      fontWeight: 800,
                      display: "inline-block",
                      marginBottom: 10,
                    }}
                  >
                    ⭐ Recomendado
                  </div>
                )}
                <h3 style={{ color: "#b91c1c", fontWeight: 800 }}>{p.name}</h3>
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
            </article>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer
        id="contacto"
        style={{
          background: "#111827",
          color: "white",
          textAlign: "center",
          padding: "40px 20px",
          marginTop: 60,
        }}
      >
        <h3>Contacto</h3>
        <p>📞 462-291-2002 | 462-170-6308 | mikuzka.salsas@gmail.com</p>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: 10 }}>
          © 2025 Mikuzka Salsas Artesanales — Hechas con amor en México 🇲🇽
        </p>
      </footer>

      {/* CHATBOT (hidden when cart open) */}
      {!cartOpen && (
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
            background: "white",
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
      )}
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
