// netlify/functions/amazon-proxy.js

const fetch = require("node-fetch"); // needed for Netlify functions

exports.handler = async (event) => {
  const query = event.queryStringParameters.q || "";

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'q' query parameter." }),
    };
  }

  // Amazon suggestion API (undocumented, but works for testing)
  const url = `https://completion.amazon.com/search/complete?method=completion&search-alias=aps&mkt=1&q=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(url);
  const text = await response.text();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // You can restrict to your site later
      "Content-Type": "application/json",
    },
    body: text, // Amazon returns a JSONP-style string
  };
};
