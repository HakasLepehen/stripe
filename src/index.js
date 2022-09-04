const Stripe = require("stripe");

const STRIPE_API_KEY = 'sk_test_4eC39HqLyjWDarjtT1zdp7dc';

const plans = {
  'start': 125,
  'essential': 230,
  'pro': 585,
  'enterprise': 423
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
  for (const key in plans) {
    if (key == plan) {
      return plans[key];
    }
  }
}

async function handleRequest(request) {

  const cost = request.body.plan;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 300,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://eglote.com/basic',
    cancel_url: 'https://eglote.com/pro',
  });
  const json = JSON.stringify(request.body, null, 2);
  // return Response.redirect(session.url, 303);
  return Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
  });
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// /**
//  * readRequestBody reads in the incoming request body
//  * Use await readRequestBody(..) in an async function to get the string
//  * @param {Request} request the incoming request to read from
//  */

// async function readRequestBody(request) {
//   const { headers } = request;
//   const contentType = headers.get('content-type') || '';

//   if (contentType.includes('application/json')) {
//     return JSON.stringify(await request.json());
//   }
// }



// async function handleRequest(request) {
//   const reqBody = await readRequestBody(request);
//   const retBody = `The request body sent in was ${reqBody}`;
//   return new Response(retBody);

// }



// addEventListener('fetch', event => {
//   const { request } = event;
//   if (request.method === 'POST') {
//     return event.respondWith(handleRequest(request));
//   }
// });
