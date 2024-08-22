import React, { createContext, useContext, useState } from "react";

// Create a context for the recommendations
const RecommendationContext = createContext();

export const useRecommendations = () => {
  return useContext(RecommendationContext);
};

export const RecommendationProvider = ({ children }) => {
  const [recommendations, setRecommendations] = useState({});
  const [selectedDomain, setSelectedDomain] = useState("");
  const [loading, setLoading] = useState({});
  const [showExplanation, setShowExplanation] = useState(true);
  const [showProductName, setShowProductName] = useState({});

  const value = {
    recommendations,
    setRecommendations,
    selectedDomain,
    setSelectedDomain,
    loading,
    setLoading,
    showExplanation,
    setShowExplanation,
    showProductName,
    setShowProductName,
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};
