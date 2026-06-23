const crypto = require('crypto');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required payment fields.' }),
      };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'success', message: 'Payment verified successfully.' }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid signature. Payment verification failed.' }),
      };
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to verify payment.' }),
    };
  }
};
