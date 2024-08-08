import React from 'react';

const Wordcloudside = ({ sentences }) => {
  console.log("Received Sentences:", sentences); // Check if this logs

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-4">Sentences</h3>
      {sentences.length > 0 ? (
        sentences.map((sentence, index) => (
          <p key={index} className="mb-2">{sentence}</p>
        ))
      ) : (
        <p className="text-gray-500">No sentences available</p>
      )}
    </div>
  );
};

export default Wordcloudside;
