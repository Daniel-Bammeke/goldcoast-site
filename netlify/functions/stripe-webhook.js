const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function guestMessage(name, guests) {
  const firstName = name ? name.split(' ')[0] : 'there';
  if (guests === 1) return { greeting: `Hi ${firstName}`, listLine: `You're on the list!` };
  const others = guests - 1;
  return {
    greeting: `Hi ${firstName}`,
    listLine: `You and ${others} other${others > 1 ? 's' : ''} are on the list!`,
  };
}

function buildEmail(name, guests, email) {
  const { greeting, listLine } = guestMessage(name, guests);
  const total = (guests * 2.5).toFixed(2);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>You're on the list! 🎉</title>
</head>
<body style="margin:0;padding:0;background:#F5EDD8;font-family:'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Ghana flag stripe -->
          <tr>
            <td style="height:10px;background:linear-gradient(90deg,#B03A2E 33.33%,#C8931A 33.33%,#C8931A 66.66%,#2D6A4F 66.66%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background:#1A1208;padding:40px 40px 30px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:5px;color:#C8931A;text-transform:uppercase;">A Celebration of Ghanaian Culture</p>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:42px;font-weight:700;font-style:italic;color:#F0C040;line-height:1;">Gold Coast</h1>
              <p style="margin:10px 0 0;font-size:13px;letter-spacing:3px;color:rgba(255,255,255,0.4);text-transform:uppercase;">Food · Music · Games · Community</p>
            </td>
          </tr>

          <!-- Kente band -->
          <tr>
            <td style="height:8px;background:repeating-linear-gradient(90deg,#B03A2E 0,#B03A2E 50px,#C8931A 50px,#C8931A 100px,#2D6A4F 100px,#2D6A4F 150px,#1A1208 150px,#1A1208 200px);"></td>
          </tr>

          <!-- Confirmation hero -->
          <tr>
            <td style="background:#fff;padding:50px 40px 40px;text-align:center;">
              <div style="font-size:48px;margin-bottom:16px;">🎉</div>
              <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:32px;font-weight:700;color:#2D6A4F;">${listLine}</h2>
              <p style="margin:0;font-size:16px;color:#7A6245;">${greeting}, your spot${guests > 1 ? 's are' : ' is'} confirmed for Taste of Gold Coast.</p>
            </td>
          </tr>

          <!-- Event details -->
          <tr>
            <td style="background:#fff;padding:0 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(184,134,11,.2);">
                <tr>
                  <td style="background:#1A1208;padding:14px 20px;border-bottom:1px solid rgba(184,134,11,.15);">
                    <p style="margin:0;font-size:10px;letter-spacing:4px;color:#C8931A;text-transform:uppercase;">Event Details</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:18px 20px;border-bottom:1px solid #F0E8D0;">
                          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#C8931A;text-transform:uppercase;">Date</p>
                          <p style="margin:0;font-size:16px;font-weight:600;color:#1A1208;">Saturday, 27 June 2026</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:18px 20px;border-bottom:1px solid #F0E8D0;">
                          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#C8931A;text-transform:uppercase;">Time</p>
                          <p style="margin:0;font-size:16px;font-weight:600;color:#1A1208;">2:00 PM – 10:00 PM</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:18px 20px;border-bottom:1px solid #F0E8D0;">
                          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#C8931A;text-transform:uppercase;">Venue</p>
                          <p style="margin:0;font-size:16px;font-weight:600;color:#1A1208;">14 Delage Close</p>
                          <p style="margin:4px 0 0;font-size:14px;color:#7A6245;">Coventry · CV6 6JP</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:18px 20px;">
                          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#C8931A;text-transform:uppercase;">Guests</p>
                          <p style="margin:0;font-size:16px;font-weight:600;color:#1A1208;">${guests} person${guests > 1 ? 's' : ''}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Credit reminder -->
          <tr>
            <td style="background:#fff;padding:0 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF3D6;border:1px solid rgba(184,134,11,.3);border-left:4px solid #C8931A;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#1A1208;">🎟️ Your drink &amp; snack credit</p>
                    <p style="margin:0;font-size:13px;color:#7A6245;line-height:1.6;">
                      Your £${total} entry payment counts as <strong>£2.50 credit per person</strong> towards your first drink or snack on the day. Just tell our team your name when you arrive and we'll note it against your booking.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to expect -->
          <tr>
            <td style="background:#fff;padding:0 40px 50px;text-align:center;">
              <p style="margin:0 0 20px;font-size:14px;color:#7A6245;">We can't wait to celebrate with you. Expect amazing food, great music and good vibes all evening! 🌍</p>
              <p style="margin:0;font-size:13px;color:#9A7D52;">Questions? Reply to this email or contact us at<br>
              <a href="mailto:hello@tasteofgoldcoast.co.uk" style="color:#B8860B;">hello@tasteofgoldcoast.co.uk</a></p>
            </td>
          </tr>

          <!-- Kente band bottom -->
          <tr>
            <td style="height:8px;background:repeating-linear-gradient(90deg,#2D6A4F 0,#2D6A4F 50px,#C8931A 50px,#C8931A 100px,#B03A2E 100px,#B03A2E 150px,#F0C040 150px,#F0C040 200px);"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1A1208;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:16px;font-style:italic;color:#F0C040;">Taste of Gold Coast</p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">14 Delage Close, CV6 6JP · Coventry · 27 June 2026</p>
            </td>
          </tr>

          <!-- Ghana flag stripe bottom -->
          <tr>
            <td style="height:10px;background:linear-gradient(90deg,#2D6A4F 33.33%,#C8931A 33.33%,#C8931A 66.66%,#B03A2E 66.66%);"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

exports.handler = async (event) => {
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
    console.error('Webhook signature error:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    const email   = session.customer_email;
    const name    = session.metadata?.name    || 'Guest';
    const guests  = parseInt(session.metadata?.guests) || 1;

    if (email) {
      try {
        await resend.emails.send({
          from:    'Taste of Gold Coast <hello@tasteofgoldcoast.co.uk>',
          to:      email,
          subject: "You're on the list! 🎉 Taste of Gold Coast",
          html:    buildEmail(name, guests, email),
        });
        console.log(`Confirmation email sent to ${email}`);
      } catch (emailErr) {
        console.error('Resend error:', emailErr);
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
