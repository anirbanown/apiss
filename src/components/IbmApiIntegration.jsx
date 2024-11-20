import React, { useState, useEffect, useCallback } from "react";
import { Waves, Heart, Sun, AlertTriangle } from "lucide-react";

// Configuration Constants
const CONFIG = {
  API_KEY: "GPMzQ8UP_DAO47tCMkEJbAjsqoX1R1lPIoXkyq21Dqdq",
  TOKEN_URL: "https://iam.cloud.ibm.com/identity/token",
  SCORING_URL: "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/18fdc1c9-9ab7-4339-aab5-a4ff63105919/predictions?version=2021-05-01"
};

// Utility Functions
const logger = {
  log: (message, data) => {
    console.log(`[MentalHealth Logger] ${message}`, data || '');
  },
  error: (message, error) => {
    console.error(`[MentalHealth Error] ${message}`, error || '');
  }
};

const IBMPredictionWithInput = () => {
  // State Management
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
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Token Fetching with Enhanced Error Handling
  const fetchToken = useCallback(async () => {
    setIsLoading(true);
    try {
      logger.log('Initiating token fetch');

      const response = await fetch(CONFIG.TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
        body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${CONFIG.API_KEY}`,
      });

      logger.log('Token Response Status', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token fetch failed: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.access_token) {
        throw new Error('No access token in response');
      }

      logger.log('Token fetched successfully', { 
        tokenLength: data.access_token.length 
      });

      setToken(data.access_token);
      setError(null);
    } catch (err) {
      logger.error('Token Fetch Error', err);
      setError(`Authentication failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Token Fetch
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Prediction Handler with Comprehensive Error Management
  const handlePredict = async () => {
    // Validation Checks
    if (!token) {
      setError("Authentication token is missing. Please refresh.");
      return;
    }

    const isAllFieldsFilled = Object.values(formData).every(value => value !== "");
    if (!isAllFieldsFilled) {
      setError("Please fill in all fields before predicting.");
      return;
    }

    // Prepare Payload
    const payload = {
      input_data: [{
        fields: Object.keys(formData),
        values: [Object.values(formData)]
      }]
    };

    setIsLoading(true);
    setError(null);

    try {
      logger.log('Prediction Request Payload', payload);

      const response = await fetch('/api/ibm-predict', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token,
          payload 
        }),
      });

      logger.log('Prediction Response Status', response.status);

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Prediction API call failed");
      }

      const data = await response.json();
      logger.log('Prediction Response Data', data);

      const predictionValue = data.predictions[0].values[0][0];
      setPredictionResult(predictionValue);
    } catch (err) {
      logger.error('Prediction Error', err);
      setError(`Prediction failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Radio Group Component with Enhanced Accessibility
  const RadioGroup = ({ 
    name, 
    options, 
    selectedValue, 
    onChange,
    label 
  }) => (
    <div className="p-4 bg-gray-900 rounded-xl">
      <label 
        className="block text-blue-400 font-semibold mb-4 text-lg uppercase" 
        htmlFor={name}
      >
        {label || name.replace(/_/g, " ")}
      </label>
      <div className="flex items-center space-x-6">
        {options.map((option) => (
          <label 
            key={option} 
            className={`
              text-gray-300 text-lg flex items-center cursor-pointer
              transition-all duration-300 ease-in-out
              hover:text-blue-300 
              ${selectedValue === option ? 'scale-105' : ''}
            `}
          >
            <input
              id={`${name}-${option}`}
              type="radio"
              name={name}
              value={option}
              checked={selectedValue === option}
              onChange={onChange}
              className="form-radio text-blue-500 w-6 h-6 mr-2 
                         focus:ring-2 focus:ring-blue-500 
                         transition-all duration-300"
              aria-label={`${name} ${option}`}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  // Error Display Component
  const ErrorDisplay = ({ message }) => (
    <div className="mt-4 p-4 bg-red-700 text-red-200 rounded-md flex items-center">
      <AlertTriangle className="mr-3 text-red-300" />
      <span>{message}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-4">
            <Heart className="text-blue-400" />
            Mental Health Prediction
            <Waves className="text-blue-400" />
          </h1>

          {error && <ErrorDisplay message={error} />}

          <div className="grid grid-cols-2 gap-6">
            <RadioGroup 
              name="Gender"
              options={["Male", "Female"]}
              selectedValue={formData.Gender}
              onChange={handleInputChange}
            />

            <RadioGroup 
              name="Days_Indoors"
              options={["1-14 days", "Go out every day"]}
              selectedValue={formData.Days_Indoors}
              onChange={handleInputChange}
            />

            <RadioGroup 
              name="Mood_Swings"
              options={["Low", "Medium", "High"]}
              selectedValue={formData.Mood_Swings}
              onChange={handleInputChange}
            />

            {[
              "self_employed", 
              "family_history", 
              "Growing_Stress", 
              "Changes_Habits", 
              "Mental_Health_History", 
              "Coping_Struggles", 
              "Work_Interest", 
              "Social_Weakness"
            ].map((field) => (
              <RadioGroup 
                key={field}
                name={field}
                options={["Yes", "No"]}
                selectedValue={formData[field]}
                onChange={handleInputChange}
              />
            ))}
          </div>

          <button
            onClick={handlePredict}
            disabled={!token || isLoading}
            className={`
              w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold 
              transition duration-300 hover:bg-blue-700 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              disabled:cursor-not-allowed disabled:opacity-50
              ${isLoading ? 'animate-pulse' : ''}
            `}
          >
            {isLoading ? 'Processing...' : 'Predict Mental Health Status'}
          </button>

          {predictionResult && (
            <div className={`
              mt-6 p-6 rounded-xl text-center text-lg font-semibold 
              ${predictionResult === "Yes" 
                ? "bg-red-600 text-red-100" 
                : "bg-green-600 text-green-100"}
            `}>
              <Sun className="mx-auto mb-4" size={48} />
              {predictionResult === "Yes" 
                ? "Yes, Mental Health Checkup is Required" 
                : "No, You're Doing Well, Checkup Not Required"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IBMPredictionWithInput;