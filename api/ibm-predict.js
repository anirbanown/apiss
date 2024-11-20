const axios = require('axios');

export default async function handler(req, res) {
  const { token, payload } = req.body;

  const SCORING_URL = 'https://us-south.ml.cloud.ibm.com/ml/v4/deployments/18fdc1c9-9ab7-4339-aab5-a4ff63105919/predictions?version=2021-05-01';

  try {
    const response = await axios.post(SCORING_URL, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}