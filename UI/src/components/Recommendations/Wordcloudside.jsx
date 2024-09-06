import React from 'react';

const Wordcloudside = ({ sentences, types }) => {
  // Function to clean a sentence by removing leading and trailing symbols
  const cleanSentence = (sentence) => {
    return sentence.replace(/^[^\w]+|[^\w]+$/g, '').trim();
  };

  // Filter unique sentences, clean them, and take the top two
  const uniqueSentences = Array.from(new Set(sentences.map(cleanSentence))).slice(0, 2);

  //console.log("Received Sentences:", uniqueSentences); // Check if this logs
  //console.log("Received Type:", types);

  // Determine the heading based on the type
  const heading = types === "reviews" ? "Product Reviews" : "Product Features";

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-4">{heading}</h3>
      {uniqueSentences.length > 0 ? (
        uniqueSentences.length === 1 ? (
          <p className="mb-2 text-justify">{uniqueSentences[0]}</p>
        ) : (
          uniqueSentences.map((sentence, index) => (
            <p key={index} className="mb-2 text-justify">{sentence}</p>
          ))
        )
      ) : (
        <p className="text-gray-500">No {heading} available</p>
      )}
    </div>
  );
};

export default Wordcloudside;
