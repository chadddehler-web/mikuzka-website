import { useState } from "react";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🧾 Stripe Checkout
  const handleCheckout = async (productId) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert("Error al crear la sesión de pago.");
    } catch (err) {
      console.error(err);
      alert("Error al conectar con Stripe.");
    }
  };

  // 💬 Chat
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
        { text: data.reply, sender: "bot" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Error: No pudimos obtener respuesta.", sender: "bot" },
      ]);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fff8f0",
        color: "#1f2937",
        margin: 0,
        padding: 0,
      }}
    >
      {/* 🔸 NAVBAR */}
      <nav
        style={{
          background: "linear-gradient(90deg, #f97316, #b91c1c)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 30px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ display: "flex", alignItems: "center", fontSize: "1.8rem" }}>
          <img
            src="https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Post-Mayo-GnK-300x300.png"
            alt="Mikuzka Logo"
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              marginRight: 10,
              background: "#fff",
              padding: 3,
            }}
          />
          Mikuzka
        </h1>
        <ul style={{ display: "flex", listStyle: "none", gap: 20, margin: 0 }}>
          <li><a href="#inicio" style={{ color: "white", textDecoration: "none" }}>Inicio</a></li>
          <li><a href="#productos" style={{ color: "white", textDecoration: "none" }}>Productos</a></li>
          <li><a href="#contacto" style={{ color: "white", textDecoration: "none" }}>Contacto</a></li>
        </ul>
      </nav>

      {/* 🌶️ HERO SECTION */}
      <header
        id="inicio"
        style={{
          textAlign: "center",
          padding: "100px 20px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1613145993481-9a1b92f04c1c?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 20,
            padding: "40px 20px",
            display: "inline-block",
          }}
        >
          <h2 style={{ fontSize: "3rem", fontWeight: 700 }}>
            La salsa que despierta tus sentidos 🌶️
          </h2>
          <p style={{ fontSize: "1.2rem", maxWidth: 600, margin: "20px auto" }}>
            Auténticas, frescas y hechas con pasión — Mikuzka lleva el sabor de México directo a tu mesa.
          </p>
        </div>
      </header>

      {/* 🫙 PRODUCT SECTION */}
      <section
        id="productos"
        style={{
          maxWidth: 1100,
          margin: "80px auto",
          padding: "0 20px",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: "2.2rem",
            color: "#b91c1c",
            marginBottom: 50,
            fontWeight: 700,
          }}
        >
          Descubre nuestras salsas artesanales
        </h3>

        {/* FEATURED PRODUCT */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 70,
            background: "linear-gradient(135deg,#fff7ed,#ffe8d6)",
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            padding: 30,
          }}
        >
          <img
            src="https://www.mikuzka.com.mx/wp-content/uploads/2025/07/5-1.jpg"
            alt="Salsa Chilli-Churri"
            style={{
              width: 300,
              borderRadius: 20,
              margin: "0 30px 20px 0",
            }}
          />
          <div style={{ maxWidth: 400 }}>
            <h4 style={{ fontSize: "1.8rem", color: "#b91c1c" }}>
              ⭐ Salsa Chilli-Churri (300ml)
            </h4>
            <p style={{ margin: "10px 0", color: "#374151" }}>
              Una fusión audaz de chile seco, especias frescas y notas ahumadas — la favorita de todos.
            </p>
            <p style={{ fontWeight: "bold", color: "#065f46", marginBottom: 20 }}>60 pesos</p>
            <button
              onClick={() => handleCheckout("salsa_chilli_churri_300ml")}
              style={{
                background: "linear-gradient(90deg, #f59e0b, #f97316)",
                border: "none",
                color: "white",
                padding: "12px 22px",
                borderRadius: 8,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              🛒 Comprar ahora
            </button>
          </div>
        </div>

        {/* OTHER PRODUCTS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 40,
          }}
        >
          {[
            {
              id: "aderezo_cilantro_300ml",
              name: "Aderezo Cilantro (300ml)",
              desc: "Refrescante y suave, perfecta para carnes, tacos o ensaladas.",
              img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Diseno-sin-titulo-3.png",
            },
            {
              id: "salsa_cremo_haba_300ml",
              name: "Salsa Cremo Haba (300ml)",
              desc: "Cremosa con habanero suave, un balance ideal entre picor y sabor.",
              img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/6-1.jpg",
            },
            {
              id: "salsa_habanero_300ml",
              name: "Salsa Habanero (300ml)",
              desc: "Intensa y vibrante, hecha para los verdaderos amantes del picante.",
              img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/7.jpg",
            },
          ].map((p) => (
            <div
              key={p.id}
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                padding: 25,
                textAlign: "center",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginBottom: 15,
                }}
              />
              <h4 style={{ fontSize: "1.3rem", color: "#b91c1c", marginBottom: 8 }}>
                {p.name}
              </h4>
              <p style={{ color: "#374151", fontSize: "0.95rem", marginBottom: 12 }}>
                {p.desc}
              </p>
              <p style={{ fontWeight: "bold", color: "#065f46", marginBottom: 15 }}>
                60 pesos
              </p>
              <button
                onClick={() => handleCheckout(p.id)}
                style={{
                  background: "linear-gradient(90deg, #f59e0b, #f97316)",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                🛒 Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 📞 CONTACTO */}
      <section
        id="contacto"
        style={{
          backgroundColor: "#fef3c7",
          textAlign: "center",
          padding: "80px 20px",
          color: "#1f2937",
        }}
      >
        <h3 style={{ fontSize: "2rem", color: "#b91c1c", marginBottom: 20 }}>
          Contáctanos
        </h3>
        <p><strong>Correo:</strong> contacto@mikuzka.com.mx</p>
        <p>
          <strong>Instagram:</strong>{" "}
          <a href="https://instagram.com/mikuzka" target="_blank" rel="noreferrer">
            @mikuzka
          </a>
        </p>
      </section>

      {/* 🦶 FOOTER */}
      <footer
        style={{
          background: "#111827",
          color: "white",
          textAlign: "center",
          padding: "30px 20px",
        }}
      >
        © 2025 Mikuzka • La salsa que más gusta 🌶️  
        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
          Powered by Yoghurrrrrrrrrrt!
        </p>
      </footer>

      {/* 💬 CHAT */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 320,
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          zIndex: 9999,
        }}
      >
        <div
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            backgroundColor: "#f97316",
            color: "white",
            padding: "12px 15px",
            fontWeight: 600,
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
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 10,
              }}
            >
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
              style={{
                display: "flex",
                borderTop: "1px solid #d1d5db",
              }}
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
                  fontSize: "0.9rem",
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
