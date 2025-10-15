import { useState } from "react";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

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

  const products = [
    {
      id: "salsa_chilli_churri_300ml",
      name: "Salsa Chilli-Churri (300 ml)",
      desc: "Smoky, spicy, and bold — our signature blend.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/5-1.jpg",
    },
    {
      id: "aderezo_cilantro_300ml",
      name: "Aderezo Cilantro (300 ml)",
      desc: "Bright, herbal, perfect on grilled meats or salads.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Diseno-sin-titulo-3.png",
    },
    {
      id: "salsa_cremo_haba_300ml",
      name: "Salsa Cremo Haba (300 ml)",
      desc: "Creamy habanero with mellow heat and flavor.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/6-1.jpg",
    },
    {
      id: "salsa_habanero_300ml",
      name: "Salsa Habanero (300 ml)",
      desc: "Pure habanero heat — for those who demand spice.",
      img: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/7.jpg",
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1f2937", backgroundColor: "#fff8f0" }}>
      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 30px", background: "linear-gradient(90deg, #f97316, #b91c1c)", color: "white", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ display: "flex", alignItems: "center", fontSize: "1.8rem" }}>
          <img
            src="https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Post-Mayo-GnK-300x300.png"
            alt="Mikuzka Logo"
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10, background: "white", padding: 3 }}
          />
          Mikuzka
        </h1>
        <ul style={{ display: "flex", gap: 24, listStyle: "none", margin: 0 }}>
          <li><a href="#inicio" style={{ color: "white", textDecoration: "none" }}>Inicio</a></li>
          <li><a href="#productos" style={{ color: "white", textDecoration: "none" }}>Productos</a></li>
          <li><a href="#contacto" style={{ color: "white", textDecoration: "none" }}>Contacto</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <header
        id="inicio"
        style={{
          position: "relative",
          height: "60vh",
          backgroundImage: `url("/your-hero-image.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "40px 30px",
          borderRadius: 16,
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "3rem", marginBottom: "20px" }}>
            Salsas que despiertan tus sentidos
          </h2>
          <p style={{ fontSize: "1.3rem", maxWidth: "600px", margin: "auto" }}>
            Hechas con ingredientes frescos y recetas artesanales. Añade sabor real a cada plato.
          </p>
        </div>
      </header>

      {/* Products Section */}
      <section id="productos" style={{ maxWidth: 1100, margin: "80px auto", padding: "0 20px" }}>
        <h3 style={{ textAlign: "center", fontSize: "2.4rem", color: "#b91c1c", marginBottom: 50 }}>
          Nuestras salsas artesanales
        </h3>

        {/* Featured */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #fff5eb, #ffdcb0)",
          borderRadius: 16, padding: 30, boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          marginBottom: 60,
        }}>
          <img
            src={products[0].img}
            alt={products[0].name}
            style={{ width: 280, borderRadius: 16, marginRight: 30, objectFit: "cover" }}
          />
          <div style={{ maxWidth: 400 }}>
            <h4 style={{ fontSize: "1.9rem", color: "#b91c1c", marginBottom: 12 }}>
              ⭐ {products[0].name}
            </h4>
            <p style={{ color: "#374151", marginBottom: 16 }}>{products[0].desc}</p>
            <p style={{ fontWeight: "bold", color: "#065f46", marginBottom: 20 }}>60 pesos</p>
            <button
              onClick={() => handleCheckout(products[0].id)}
              style={{
                background: "linear-gradient(90deg, #f59e0b, #f97316)",
                color: "white",
                border: "none",
                padding: "14px 24px",
                borderRadius: 8,
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              🛒 Comprar ahora
            </button>
          </div>
        </div>

        {/* Other Products */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 40,
        }}>
          {products.slice(1).map((p) => (
            <div
              key={p.id}
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                padding: 24,
                textAlign: "center",
                transition: "transform 0.3s ease, boxShadow 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, marginBottom: 16 }}
              />
              <h4 style={{ fontSize: "1.4rem", color: "#b91c1c", marginBottom: 8 }}>{p.name}</h4>
              <p style={{ color: "#374151", fontSize: "1rem", marginBottom: 14 }}>{p.desc}</p>
              <p style={{ fontWeight: "bold", color: "#065f46", marginBottom: 18 }}>60 pesos</p>
              <button
                onClick={() => handleCheckout(p.id)}
                style={{
                  background: "linear-gradient(90deg, #f59e0b, #f97316)",
                  color: "white",
                  border: "none",
                  padding: "12px 22px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                🛒 Agregar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Why Mikuzka */}
      <section style={{ background: "#fff5e5", padding: "80px 20px 40px", textAlign: "center" }}>
        <h3 style={{ fontSize: "2rem", color: "#b91c1c", marginBottom: 30 }}>¿Por qué elegir Mikuzka?</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
          gap: 40,
          maxWidth: 900,
          margin: "auto",
        }}>
          <div>
            <h4 style={{ fontSize: "1.3rem", marginBottom: 10 }}>Ingredientes 100 % naturales</h4>
            <p style={{ color: "#374151" }}>Sin preservantes, solo sabor auténtico.</p>
          </div>
          <div>
            <h4 style={{ fontSize: "1.3rem", marginBottom: 10 }}>Producción artesanal</h4>
            <p style={{ color: "#374151" }}>Cada batch hecho con cuidado y pasión.</p>
          </div>
          <div>
            <h4 style={{ fontSize: "1.3rem", marginBottom: 10 }}>Sabor equilibrado</h4>
            <p style={{ color: "#374151" }}>Picor justo, aromas completos, textura cremosa.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "60px 20px", maxWidth: 900, margin: "60px auto" }}>
        <h3 style={{ fontSize: "2rem", color: "#b91c1c", textAlign: "center", marginBottom: 30 }}>
          Lo que nuestros clientes dicen
        </h3>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 30,
          justifyContent: "center",
        }}>
          {[
            { text: "La Chilli-Churri me conquistó — el sabor más auténtico.", author: "Veronica G." },
            { text: "El aderezo de cilantro transformó mis tacos al instante.", author: "Luis M." },
            { text: "Picante perfecto pero sabroso — mi nueva salsa preferida.", author: "Karina R." },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 12,
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                padding: 30,
                maxWidth: 280,
                flex: "1 1 280px",
              }}
            >
              <p style={{ fontStyle: "italic", marginBottom: 20 }}>"{t.text}"</p>
              <p style={{ fontWeight: "bold", textAlign: "right", color: "#b91c1c" }}>— {t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" style={{ background: "#fff5e5", padding: "80px 20px", textAlign: "center" }}>
        <h3 style={{ fontSize: "2rem", color: "#b91c1c", marginBottom: 20 }}>Contáctanos</h3>
        <p><strong>Correo:</strong> contacto@mikuzka.com.mx</p>
        <p><strong>Instagram:</strong> <a href="https://instagram.com/mikuzka" style={{ color: "#b91c1c" }} target="_blank" rel="noreferrer">@mikuzka</a></p>
      </section>

      {/* Footer */}
      <footer style={{ background: "#1f2937", color: "white", textAlign: "center", padding: "30px 20px" }}>
        © 2025 Mikuzka • La salsa que más gusta  
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: 8 }}>Powered by Yoghurrrrrrrrrrt!</p>
      </footer>

      {/* Chat Widget */}
      <div style={{
        position: "fixed", bottom: 20, right: 20, width: 320, borderRadius: 10, overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 9999
      }}>
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
          <div style={{ background: "#f9fafb", display: "flex", flexDirection: "column", height: 350 }}>
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    margin: "8px 0",
                    padding: "8px 12px",
                    borderRadius: 12,
                    maxWidth: "80%",
                    backgroundColor: msg.sender === "user" ? "#f97316" : "#e5e7eb",
                    color: msg.sender === "user" ? "white" : "#111827",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
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
                style={{ flex: 1, border: "none", padding: 10, fontSize: "0.9rem", outline: "none" }}
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
