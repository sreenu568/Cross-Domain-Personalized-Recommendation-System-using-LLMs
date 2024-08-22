import React from 'react';
import { Timeline, Tweet, Share, Follow, Hashtag, Mention } from 'react-twitter-widgets';

const TwitterDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Twitter Dashboard</h1>

      {/* Timeline Widget */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Twitter Timeline</h2>
        <Timeline
          dataSource={{ sourceType: 'profile', screenName: 'AmeetDeshpande_' }}
          options={{ height: '600' }}
        />
      </div>

      {/* Share Button */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Share on Twitter</h2>
        <Share
          url="https://example.com"
          options={{ text: 'Check out this awesome site!' }}
        />
      </div>

      {/* Follow Button */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Follow on Twitter</h2>
        <Follow
          screenName="twitter"
          options={{ showCount: false }}
        />
      </div>

      {/* Hashtag Widget */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Hashtag Feed</h2>
        <Hashtag
          hashtag="ReactJS"
          options={{ height: '600' }}
        />
      </div>

      {/* Mention Widget */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Mention Feed</h2>
        <Mention
          screenName="twitter"
          options={{ height: '600' }}
        />
      </div>

      {/* Tweet Widget */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Tweet</h2>
        <Tweet
          tweetId="1234567890123456789"
        />
      </div>
    </div>
  );
};

export default TwitterDashboard;
