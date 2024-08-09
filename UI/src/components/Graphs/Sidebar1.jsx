import React from 'react';

const MAX_REVIEWS_DISPLAY = 2; // Maximum number of reviews to display

const Sidebar1 = ({ hoveredData }) => {
  if (!hoveredData) {
    return <div className="bg-gray-200 p-4 rounded-md shadow-md">Hover over a chart to see details here.</div>;
  }

  // Prepare the reviews to display
  const reviewsToShow = hoveredData.reviews
    ? hoveredData.reviews.slice(0, MAX_REVIEWS_DISPLAY)
    : [];

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      {/*<h3 className="text-lg font-bold mb-2">Hovered Data</h3>*/}
      <p className="mb-2 text-bold">{hoveredData.date ? `Date: ${hoveredData.date}` : `Rating: ${hoveredData.rating}`}</p>
      <p className="mb-2">{hoveredData.count ? `No. of users: ${hoveredData.count}` : ''}</p>
      <p className="mb-2">{hoveredData.review ? `Review: ${hoveredData.review}` : ''}</p>
      {reviewsToShow.length > 0 && (
        <div>
          <ul className="list-disc list-inside">
            {reviewsToShow.map((review, index) => (
              <li key={index}>{review}</li>
            ))}
          </ul>
          {hoveredData.reviews.length > MAX_REVIEWS_DISPLAY && (
            <p className="text-sm text-gray-500 mt-2">and more...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar1;
