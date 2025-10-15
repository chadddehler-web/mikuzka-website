import Stripe from "stripe";

// Initialize Stripe with your platform secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { product } = req.body;

    // ✅ Define your product catalog here
    const products = {
      aderezo_cilantro_300ml: {
        name: "Aderezo Cilantro (300ml)",
        price: 6000, // Stripe uses cents (60.00 MXN)
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
    if (!selected) {
      return res.status(400).json({ error: "Invalid product selected" });
    }

    // ✅ Create checkout session on behalf of the connected account
    const session = await stripe.checkout.sessions.create(
      {
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

        // 💰 Optional: Take a small platform fee (e.g. 5 MXN)
        payment_intent_data: {
          application_fee_amount: 500, // Fee in cents (MXN)
        },
      },
      {
        // 🎯 This ensures payment goes to the connected account
        stripeAccount: process.env.STRIPE_CONNECTED_ACCOUNT_ID,
      }
    );

    // Return the checkout URL to the frontend
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Connect Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
