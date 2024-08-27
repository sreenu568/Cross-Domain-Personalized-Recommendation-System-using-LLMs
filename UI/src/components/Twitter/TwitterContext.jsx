import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create a context for the Twitter dashboard
const TwitterContext = createContext();

export const useTwitter = () => {
  return useContext(TwitterContext);
};

export const TwitterProvider = ({ children }) => {
  const [inputText, setInputText] = useState('');
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);

  // Initialize state from local storage on component mount
  useEffect(() => {
    const savedInputText = localStorage.getItem('twitterInputText') || '';
    const savedTweets = JSON.parse(localStorage.getItem('twitterTweets')) || [];
    setInputText(savedInputText);
    setTweets(savedTweets);
  }, []);

  // Fetch tweets when the function is called manually
  const fetchTweets = async () => {
    if (inputText) {
      try {
        const apiUrl = `https://persona1-14c3597db9ce.herokuapp.com/api/twitter/${inputText}`;
        //const apiUrl= `http://127.0.0.1:5001/api/twitter/${inputText}`
        //const apiUrl=`http://127.0.0.1:5001/tweets/${inputText}`
        const response = await axios.get(apiUrl);
        setTweets(response.data);
        setError(null);
      } catch (error) {
        setError('Error fetching tweets. Please try again later.');
        setTweets([]); // Clear tweets on error
        console.error('Error fetching tweets:', error);
      }
    }
  };

  // Update local storage when state changes
  useEffect(() => {
    localStorage.setItem('twitterInputText', inputText);
    localStorage.setItem('twitterTweets', JSON.stringify(tweets));
  }, [inputText, tweets]);

  const value = {
    inputText,
    setInputText,
    tweets,
    setTweets,
    error,
    setError,
    fetchTweets // Expose fetchTweets
  };

  return (
    <TwitterContext.Provider value={value}>
      {children}
    </TwitterContext.Provider>
  );
};
