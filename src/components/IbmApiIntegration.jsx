import React, { useState, useEffect } from "react";

const API_KEY = "GPMzQ8UP_DAO47tCMkEJbAjsqoX1R1lPIoXkyq21Dqdq";
const SCORING_URL = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/18fdc1c9-9ab7-4339-aab5-a4ff63105919/predictions?version=2021-05-01";

// Use CORS Anywhere proxy URL
const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

const IBMPredictionWithInput = () => {
  const [formData, setFormData] = useState({
    Gender: "",
    self_employed: "",
    family_history: "",
    Days_Indoors: "",
    Growing_Stress: "",
    Changes_Habits: "",
    Mental_Health_History: "",
    Mood_Swings: "",
    Coping_Struggles: "",
    Work_Interest: "",
    Social_Weakness: "",
  });

  const [token, setToken] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Automatically fetch the token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        setToken(data.access_token);
      } catch (err) {
        setError("Error fetching token: " + err.message);
      }
    };

    fetchToken();
  }, []);

  // Update form data based on user input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Make prediction API call through CORS Anywhere proxy
  const handlePredict = async () => {
    if (!token) {
      setError("Token is missing. Please try again later.");
      return;
    }

    const payload = {
      input_data: [
        {
          fields: [
            "Gender",
            "self_employed",
            "family_history",
            "Days_Indoors",
            "Growing_Stress",
            "Changes_Habits",
            "Mental_Health_History",
            "Mood_Swings",
            "Coping_Struggles",
            "Work_Interest",
            "Social_Weakness",
          ],
          values: [[
            formData.Gender,
            formData.self_employed,
            formData.family_history,
            formData.Days_Indoors,
            formData.Growing_Stress,
            formData.Changes_Habits,
            formData.Mental_Health_History,
            formData.Mood_Swings,
            formData.Coping_Struggles,
            formData.Work_Interest,
            formData.Social_Weakness,
          ]],
        },
      ],
    };

    try {
      const response = await fetch(PROXY_URL + SCORING_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Use the correct token here
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Prediction API call failed");
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError("Error making prediction: " + err.message);
    }
  };

  return (
    <div>
      <h1>IBM ML Prediction</h1>

      <div>
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label>
              {field}:
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
              />
            </label>
          </div>
        ))}
      </div>

      <button onClick={handlePredict} disabled={!token}>
        Predict
      </button>

      {response && (
        <div>
          <h3>Prediction Result:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default IBMPredictionWithInput;
