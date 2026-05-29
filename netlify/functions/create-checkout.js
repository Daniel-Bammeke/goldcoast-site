const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { guests, name, email, phone, dietary } = JSON.parse(event.body);

    const quantity = parseInt(guests);
    if (!quantity || quantity < 1 || quantity > 10) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid guest count' }) };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: 'price_1TcFf3H8Px2qQEBJgcwSkUgA', quantity }],
      customer_email: email || undefined,
      metadata: { name, phone, dietary, guests: String(quantity) },
      success_url: 'https://www.tasteofgoldcoast.co.uk/?success=true',
      cancel_url:  'https://www.tasteofgoldcoast.co.uk/?cancelled=true',
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
