import React, { useState, useEffect } from "react";
import DetailsDisplay from "./DetailsDisplay";

const Sidebar = ({ selectedItem, detailedItems }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [details1, setDetails1] = useState({});
  const details = detailedItems[selectedItem] || [];

  useEffect(() => {
    if (selectedProduct) {
      // Handle JSON parsing
      if (typeof selectedProduct.details === 'string') {
        try {
          // Sanitize JSON string if needed
          const sanitizedDetails = selectedProduct.details.replace(/'/g, '"');
          const parsedDetails = JSON.parse(sanitizedDetails);
          setDetails1(parsedDetails);
        } catch (e) {
          console.error('Failed to parse details:', e);
          setDetails1({});
        }
      } else {
        // If already an object, set it directly
        setDetails1(selectedProduct.details || {});
      }
    }
  }, [selectedProduct]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBackClick = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md w-full h-100">
      {selectedProduct ? (
        <div className="pl-5">
          <button
            onClick={handleBackClick}
            className="text-blue-500 text-justify hover:underline mb-4"
          >
            Back
          </button>
          <h2 className="text-xl text-justify font-bold mb-2">
            {selectedProduct.name}
          </h2>
          {selectedProduct.image_url && (
            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="w-full h-40 mb-4 rounded object-cover"
            />
          )}
          <DetailsDisplay details={details1} />
        </div>
      ) : (
        <div className="text-justify">
          <h2 className="text-xl p-4 font-bold mb-2">{selectedItem}</h2>
          {details.length === 0 ? (
            <p className="text-gray-500">No details available</p>
          ) : (
            <ol className="list-decimal pl-5 text-left">
              {details.map((detail, index) => (
                <li key={index} className="mb-2">
                  <button
                    onClick={() => handleProductClick(detail)}
                    className="text-blue-500 text-justify hover:underline"
                  >
                    {detail.name}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
