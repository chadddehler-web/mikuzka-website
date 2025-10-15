import { useState } from "react";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🔁 --- Stripe Checkout (Connect) ---
  const handleCheckout = async (productId) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Error al crear la sesión de pago.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con Stripe.");
    }
  };

  // 💬 --- Chat helpers ---
  const appendMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

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
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Error: No pudimos obtener respuesta.", sender: "bot" },
      ]);
    }
  };

  const products = [
    {
      id: "aderezo_cilantro_300ml",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Diseno-sin-titulo-3.png",
      name: "Aderezo Cilantro (300ml)",
      priceLabel: "60 pesos",
    },
    {
      id: "salsa_chilli_churri_300ml",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/5-1.jpg",
      name: "Salsa Chilli-Churri (300ml)",
      priceLabel: "60 pesos",
    },
    {
      id: "salsa_cremo_haba_300ml",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/6-1.jpg",
      name: "Salsa Cremo Haba (300ml)",
      priceLabel: "60 pesos",
    },
    {
      id: "salsa_habanero_300ml",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/7.jpg",
      name: "Salsa Habanero (300ml)",
      priceLabel: "60 pesos",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        margin: 0,
        padding: 0,
        background:
          "#fffaf0 url('https://www.toptal.com/designers/subtlepatterns/patterns/pw_maze_white.png') repeat",
        color: "#1f2937",
      }}
    >
      {/* 🟧 Navbar */}
      <nav
        style={{
          background: "linear-gradient(90deg, #f59e0b, #f97316)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 25px",
          position: "sticky",
          top: 0,
          zIndex: 999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ display: "flex", alignItems: "center", fontSize: "1.9rem" }}>
          <img
            src="https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Post-Mayo-GnK-300x300.png"
            alt="Mikuzka Logo"
            style={{
              width: 70,
              height: 70,
              marginRight: 10,
              borderRadius: 8,
              background: "#f59e0b",
              padding: 4,
            }}
          />
          Mikuzka
        </h1>
        <ul style={{ listStyle: "none", display: "flex", gap: 20, margin: 0 }}>
          <li><a href="#inicio" style={{ color: "white", textDecoration: "none" }}>Inicio</a></li>
          <li><a href="#productos" style={{ color: "white", textDecoration: "none" }}>Productos</a></li>
          <li><a href="#contacto" style={{ color: "white", textDecoration: "none" }}>Contacto</a></li>
        </ul>
      </nav>

      {/* 🧄 Header */}
      <header
        id="inicio"
        style={{
          textAlign: "center",
          padding: "80px 20px 60px",
          background: "rgba(255, 255, 255, 0.95)",
          marginBottom: 40,
        }}
      >
        <h2 style={{ fontSize: "3rem", color: "#b91c1c", marginBottom: 10 }}>
          La salsa que más gusta 🌿
        </h2>
        <p style={{ fontSize: "1.2rem", color: "#374151", maxWidth: 700, margin: "auto" }}>
          Sabores auténticos, ingredientes frescos y el toque especial de Mikuzka.{" "}
          Descubre por qué todos aman nuestras salsas artesanales.
        </p>
      </header>

      {/* 🫙 Productos */}
      <section
        id="productos"
        style={{
          padding: "60px 20px",
          maxWidth: 1100,
          margin: "auto",
          background: "rgba(255,255,255,0.92)",
          borderRadius: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          marginBottom: 40,
          scrollMarginTop: 70,
        }}
      >
        <h3
          style={{
            fontSize: "2rem",
            color: "#b91c1c",
            textAlign: "center",
            marginBottom: 40,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Selección de productos
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 30,
            justifyItems: "center",
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                padding: 20,
                textAlign: "center",
                width: 200,
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{ width: 180, height: "auto", borderRadius: 10, marginBottom: 15 }}
              />
              <h4 style={{ margin: "10px 0 5px", color: "#111827", fontSize: "1.1rem", fontWeight: 600 }}>
                {p.name}
              </h4>
              <p style={{ fontSize: "1.1rem", color: "#065f46", fontWeight: "bold", marginBottom: 10 }}>
                {p.priceLabel}
              </p>
              <button
                onClick={() => handleCheckout(p.id)}
                style={{
                  background: "linear-gradient(90deg, #f59e0b, #f97316)",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 8,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #b45309, #f97316)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #f59e0b, #f97316)")}
              >
                🛒 Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 📞 Contacto */}
      <section
        id="contacto"
        style={{
          textAlign: "center",
          padding: "60px 20px",
          maxWidth: 1100,
          margin: "auto",
          background: "rgba(255,255,255,0.92)",
          borderRadius: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          marginBottom: 40,
          scrollMarginTop: 70,
        }}
      >
        <h3 style={{ fontSize: "2rem", color: "#b91c1c", marginBottom: 20, fontWeight: 700 }}>
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

      {/* 🦶 Footer */}
      <footer
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          color: "#f3f4f6",
          textAlign: "center",
          padding: 25,
          fontSize: "0.9rem",
          position: "relative",
        }}
      >
        © 2025 Mikuzka • La salsa que más gusta 🌶️
        <p className="powered-by" style={{ textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: 5 }}>
          Powered by Yoghurrrrrrrrrrt!
        </p>
      </footer>

      {/* 💬 Chat Widget */}
      <div
        id="chat-widget"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 300,
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          borderRadius: 10,
          overflow: "hidden",
          zIndex: 9999,
        }}
      >
        <div
          id="chat-header"
          style={{
            backgroundColor: "#f97316",
            color: "white",
            padding: "12px 15px",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "center",
            position: "relative",
          }}
          onClick={() => setChatOpen(!chatOpen)}
        >
          💬 Soporte Mikuzka
          <button
            id="chat-toggle"
            style={{
              position: "absolute",
              right: 10,
              top: 8,
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            {chatOpen ? "_" : "▢"}
          </button>
        </div>

        {chatOpen && (
          <div id="chat-body" style={{ background: "#f9fafb", maxHeight: 400, display: "flex", flexDirection: "column" }}>
            <div id="chatbox" style={{ padding: 10, height: 250, overflowY: "auto", flex: 1 }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    margin: "8px 0",
                    padding: "8px 12px",
                    borderRadius: 12,
                    maxWidth: "80%",
                    wordWrap: "break-word",
                    lineHeight: 1.4,
                    backgroundColor: msg.sender === "user" ? "#f97316" : "#e5e7eb",
                    color: msg.sender === "user" ? "white" : "#111827",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <form id="inputForm" onSubmit={handleChatSubmit} style={{ display: "flex", borderTop: "1px solid #d1d5db" }}>
              <input
                type="text"
                id="userInput"
                placeholder="Escribe tu mensaje..."
                autoComplete="off"
                required
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flex: 1, border: "none", padding: 10, fontSize: "0.9rem", outline: "none" }}
              />
              <button
                type="submit"
                id="sendBtn"
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
