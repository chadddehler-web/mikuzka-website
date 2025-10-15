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

  // --- Fixed Checkout Function ---
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

      console.log("Sending items to checkout:", lineItems);

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
        console.error("Checkout error:", data.error || "No URL returned");
        alert(
          "❌ Error al crear el pago: " +
            (data.error || "Verifica los logs del servidor.")
        );
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
          zIndex: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: 0.2 }}>
          Mikuzka
        </h1>
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
            onClick={() => setCartOpen(true)}
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
        <p
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: "0.92rem",
            color: "#6b7280",
          }}
        >
          * Envío: México +$9.99 MXN | Internacional +$30 MXN
        </p>
      </section>

      {/* CONTACT */}
      <section
        id="contacto"
        style={{
          backgroundColor: "#fff4e6",
          textAlign: "center",
          padding: "80px 18px",
          borderTop: "4px solid #f97316",
        }}
      >
        <h3 style={{ fontSize: "2.1rem", color: "#b91c1c", fontWeight: 800 }}>
          Pedidos y Ventas
        </h3>
        <p>📞 462-291-2002 | 462-170-6282 | 462-170-6308 | 462-265-5775</p>
        <p style={{ color: "#b91c1c", fontWeight: 700 }}>
          ✉️ mikuzka.salsas@gmail.com
        </p>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#111827",
          color: "white",
          textAlign: "center",
          padding: "28px 18px",
        }}
      >
        © 2025 Mikuzka • La salsa que más gusta 🌶️
      </footer>
    </div>
  );
}
