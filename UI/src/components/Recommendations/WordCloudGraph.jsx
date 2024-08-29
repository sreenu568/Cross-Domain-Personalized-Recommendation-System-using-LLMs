import React, { useMemo, useState, useEffect } from 'react';
import ReactWordCloud from 'react-wordcloud';
import Wordcloudside from './Wordcloudside';
import 'react-tooltip/dist/react-tooltip.css';

// List of common stopwords
const stopwords = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
  'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she',
  'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
  'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that',
  'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of',
  'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then',
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
  'just', 'don', 'should', 'now'
]);

const WordCloudGraph = ({ sentences, name }) => {
  const [selectedWordSentences, setSelectedWordSentences] = useState([]);
  const [hoveredWord, setHoveredWord] = useState(null); // State to manage hover status

  useEffect(() => {
    //console.log("Selected Word Sentences Updated:", selectedWordSentences);
  }, [selectedWordSentences]);
  
  const words = useMemo(() => {
    const text = sentences.join(' ');

    // Split the text into words and count the occurrences of each word
    const wordCounts = text.split(/\s+/).reduce((counts, word) => {
      const cleanedWord = word.replace(/[^\w\s]|_/g, '').toLowerCase(); // Remove punctuation and convert to lowercase

      // Remove URLs and stopwords
      if (
        !stopwords.has(cleanedWord) &&
        cleanedWord.length > 1 &&
        !cleanedWord.match(/http[s]?:\/\//)
      ) {
        counts[cleanedWord] = (counts[cleanedWord] || 0) + 1;
      }

      return counts;
    }, {});

    return Object.keys(wordCounts).map((word) => ({
      text: word,
      value: wordCounts[word],
    }));
  }, [sentences]);

  // Get sentences for each word
  const wordToSentences = useMemo(() => {
    const result = sentences.reduce((acc, sentence) => {
      sentence.split(/\s+/).forEach((word) => {
        const cleanedWord = word.replace(/[^\w\s]|_/g, '').toLowerCase();
        if (
          !stopwords.has(cleanedWord) &&
          cleanedWord.length > 1 &&
          !cleanedWord.match(/http[s]?:\/\//)
        ) {
          if (!acc[cleanedWord]) {
            acc[cleanedWord] = [];
          }
          acc[cleanedWord].push(sentence);
        }
      });
      return acc;
    }, {});
    //console.log("Word to Sentences Map:", result); // Check if this logs
    return result
  }, [sentences]);

  const handleWordHover = (word) => {
    console.log("Hovered Word:", word.text);
    const cleanedWord = word.text.toLowerCase();
    const sentencesForWord = wordToSentences[cleanedWord] || [];
    console.log("Sentences for Word:", sentencesForWord);
    setSelectedWordSentences(sentencesForWord); // Update state
    setHoveredWord(word.text); // Set hovered word
  };

  const handleWordLeave = () => {
    setSelectedWordSentences([]); // Clear sentences
    setHoveredWord(null); // Reset hovered word
  };

  const options = {
    rotations: 1,
    enableTooltip: false, // Disable tooltips
    rotationAngles: [0],
    fontSizes: [20, 60],
    enableOptimizations: true,
    deterministic: true,
    padding: 2,
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
  };

  return (
    <div className="flex">
      <div className="flex w-2/3">
        <ReactWordCloud
          words={words}
          options={options}
          callbacks={{
            onWordMouseOver: handleWordHover, // Handle hover event
            onWordMouseLeave: handleWordLeave, // Handle hover out event
          }}
        />
      </div>
      {hoveredWord && (
        <div className="flex bg-gray-50 p-4 rounded-md shadow-md border-l border-gray-300">
          <Wordcloudside sentences={selectedWordSentences} types={name} />
        </div>
      )}
    </div>
  );
};

export default WordCloudGraph;
