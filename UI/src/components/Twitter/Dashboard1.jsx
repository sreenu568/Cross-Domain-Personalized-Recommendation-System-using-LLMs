import React, { useState } from 'react';
import axios from 'axios';
import Logo from '../../twitter-logo.png'; // Import your Twitter logo or any other image
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is properly imported
import WordCloudComponent from '../Graphs/WordCloudComponent';
import { Timeline, Tweet, Follow, Share } from 'react-twitter-widgets';

const Dashboard1 = ({ setSelectedTweets, setUsername }) => {
  const [inputText, setInputText] = useState('');
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const fetchTweets = async () => {
    try {
      const apiUrl = `https://persona1-14c3597db9ce.herokuapp.com/api/twitter/${inputText}`;
      const response = await axios.get(apiUrl);
      setUsername(inputText);
      setTweets(response.data);
      setSelectedTweets(response.data); // Pass tweets to the parent component
      setError(null);
    } catch (error) {
      setError('Error fetching tweets. Please try again later.');
      setTweets([]); // Clear tweets on error
      console.error('Error fetching tweets:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center p-4">
      <div className="max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden w-full">
        <header className="flex justify-center items-center py-6 bg-blue-700">
          <img className="w-12 mx-4" src={Logo} alt="Twitter Logo" />
          <h1 className="text-3xl font-bold text-white">Twitter Dashboard</h1>
        </header>

        <main className="p-6">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <input
              type="text"
              placeholder="Enter Twitter username"
              value={inputText}
              onChange={handleInputChange}
              className="border border-gray-300 px-4 py-2 rounded-md mr-2 focus:outline-none w-full focus:border-blue-500"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md transition duration-300"
              onClick={fetchTweets}
            >
              Fetch Tweets
            </button>
          </div>

          {error && (
            <div className="px-4 py-4 bg-red-100 border-t border-red-300 mb-6">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {!error && inputText && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Display Twitter Timeline Widget */}
              <div className={`bg-white shadow-md rounded-lg p-4 ${tweets.length === 0 ? 'hidden' : ''}`}>
                <h2 className="text-xl font-semibold mb-2">Twitter Timeline</h2>
                <Timeline
                  dataSource={{ sourceType: 'profile', screenName: inputText || 'twitter' }}
                  options={{ height: '600' }}
                />
              </div>

              {/* Display Word Cloud */}
              <div className={`bg-white shadow-md rounded-lg p-4 ${tweets.length === 0 ? 'hidden' : ''}`}>
                <h2 className="text-xl font-semibold mb-2">Word Cloud</h2>
                <WordCloudComponent tweets={tweets} />
              </div>

              {/* Display Follow Button 
              <div className={`bg-white shadow-md rounded-lg p-4 ${tweets.length === 0 ? 'hidden' : ''}`}>
                <h2 className="text-xl font-semibold mb-2">Follow on Twitter</h2>
                <Follow
                  screenName={inputText || 'twitter'}
                  options={{ showCount: false }}
                />
              </div>

              {/* Display Share Button 
              <div className={`bg-white shadow-md rounded-lg p-4 ${tweets.length === 0 ? 'hidden' : ''}`}>
                <h2 className="text-xl font-semibold mb-2">Share on Twitter</h2>
                <Share
                  url="https://example.com"
                  options={{ text: 'Check out this awesome site!' }}
                />
              </div>*/}

              {/* Display Tweets */}
              <div className={`bg-white shadow-md rounded-lg p-4 ${tweets.length > 0 ? 'col-span-1 md:col-span-2 lg:col-span-2' : 'hidden'}`}>
                <h2 className="text-xl font-semibold mb-2">Recent Tweets</h2>
                {tweets.length > 0 ? (
                  tweets.map((tweet) => (
                    <div key={tweet.tweet_id} className="mb-4">
                      <Tweet tweetId={tweet.tweet_id} options={{ conversation: 'none' }} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No tweets available.</p>
                )}
              </div>

              {/* Placeholder when no tweets are available */}
              {tweets.length === 0 && (
                <div className="bg-white shadow-md rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-2">No Tweets Available</h2>
                  <p className="text-gray-600">There are no tweets available to display for the given username.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard1;
