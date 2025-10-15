import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// All prices are MXN cents
const CATALOG = {
  salsa_chilli_churri_300ml: {
    name: "Salsa Chilli-Churri (300ml)",
    unit_amount: 6000,
    image: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/5-1.jpg",
  },
  aderezo_cilantro_300ml: {
    name: "Aderezo Cilantro (300ml)",
    unit_amount: 6000,
    image:
      "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/Diseno-sin-titulo-3.png",
  },
  salsa_cremo_haba_300ml: {
    name: "Salsa Cremo Haba (300ml)",
    unit_amount: 6000,
    image: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/6-1.jpg",
  },
  salsa_habanero_300ml: {
    name: "Salsa Habanero (300ml)",
    unit_amount: 6000,
    image: "https://www.mikuzka.com.mx/wp-content/uploads/2025/07/7.jpg",
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { items } = req.body; // [{id, quantity}]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const line_items = items
      .map(({ id, quantity }) => {
        const p = CATALOG[id];
        if (!p) return null;
        return {
          price_data: {
            currency: "mxn",
            product_data: {
              name: p.name,
              images: p.image ? [p.image] : undefined,
            },
            unit_amount: p.unit_amount,
          },
          quantity: Math.max(1, Number(quantity || 1)),
          adjustable_quantity: { enabled: true, minimum: 1, maximum: 50 },
        };
      })
      .filter(Boolean);

    // Updated shipping options (MXN cents)
    const shipping_options = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 20000, currency: "mxn" }, // 200 MXN
          display_name: "Envío nacional (México)",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 70000, currency: "mxn" }, // 700 MXN
          display_name: "Envío internacional",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 7 },
            maximum: { unit: "business_day", value: 15 },
          },
        },
      },
    ];

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        payment_method_types: ["card"],
        line_items,
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: [
            "MX",
            "US",
            "CA",
            "GB",
            "FR",
            "DE",
            "ES",
            "IT",
            "BR",
            "AR",
            "CL",
            "CO",
            "PE",
            "UY",
            "NL",
            "BE",
            "PT",
            "IE",
            "SE",
            "NO",
            "DK",
            "AU",
            "JP",
          ],
        },
        shipping_options,
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        payment_intent_data: {
          application_fee_amount: 0,
        },
      },
      {
        stripeAccount: process.env.STRIPE_CONNECTED_ACCOUNT_ID, // charge on connected account
      }
    );

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Connect Checkout error:", err);
    return res
      .status(err.statusCode || 500)
      .json({ error: err.message || "Failed to create checkout session" });
  }
}
