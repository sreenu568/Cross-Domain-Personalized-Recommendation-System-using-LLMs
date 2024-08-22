import React from 'react';

const DetailsDisplay = ({ details }) => {
  // Check if 'details' is a proper object
  if (typeof details !== 'object' || details === null) {
    return <p className="text-gray-600">Invalid details data</p>;
  }

  const entries = Object.entries(details);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h2>
      <div className="space-y-2">
        {entries.length > 0 ? (
          entries.map(([key, value]) => (
            <div key={key} className="flex items-start">
              <span className="font-medium text-gray-700 mr-2">{key}:</span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No details available</p>
        )}
      </div>
    </div>
  );
};

export default DetailsDisplay;
