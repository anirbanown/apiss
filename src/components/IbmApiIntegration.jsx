import React, { useState } from "react";

const API_KEY = "GPMzQ8UP_DAO47tCMkEJbAjsqoX1R1lPIoXkyq21Dqdq";
const SCORING_URL = "https://private.us-south.ml.cloud.ibm.com/ml/v4/deployments/18fdc1c9-9ab7-4339-aab5-a4ff63105919/predictions?version=2021-05-01";

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

  // Update form data based on user input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch API token
  const getToken = () => {
    const req = new XMLHttpRequest();
    req.open("POST", "https://iam.cloud.ibm.com/identity/token");
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Accept", "application/json");
    req.onload = () => {
      try {
        const data = JSON.parse(req.responseText);
        setToken(data.access_token);
      } catch (ex) {
        setError("Error parsing token response");
      }
    };
    req.onerror = () => setError("Error fetching token");
    req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);  };

  // Make prediction API call
  const handlePredict = () => {
    if (!token) {
      setError("Token is missing. Please fetch the token first.");
      return;
    }

    const payload = JSON.stringify({
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
    });

    const oReq = new XMLHttpRequest();
    oReq.open("POST", SCORING_URL);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Authorization", `Bearer ${token}`);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.onload = () => {
      try {
        const data = JSON.parse(oReq.responseText);
        setResponse(data);
      } catch (ex) {
        setError("Error parsing scoring response");
      }
    };
    oReq.onerror = () => setError("Error in API call");
    oReq.send(payload);
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

      <button onClick={getToken}>Get Token</button>
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
