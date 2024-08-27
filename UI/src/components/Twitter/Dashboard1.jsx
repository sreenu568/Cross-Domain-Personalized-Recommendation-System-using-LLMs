import React from 'react';
import Logo from '../../twitter-logo.png';
import 'tailwindcss/tailwind.css';
import WordCloudComponent from '../Graphs/WordCloudComponent';
import { Timeline, Tweet } from 'react-twitter-widgets';
import { useTwitter } from './TwitterContext';

const Dashboard1 = ({ setSelectedTweets, setUsername }) => {
  const { inputText, setInputText, tweets, error, fetchTweets } = useTwitter();

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFetchTweets = () => {
    fetchTweets();
    setUsername(inputText);
    setSelectedTweets(tweets);
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
              onClick={handleFetchTweets}
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
              <div className={`bg-white shadow-md rounded-lg p-4 ${tweets.length === 0 ? 'hidden' : ''}`}>
                <h2 className="text-xl font-semibold mb-2">Twitter Timeline</h2>
                <Timeline
                  dataSource={{ sourceType: 'profile', screenName: inputText || 'twitter' }}
                  options={{ height: '600' }}
                />
              </div>

              <div className={`bg-white shadow-md rounded-lg p-4 ${tweets.length === 0 ? 'hidden' : ''}`}>
                <h2 className="text-xl font-semibold mb-2">Word Cloud</h2>
                <WordCloudComponent tweets={tweets} />
              </div>

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
