import React, { useState } from "react";
import "./index.css"; // optional: move CSS there if you prefer clean JSX

export default function Mikuzka() {
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const appendMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const handleSubmit = async (e) => {
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

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
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
          backdropFilter: "blur(6px)",
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
        <ul style={{ listStyle: "none", display: "flex", gap: 20, margin: 0, padding: 0 }}>
          <li><a href="#inicio" style={{ color: "white", textDecoration: "none" }}>Inicio</a></li>
          <li><a href="#productos" style={{ color: "white", textDecoration: "none" }}>Productos</a></li>
          <li><a href="#contacto" style={{ color: "white", textDecoration: "none" }}>Contacto</a></li>
        </ul>
      </nav>

      <header id="inicio" style={{ textAlign: "center", padding: "80px 20px 60px" }}>
        <h2 style={{ fontSize: "3rem", color: "#b91c1c" }}>La salsa que más gusta 🌿</h2>
        <p style={{ fontSize: "1.2rem", color: "#374151", maxWidth: 700, margin: "auto" }}>
          Sabores auténticos, ingredientes frescos y el toque especial de Mikuzka.
          Descubre por qué todos aman nuestras salsas artesanales.
        </p>
      </header>

      <section id="productos" style={{ padding: "60px 20px", maxWidth: 1100, margin: "auto" }}>
        <h3 style={{ fontSize: "2rem", color: "#b91c1c", textAlign: "center" }}>Selección de productos</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 30 }}>
          {[
            {
              img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Diseno-sin-titulo-3.png",
              name: "Aderezo Cilantro (300ml)",
            },
            {
              img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/5-1.jpg",
              name: "Salsa Chilli-Churri (300ml)",
            },
            {
              img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/6-1.jpg",
              name: "Salsa Cremo Haba (300ml)",
            },
            {
              img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/7.jpg",
              name: "Salsa Habanero (300ml)",
            },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                padding: 20,
                textAlign: "center",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              <img src={p.img} alt={p.name} style={{ width: 180, borderRadius: 10 }} />
              <h4 style={{ margin: "10px 0 5px" }}>{p.name}</h4>
              <p style={{ color: "#065f46", fontWeight: "bold" }}>60 pesos</p>
              <button
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

      <section id="contacto" style={{ textAlign: "center", marginBottom: 40 }}>
        <h3 style={{ fontSize: "2rem", color: "#b91c1c" }}>Contáctanos</h3>
        <p><strong>Correo:</strong> contacto@mikuzka.com.mx</p>
        <p>
          <strong>Instagram:</strong>{" "}
          <a href="https://instagram.com/mikuzka" target="_blank" rel="noreferrer">
            @mikuzka
          </a>
        </p>
      </section>

      <footer style={{ backgroundColor: "rgba(0,0,0,0.85)", color: "#f3f4f6", textAlign: "center", padding: 25 }}>
        © 2025 Mikuzka • La salsa que más gusta 🌶️
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: 5 }}>
          Powered by Yoghurrrrrrrrrrt!
        </p>
      </footer>

      {/* Chat Widget */}
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
            textAlign: "center",
            cursor: "pointer",
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
                    backgroundColor: msg.sender === "user" ? "#f97316" : "#e5e7eb",
                    color: msg.sender === "user" ? "white" : "#111827",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", borderTop: "1px solid #d1d5db" }}>
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
