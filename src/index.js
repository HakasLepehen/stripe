const Stripe = require("stripe");

const STRIPE_API_KEY = 'sk_test_4eC39HqLyjWDarjtT1zdp7dc';

const plans = {
  'start': {
    price: 12500,
    description: ''
  },
  'essential': {
    price: 23000,
    description: ''
  },
  'pro': {
    price: 58500,
    description: ''
  },
  'enterprise': {
    price: 4230,
    description: ''
  }
}

const stripe = Stripe(STRIPE_API_KEY, {
  // Cloudflare Workers use the Fetch API for their API requests.
  httpClient: Stripe.createFetchHttpClient()
});

// {
//   "email": "doctorrosen2016@gmail.com",
//   "name": "Petrov Pavel",
//   "plan": "basic",
//   "referrer": "alexey_dolgikh",
//   "url": "https://www.youtube.com/watch?v=YRL77Xp3FbM",
//   "websiteType": "store"
// }

const checkPlan = (plan) => {
      return plans[plan].price;
}

async function handleRequest(request) {
  let body;
  try {
    body = await request.json();  
  } catch (error) {
    return new Response(`new Error ${error}`, {
      status: 200,
      headers: {
        'content-type': 'text/plain',
        'Access-Control-Allow-Origin': "*",
        "Access-Control-Allow-Headers": "*"
      }
    })
  }
  

  // const cost = request.body.plan;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Subscribe to Eglote Pro Annual',
          },
          unit_amount: checkPlan(body.plan),
          // unit_amount: checkPlan(body.plan),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://eglote.com/basic',
    cancel_url: 'https://eglote.com/pro',
  });
  return new Response(session.url.toString(), {
    status: 200,
    headers: {
      'content-type': 'text/plain',
      'Access-Control-Allow-Origin': "*",
      "Access-Control-Allow-Headers": "*"
    }
  });
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});