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

const RecommendationDashboard3 = ({
  tweets,
  selectedBooks,
  selectedMovies,
  beauty,
  fashion,
  phones,
  username,
}) => {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [recommendationType, setRecommendationType] = useState('in-domain'); // New state for recommendation type
  const [showExplanation, setShowExplanation] = useState(false);
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

  const fetchRecommendations = async (domain, type) => {
    const selection = {
      Movies_and_TV: selectedMovies,
      Books: selectedBooks,
      All_Beauty: beauty,
      Amazon_Fashion: fashion,
      Cell_Phones_and_Accessories: phones,
    };

    try {
      const apiEndpoint =
        type === 'in-domain'
          ? "http://127.0.0.1:5000/getRecomByDomainIndomain"
          : "http://127.0.0.1:5000/getRecomByDomainCrossdomain";

      const response = await axios.post(apiEndpoint, {
        selection: {
          [domain]: selection[domain] || [], // Include only the selected domain with its data
        },
        personality: "Based on the provided Twitter posts, the user appears",
      });
      console.log("Recommended data:", response.data);
      return response.data;
    } catch (err) {
      console.error(`Error fetching recommendations for ${domain} (${type}):`, err);
      setError(`Error fetching recommendations for ${domain} (${type})`);
      return null;
    }
  };

  const handleRecommendation = async () => {
    if (
      tweets.length === 0 &&
      selectedBooks.length === 0 &&
      selectedMovies.length === 0
    ) {
      setError(
        "Please select at least one book, movie, or tweet for recommendations."
      );
      return;
    }

    if (!selectedDomain) {
      setError("Please select a domain.");
      return;
    }

    setLoading(true);
    setError(null);

    const data = await fetchRecommendations(selectedDomain, recommendationType);

    if (data) {
      // Parse the JSON strings into objects
      const inDomainData = data["in-domain"] ? data["in-domain"][selectedDomain] || {} : {};
      const crossDomainData = data["cross-domain"] ? data["cross-domain"][selectedDomain] || {} : {};
      setRecommendations({
        [selectedDomain]: {
          top_5: parseJsonString(
            recommendationType === 'in-domain' ? inDomainData.top_5 || '{}' : crossDomainData.top_5 || '{}'
          ),
          top_best: parseJsonString(
            recommendationType === 'in-domain' ? inDomainData.top_best || '{}' : crossDomainData.top_best || '{}'
          ),
        },
      });
    } else {
      setRecommendations({});
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRecommendation();
  };

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };

  const handleRecommendationTypeChange = (event) => {
    setRecommendationType(event.target.value);
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

      <label htmlFor="type-select" className="block text-lg font-semibold mt-4 mb-2">
        Select Recommendation Type
      </label>
      <select
        id="type-select"
        value={recommendationType}
        onChange={handleRecommendationTypeChange}
        className="border p-2 rounded"
      >
        <option value="in-domain">In-Domain</option>
        <option value="cross-domain">Cross-Domain</option>
      </select>

      <div className="container mx-auto p-4">
        <form onSubmit={handleSubmit} className="mb-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Explore Personalize Recommendations
          </button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>

      {selectedDomain && recommendations[selectedDomain] && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recommendations for {domainNameMapping[selectedDomain]}</h2>
          {recommendations[selectedDomain].top_5 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Top 5 Recommendations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.values(recommendations[selectedDomain].top_5).map((rec, index) => (
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
          {recommendations[selectedDomain].top_best && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Top Best Recommendation</h3>
              <div className="border p-4 rounded flex items-center">
                <img
                  src={recommendations[selectedDomain].top_best["product 1"]["image link"] || placeholderImage}
                  alt={recommendations[selectedDomain].top_best["product 1"]["product name"]}
                  className="w-80 h-70 object-cover mr-4"
                />
                <div className="flex-1">
                  <p className="font-semibold text-justify text-blue-700">
                    {recommendations[selectedDomain].top_best["product 1"]["product name"]}
                  </p>
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-2"
                    onClick={handleExplanationToggle}
                  >
                    {showExplanation ? "Hide Explanation" : "Show Explanation"}
                  </button>
                  {showExplanation && (
                    <p className="font-light text-justify">
                      <span className="font-semibold">Explanation:</span> {recommendations[selectedDomain].top_best["product 1"].reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {recommendations[selectedDomain].top_best && (
            <Ratingplot bookTitle={"Watercolor with Me in the Jungle"} domain={selectedDomain}/>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationDashboard3;
