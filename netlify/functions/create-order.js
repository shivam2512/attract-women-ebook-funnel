const Razorpay = require('razorpay');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, currency, receipt } = JSON.parse(event.body);

    if (!amount || amount < 100) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount. Minimum amount is 100 paise.' }),
      };
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      }),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Check if it's an authentication error
    if (error.statusCode === 401) {
       return {
         statusCode: 401,
         body: JSON.stringify({ error: 'Razorpay authentication failed. Check your API keys.' }),
       };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create order.' }),
    };
  }
};
