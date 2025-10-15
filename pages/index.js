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

  // 💬 Chatbot logic
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

  // 🌶️ Product list
  const products = [
    {
      id: "salsa_chilli_churri_300ml",
      name: "Salsa Chilli-Churri (300ml)",
      desc: "Nuestra salsa estrella — una fusión vibrante de chiles secos, ajo, especias y notas ahumadas irresistibles.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/5-1.jpg",
      price: "60 pesos",
      featured: true,
    },
    {
      id: "aderezo_cilantro_300ml",
      name: "Aderezo Cilantro (300ml)",
      desc: "Refrescante y herbal, ideal para carnes, tacos o ensaladas.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Diseno-sin-titulo-3.png",
      price: "60 pesos",
    },
    {
      id: "salsa_cremo_haba_300ml",
      name: "Salsa Cremo Haba (300ml)",
      desc: "Cremosa y suave, con habanero ligero y un sabor ahumado equilibrado.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/6-1.jpg",
      price: "60 pesos",
    },
    {
      id: "salsa_habanero_300ml",
      name: "Salsa Habanero (300ml)",
      desc: "Intensa, picante y llena de carácter — para los valientes amantes del fuego.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/7.jpg",
      price: "60 pesos",
    },
  ];

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
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Mikuzka</h1>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "18px",
            margin: 0,
            padding: 0,
            fontWeight: 500,
          }}
        >
          <li><a href="#inicio" style={{ color: "white", textDecoration: "none" }}>Inicio</a></li>
          <li><a href="#productos" style={{ color: "white", textDecoration: "none" }}>Productos</a></li>
          <li><a href="#contacto" style={{ color: "white", textDecoration: "none" }}>Contacto</a></li>
        </ul>
      </nav>

      {/* 🌄 HERO SECTION */}
      <header
        id="inicio"
        style={{
          backgroundImage:
            "url('https://tse3.mm.bing.net/th/id/OIP._z3OT9YQ8ScqkQA5afvYegHaJ4?cb=12&pid=Api')",
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
            backgroundColor: "rgba(0,0,0,0.55)",
            borderRadius: 20,
            padding: "40px 20px",
            maxWidth: 600,
            margin: "auto",
          }}
        >
          <h2 style={{ fontSize: "2.8rem", fontWeight: 700, lineHeight: 1.2 }}>
            El sabor que enciende tus sentidos 🌶️
          </h2>
          <p style={{ fontSize: "1.2rem", margin: "20px 0" }}>
            Hechas con ingredientes frescos — chiles, ajo, cilantro y amor mexicano.
          </p>
          <a
            href="#productos"
            style={{
              background: "linear-gradient(90deg,#f59e0b,#f97316)",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            Ver productos
          </a>
        </div>
      </header>

      {/* 🫙 PRODUCT SECTION */}
      <section
        id="productos"
        style={{
          maxWidth: 1100,
          margin: "100px auto",
          padding: "0 20px",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: "2.3rem",
            color: "#b91c1c",
            marginBottom: 60,
            fontWeight: 700,
          }}
        >
          Nuestras Salsas Artesanales
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 40,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                background: "white",
                borderRadius: 20,
                boxShadow: p.featured
                  ? "0 0 25px rgba(245, 158, 11, 0.9)"
                  : "0 8px 20px rgba(0,0,0,0.1)",
                border: p.featured ? "3px solid #f59e0b" : "none",
                textAlign: "center",
                overflow: "hidden",
                transform: p.featured ? "scale(1.05)" : "none",
                animation: p.featured
                  ? "pulseGlow 2.5s infinite alternate ease-in-out"
                  : "none",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: 20 }}>
                {p.featured && (
                  <div
                    style={{
                      background: "linear-gradient(90deg,#f59e0b,#f97316)",
                      color: "white",
                      borderRadius: 20,
                      padding: "4px 12px",
                      display: "inline-block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    ⭐ Top Seller
                  </div>
                )}
                <h4 style={{ color: "#b91c1c", fontSize: "1.4rem", fontWeight: 700 }}>
                  {p.name}
                </h4>
                <p style={{ color: "#374151", fontSize: "0.95rem", marginBottom: 15 }}>
                  {p.desc}
                </p>
                <p style={{ color: "#065f46", fontWeight: "bold", marginBottom: 10 }}>
                  {p.price}
                </p>
                <button
                  onClick={() => handleCheckout(p.id)}
                  style={{
                    background: "linear-gradient(90deg,#f59e0b,#f97316)",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  🛒 Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📞 CONTACT */}
      <section
        id="contacto"
        style={{
          backgroundColor: "#fff4e6",
          textAlign: "center",
          padding: "100px 20px",
          borderTop: "4px solid #f97316",
        }}
      >
        <h3 style={{ fontSize: "2.3rem", color: "#b91c1c", marginBottom: 20 }}>
          Pedidos y Ventas
        </h3>
        <p style={{ fontSize: "1.1rem", marginBottom: 30 }}>
          Para ventas directas y mayoreo favor de comunicarse:
        </p>
        <p>📞 462 - 291 - 2002</p>
        <p>📞 462 - 170 - 6282 | 462 - 170 - 6308</p>
        <p>📞 462 - 265 - 5775</p>
        <p style={{ color: "#b91c1c", fontWeight: 600 }}>✉️ mikuzka.salsas@gmail.com</p>

        <h4 style={{ color: "#b91c1c", marginTop: 40 }}>¿Tienes alguna pregunta? ¡No seas tímido!</h4>
        <p>Si necesitas una cotización o buscas algo especial, llena el formulario:</p>

        <form
          style={{
            maxWidth: 600,
            margin: "40px auto 0",
            display: "flex",
            flexDirection: "column",
            gap: 15,
            textAlign: "left",
          }}
        >
          <label>Nombre *</label>
          <input type="text" required style={{ padding: 12, borderRadius: 6, border: "1px solid #ddd" }} />
          <label>Email *</label>
          <input type="email" required style={{ padding: 12, borderRadius: 6, border: "1px solid #ddd" }} />
          <label>Mensaje</label>
          <textarea rows="4" style={{ padding: 12, borderRadius: 6, border: "1px solid #ddd" }}></textarea>
          <button
            type="submit"
            style={{
              marginTop: 10,
              background: "linear-gradient(90deg,#f59e0b,#f97316)",
              color: "white",
              padding: "12px 20px",
              borderRadius: 8,
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Enviar
          </button>
        </form>
      </section>

      {/* FOOTER */}
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
          Hechas a mano en México 🇲🇽 | Powered by Yoghurrrrrrrrrrt!
        </p>
      </footer>

      {/* 💬 CHATBOT */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: "90%",
          maxWidth: 320,
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
            <form onSubmit={handleChatSubmit} style={{ display: "flex", borderTop: "1px solid #d1d5db" }}>
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

      {/* 🔥 Animation */}
      <style jsx>{`
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
          }
          100% {
            box-shadow: 0 0 25px rgba(245, 158, 11, 1);
          }
        }
      `}</style>
    </div>
  );
}
