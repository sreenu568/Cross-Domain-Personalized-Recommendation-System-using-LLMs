import React, { useState } from 'react';

// Function to parse JSON safely, including multiline JSON strings
const parseJsonString = (string) => {
  // Regular expression to match JSON objects
  const jsonMatch = string.match(/{[\s\S]*?}/); // This captures JSON objects even if they span multiple lines.
  if (jsonMatch) {
    try {
      // Attempt to parse the first JSON object found
      return { parsed: JSON.parse(jsonMatch[0]), error: null };
    } catch (e) {
      return { parsed: null, error: 'Error parsing JSON. Please check the format.' };
    }
  }
  return { parsed: null, error: 'No JSON found in the input string.' };
};

// JsonExtractor component to extract and parse JSON from a string
const JsonExtractor = () => {
  const [inputText, setInputText] = useState('');
  const [extractedJson, setExtractedJson] = useState(null);
  const [error, setError] = useState('');

  // Handle changes to the input text area
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Extract JSON from the input string using the parseJsonString function
  const extractJsonFromString = () => {
    const { parsed, error } = parseJsonString(inputText);
    setExtractedJson(parsed);
    setError(error);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Extract JSON from String</h2>
      <textarea
        rows="10"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Paste your string with JSON here..."
        value={inputText}
        onChange={handleInputChange}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={extractJsonFromString}
      >
        Extract JSON
      </button>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      {extractedJson && (
        <div className="mt-4 bg-gray-100 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-semibold">Extracted JSON:</h3>
          <pre className="overflow-x-auto">{JSON.stringify(extractedJson, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default JsonExtractor;
