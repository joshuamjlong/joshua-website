const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items, shipping, customerEmail, pendingOrderId } = JSON.parse(event.body);

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

    // Add shipping as a line item if paid
    if (shipping && shipping.price > 0) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: shipping.label,
          },
          unit_amount: Math.round(shipping.price * 100),
        },
        quantity: 1,
      });
    }

    const sessionParams = {
      payment_method_types: ['card', 'p24', 'blik', 'klarna', 'revolut_pay'],
      line_items,
      mode: 'payment',
      success_url: 'https://joshuaatelier.com/#order-success',
      cancel_url: 'https://joshuaatelier.com/checkout.html',
      automatic_tax: { enabled: false },
      metadata: {
        pending_order_id: pendingOrderId || '',
        shipping_method: shipping ? shipping.id : 'eu_standard',
      },
    };

    // Pre-fill customer email if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

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
