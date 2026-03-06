const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items } = JSON.parse(event.body);

    const line_items = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: 'Size: ' + item.size,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'p24', 'blik', 'klarna', 'revolut_pay'],
      line_items,
      mode: 'payment',
      success_url: 'https://joshuaatelier.com/#order-success',
      cancel_url: 'https://joshuaatelier.com/#cart',
      shipping_address_collection: {
        allowed_countries: [
          'PL',
          'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI',
          'NO', 'PT', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE',
          'LV', 'LT', 'LU', 'IE', 'GR', 'GB', 'CH',
          'US', 'CA', 'AU', 'JP', 'SG', 'AE', 'KR'
        ],
      },
      shipping_options: [
        // ── POLAND — InPost standard (free) ──────────────────────────────
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'InPost standard',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
            metadata: { countries: 'PL' },
          },
        },
        // ── POLAND — DHL standard (free) ─────────────────────────────────
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'DHL standard',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
            metadata: { countries: 'PL' },
          },
        },
        // ── POLAND — DHL express (paid) ───────────────────────────────────
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1500, currency: 'eur' },
            display_name: 'DHL express',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 1 },
            },
            metadata: { countries: 'PL' },
          },
        },
        // ── EU — DHL standard (free) ──────────────────────────────────────
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'DHL standard',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
            metadata: { countries: 'EU' },
          },
        },
        // ── EU — DHL express (paid) ───────────────────────────────────────
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 2000, currency: 'eur' },
            display_name: 'DHL express',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
            metadata: { countries: 'EU' },
          },
        },
        // ── INTERNATIONAL — DHL standard (paid) ──────────────────────────
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 2500, currency: 'eur' },
            display_name: 'DHL standard international',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
            metadata: { countries: 'INT' },
          },
        },
        // ── INTERNATIONAL — DHL express (paid) ───────────────────────────
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 4000, currency: 'eur' },
            display_name: 'DHL express international',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 4 },
            },
            metadata: { countries: 'INT' },
          },
        },
      ],
      automatic_tax: { enabled: false },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
