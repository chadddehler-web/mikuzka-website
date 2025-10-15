import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { product } = req.body;

    const products = {
      aderezo_cilantro_300ml: {
        name: "Aderezo Cilantro (300ml)",
        price: 6000,
      },
      salsa_chilli_churri_300ml: {
        name: "Salsa Chilli-Churri (300ml)",
        price: 6000,
      },
      salsa_cremo_haba_300ml: {
        name: "Salsa Cremo Haba (300ml)",
        price: 6000,
      },
      salsa_habanero_300ml: {
        name: "Salsa Habanero (300ml)",
        price: 6000,
      },
    };

    const selected = products[product];
    if (!selected) return res.status(400).json({ error: "Invalid product" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: selected.name,
              images: [
                "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Post-Mayo-GnK-300x300.png",
              ],
            },
            unit_amount: selected.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
