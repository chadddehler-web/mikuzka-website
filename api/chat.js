import OpenAI from "openai";
import nodemailer from "nodemailer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Simple regex patterns
const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phoneRegex = /(\+?\d{1,2}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    // 1️⃣ Generate chatbot reply constrained to salsas
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres un asistente de ventas de Mikuzka. Solo puedes hablar sobre los productos de la página web: 

1. Aderezo Cilantro (300ml)
2. Salsa Chilli-Churri (300ml)
3. Salsa Cremo Haba (300ml)
4. Salsa Habanero (300ml)

Nunca hables sobre el clima, deportes, noticias u otros temas que no estén relacionados con las salsas. 
Si alguien pregunta algo fuera de esto, responde amablemente que solo puedes hablar sobre las salsas y la página web.

Proporciona detalles sobre sabor, uso, recomendaciones y precios si es relevante.
Responde siempre de manera amigable y persuasiva, como un asistente de ventas.`
        },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    // 2️⃣ Detect email or phone in the message
    const foundEmail = message.match(emailRegex);
    const foundPhone = message.match(phoneRegex);

    if (foundEmail || foundPhone) {
      // Send lead email
      await transporter.sendMail({
        from: `"Mikuzka AI Lead" <${process.env.MAIL_USER}>`,
        to: "chadddehler@gmail.com",
        subject: "🧠 New Lead from Mikuzka Chat",
        text: `Message: ${message}\n\nDetected Email: ${foundEmail ? foundEmail[0] : "N/A"}\nDetected Phone: ${foundPhone ? foundPhone[0] : "N/A"}`
      });
    }

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI API or Email error" });
  }
}
