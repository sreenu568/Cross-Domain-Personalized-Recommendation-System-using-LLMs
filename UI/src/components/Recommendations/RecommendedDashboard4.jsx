// This code is for just passing the recommendation data from another component and displaying dashboard without using any API



import axios from "axios";
import "tailwindcss/tailwind.css";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Ratingplot from "./Ratingplot";

// Placeholder image URL
const placeholderImage = "https://via.placeholder.com/150";

const domainNameMapping = {
  "Movies_and_TV": "Movies and TV",
  "Books": "Books",
  "All_Beauty": "Beauty",
  "Amazon_Fashion": "Fashion",
  "Cell_Phones_and_Accessories": "Phones",
};

const RecommendationDashboard4 = ({
  recommendedProducts,
}) => {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [showExplanation, setShowExplanation] = useState(true);
  const [showProductName, setShowProductName] = useState({}); // Object to store visibility state for each product

  useEffect(() => {
    loadCsvData("/finalmetabooks.csv"); // Replace with your CSV file path
  }, []);

  const loadCsvData = (filePath) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: (results) => {
        console.log("CSV Data:", results.data); // Debugging: Log CSV Data
        setCsvData(results.data);
      },
      error: (error) => {
        console.error("Error loading CSV data:", error);
      },
    });
  };

  const parseJsonString = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      return {};
    }
  };

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };

  const handleExplanationToggle = () => {
    setShowExplanation(!showExplanation);
  };

  const handleProductDoubleClick = (productName) => {
    setShowProductName((prevState) => ({
      ...prevState,
      [productName]: !prevState[productName]
    }));
  };
  
  return (
    <div className="mt-8">
      <label htmlFor="domain-select" className="block text-lg font-semibold mb-2">
        Pick a Category to Personalize
      </label>
      <select
        id="domain-select"
        value={selectedDomain}
        onChange={handleDomainChange}
        className="border p-2 rounded"
      >
        <option value="">-- Select a Domain --</option>
        {Object.keys(domainNameMapping).map((domain) => (
          <option key={domain} value={domain}>
            {domainNameMapping[domain]}
          </option>
        ))}
      </select>

      {selectedDomain && recommendedProducts[selectedDomain] && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recommendations for {domainNameMapping[selectedDomain]}</h2>
          {recommendedProducts[selectedDomain].top_5 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Top 5 Recommendations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.values(recommendedProducts[selectedDomain].top_5).map((rec, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded flex flex-col items-center"
                    onDoubleClick={() => handleProductDoubleClick(rec["product name"])}
                  >
                    <img
                      src={rec["image link"] || placeholderImage}
                      alt={rec["product name"]}
                      className="w-full h-48 object-cover mb-2"
                    />
                    {showProductName[rec["product name"]] && (
                      <p className="font-semibold text-justify text-blue-700">{rec["product name"]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {recommendedProducts[selectedDomain].top_best && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Top Best Recommendation</h3>
              <div className="border p-4 rounded flex items-center">
                <img
                  src={recommendedProducts[selectedDomain].top_best["product 1"]["image link"] || placeholderImage}
                  alt={recommendedProducts[selectedDomain].top_best["product 1"]["product name"]}
                  className="w-80 h-70 object-cover mr-4"
                />
                <div className="flex-1">
                  <p className="font-semibold text-justify text-blue-700">
                    {recommendedProducts[selectedDomain].top_best["product 1"]["product name"]}
                  </p>
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-2"
                    onClick={handleExplanationToggle}
                  >
                    {showExplanation ? "Hide Explanation" : "Show Explanation"}
                  </button>
                  {showExplanation && (
                    <p className="font-light text-justify">
                      <span className="font-semibold">Explanation:</span> {recommendedProducts[selectedDomain].top_best["product 1"].reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {recommendedProducts[selectedDomain].top_best && (
            <Ratingplot bookTitle={"Watercolor with Me in the Jungle"} domain={selectedDomain}/>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationDashboard4;
