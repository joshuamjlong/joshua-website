const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const SHIPPING_LABELS = {
  inpost_address:   { name: 'InPost — to address',    estimate: '1–2 business days' },
  inpost_paczkomat: { name: 'InPost — Paczkomat',     estimate: 'Next business day' },
  dhl_address:      { name: 'DHL — to address',       estimate: '1–2 business days' },
  dhl_dropoff:      { name: 'DHL — drop-off point',   estimate: '1–2 business days' },
  eu_standard:      { name: 'Standard shipping',      estimate: '2–5 business days' },
  eu_express:       { name: 'Express shipping',        estimate: '1–2 business days' },
  intl_standard:    { name: 'Standard international', estimate: '5–10 business days' },
};

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    try {
      // ── Retrieve full session with line items ──
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      const customerDetails = session.customer_details || {};
      const shippingDetails = session.shipping_details || {};
      const address = shippingDetails.address || customerDetails.address || {};
      const shippingMethodId = session.metadata && session.metadata.shipping_method;
      const shippingInfo = SHIPPING_LABELS[shippingMethodId] || { name: 'Standard shipping', estimate: '2–5 business days' };
      const pendingOrderId = session.metadata && session.metadata.pending_order_id;

      // ── Upsert customer ──
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .upsert(
          {
            email: customerDetails.email,
            name: customerDetails.name || shippingDetails.name,
            country: address.country,
          },
          { onConflict: 'email' }
        )
        .select()
        .single();

      if (customerError) throw customerError;

      // ── Update pending order or insert new one ──
      let order;
      if (pendingOrderId) {
        const { data: updatedOrder, error: updateError } = await supabase
          .from('orders')
          .update({
            stripe_payment_id: session.payment_intent,
            status: 'paid',
          })
          .eq('id', pendingOrderId)
          .select()
          .single();
        if (updateError) throw updateError;
        order = updatedOrder;
      } else {
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_id: customer.id,
            stripe_payment_id: session.payment_intent,
            total: session.amount_total / 100,
            currency: session.currency.toUpperCase(),
            status: 'paid',
            shipping_name: shippingDetails.name || customerDetails.name,
            shipping_address: address.line1 + (address.line2 ? ', ' + address.line2 : ''),
            shipping_city: address.city,
            shipping_country: address.country,
            shipping_postal_code: address.postal_code,
            shipping_method: shippingMethodId,
          })
          .select()
          .single();
        if (orderError) throw orderError;
        order = newOrder;

        const orderItems = fullSession.line_items.data.map(item => {
          const sizeMatch = item.description && item.description.match(/Size:\s*(\S+)/);
          const size = sizeMatch ? sizeMatch[1] : null;
          return {
            order_id: order.id,
            product_name: item.description
              ? item.description.replace(/,?\s*Size:\s*\S+/, '').trim()
              : item.price.product,
            size: size,
            quantity: item.quantity,
            price: item.amount_total / 100 / item.quantity,
          };
        });

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        if (itemsError) throw itemsError;
      }

      console.log('Order saved to Supabase:', order.id);

      // ── Build and send confirmation email via Resend ──
      const customerName = customerDetails.name || shippingDetails.name || '';
      const firstName = customerName.split(' ')[0];
      const total = (session.amount_total / 100).toFixed(0);

      const itemsHtml = fullSession.line_items.data.map(item => {
        const sizeMatch = item.description && item.description.match(/Size:\s*(\S+)/);
        const size = sizeMatch ? sizeMatch[1] : null;
        const name = item.description
          ? item.description.replace(/,?\s*Size:\s*\S+/, '').trim()
          : 'Item';
        const price = (item.amount_total / 100).toFixed(0);
        return `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e6; font-size: 13px; color: #444; letter-spacing: 0.02em;">
              ${name}${size ? ' &mdash; Size ' + size : ''}${item.quantity > 1 ? ' &times; ' + item.quantity : ''}
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e6; font-size: 13px; color: #444; text-align: right; white-space: nowrap;">
              &euro;${price}
            </td>
          </tr>
        `;
      }).join('');

      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Joshua Atelier order is confirmed</title>
</head>
<body style="margin: 0; padding: 0; background: #f8f8f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f8f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 48px 32px; border-bottom: 1px solid #e8e8e6; text-align: center; background: #ffffff;">
              <img src="https://joshuaatelier.com/images/Joshua-logo-black.png" alt="Joshua" style="height: 28px; width: auto; display: block; margin: 0 auto 12px;" />
              <div style="font-size: 12px; letter-spacing: 0.08em; color: #999; font-style: italic;">she dressed with no one in mind</div>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 36px 48px 28px;">
              <p style="font-size: 13px; letter-spacing: 0.02em; color: #444; line-height: 1.9; margin: 0;">
                Thank you for your order${firstName ? ', ' + firstName : ''}. We are preparing it with care and will dispatch it shortly.
              </p>
            </td>
          </tr>

          <!-- Order summary -->
          <tr>
            <td style="padding: 0 48px 28px;">
              <div style="font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: #999; margin-bottom: 16px;">Your order</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
                <tr>
                  <td style="padding: 16px 0 4px; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #999;">Shipping</td>
                  <td style="padding: 16px 0 4px; font-size: 12px; color: #444; text-align: right;">${shippingInfo.name}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 11px; color: #999; letter-spacing: 0.02em;">Estimated delivery</td>
                  <td style="padding: 4px 0; font-size: 11px; color: #999; text-align: right;">${shippingInfo.estimate}</td>
                </tr>
                <tr>
                  <td style="padding: 20px 0 4px; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #0a0a0a; border-top: 1px solid #e8e8e6;">Total</td>
                  <td style="padding: 20px 0 4px; font-size: 16px; color: #0a0a0a; text-align: right; border-top: 1px solid #e8e8e6;">&euro;${total}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping address -->
          <tr>
            <td style="padding: 0 48px 36px;">
              <div style="font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: #999; margin-bottom: 12px;">Delivering to</div>
              <div style="font-size: 13px; letter-spacing: 0.02em; color: #444; line-height: 1.9;">
                ${shippingDetails.name || customerDetails.name || ''}<br/>
                ${address.line1 || ''}${address.line2 ? ', ' + address.line2 : ''}<br/>
                ${address.city || ''}, ${address.postal_code || ''}<br/>
                ${address.country || ''}
              </div>
            </td>
          </tr>

          <!-- Tracking placeholder -->
          <tr>
            <td style="padding: 0 48px 28px;">
              <div style="font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: #999; margin-bottom: 16px;">Track your order</div>
              <p style="font-size: 13px; letter-spacing: 0.02em; color: #444; line-height: 1.9; margin: 0 0 16px;">
                Once your order has been dispatched, you will receive a separate email with your tracking number and a link to follow your delivery.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 1px; background: #e8e8e6;"></div>
            </td>
          </tr>

          <!-- Care instructions -->
          <tr>
            <td style="padding: 36px 48px;">
              <div style="font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: #999; margin-bottom: 16px;">Caring for your pieces</div>
              <p style="font-size: 13px; letter-spacing: 0.02em; color: #444; line-height: 1.9; margin: 0 0 16px;">
                Our garments are built to last. The fabrics are resilient and easy to care for. A gentle handwash in cold water with mild detergent is all they need. Lie flat to dry. Avoid tumble drying and direct heat, which can affect the hardware and elastane over time. The nickel-free zinc alloy hardware is durable but benefits from being kept dry when not in use.
              </p>
              <p style="font-size: 13px; letter-spacing: 0.02em; color: #444; line-height: 1.9; margin: 0;">
                In many of our styles, labels are attached to the outer seam for easy removal if you choose. This is intentional, part of keeping the silhouette clean and minimal.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 1px; background: #e8e8e6;"></div>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding: 32px 48px;">
              <p style="font-size: 12px; letter-spacing: 0.02em; color: #999; line-height: 1.9; margin: 0;">
                If you have any questions about your order, contact us at <a href="mailto:support@joshuaatelier.com" style="color: #444; text-decoration: none;">support@joshuaatelier.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 48px 40px; border-top: 1px solid #e8e8e6; text-align: center;">
              <div style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #999;">&copy; Joshua Apparel sp. z o.o.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Joshua Atelier <contact@joshuaatelier.com>',
          to: customerDetails.email,
          subject: 'Your Joshua Atelier order is confirmed',
          html: emailHtml,
        }),
      });

      console.log('Confirmation email sent to:', customerDetails.email);

    } catch (err) {
      console.error('Error in webhook handler:', err.message);
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
