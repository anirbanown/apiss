const axios = require('axios');

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Log incoming request details
  console.log('Incoming Request Body:', JSON.stringify(req.body, null, 2));

  try {
    // Extract token and payload from the request body
    const { token, payload } = req.body || {};

    // Check if token and payload are present
    if (!token) {
      console.error('Missing token');
      return res.status(400).json({ 
        message: 'Missing authentication token',
        details: 'Token is required to make the prediction request'
      });
    }

    if (!payload) {
      console.error('Missing payload');
      return res.status(400).json({ 
        message: 'Missing prediction payload',
        details: 'Payload is required to make the prediction request'
      });
    }

    // IBM Cloud API endpoint
    const SCORING_URL = 'https://us-south.ml.cloud.ibm.com/ml/v4/deployments/18fdc1c9-9ab7-4339-aab5-a4ff63105919/predictions?version=2021-05-01';

    // Log outgoing request details
    console.log('Outgoing API Request:', {
      url: SCORING_URL,
      payload: JSON.stringify(payload),
      tokenLength: token.length
    });

    // Forward request to IBM Cloud API
    const response = await axios.post(SCORING_URL, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10-second timeout
    });

    // Log successful response
    console.log('IBM API Response:', JSON.stringify(response.data, null, 2));

    // Return the response from IBM Cloud
    res.status(200).json(response.data);

  } catch (error) {
    // Log the complete error object
    console.error('Complete Error Object:', error);

    if (error.response) {
      // Error from the IBM API
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Headers:', error.response.headers);

      // If IBM API returns non-JSON content (like HTML), handle it gracefully
      if (error.response.headers['content-type'] && error.response.headers['content-type'].includes('text/html')) {
        return res.status(error.response.status).send(`HTML error from IBM API: ${error.response.data}`);
      }

      return res.status(error.response.status).json({
        message: 'Error from IBM API',
        status: error.response.status,
        details: error.response.data
      });

    } else if (error.request) {
      // No response received from IBM API
      console.error('No response received from IBM API');
      console.error('Request Details:', error.request);
      return res.status(500).json({
        message: 'No response received from IBM API',
      });

    } else {
      // Error in setting up the request
      console.error('Request Setup Error:', error.message);
      return res.status(500).json({
        message: 'Error processing the request',
        details: error.message,
      });
    }
  }
}