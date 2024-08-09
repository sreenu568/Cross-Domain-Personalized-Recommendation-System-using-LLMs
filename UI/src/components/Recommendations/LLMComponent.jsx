import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import WordCloudGraph from "./WordCloudGraph";
import CustomBarChart from "../Graphs/CustomBarChart";
import CustomPieChart from "../Graphs/CustomPieChart";
import WordCloudComponent from "../Graphs/WordCloudComponent";
import Sidebar from "../Graphs/Sidebar";
import Sidebar1 from "../Graphs/Sidebar1";

const LLMComponent = ({
  tweets,
  selectedBooks,
  selectedMovies,
  beauty,
  fashion,
  phones,
}) => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [ratingData, setRatingData] = useState([
    { rating: 1, count: 0, reviews: [] },
    { rating: 2, count: 0, reviews: [] },
    { rating: 3, count: 0, reviews: [] },
    { rating: 4, count: 0, reviews: [] },
    { rating: 5, count: 0, reviews: [] },
  ]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [reviewSentences, setReviewSentences] = useState([]);
  const [featureSentences, setFeatureSentences] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedItem1, setSelectedItem1] = useState("");
  const [hoveredItem, setHoveredItem] = useState("");
  const [hoveredItem1, setHoveredItem1] = useState("");
  const [hoveredData, setHoveredData] = useState(null);
  const [hoveredData1, setHoveredData1] = useState(null);
  const [hoveredData2, setHoveredData2] = useState(null);

  useEffect(() => {
    loadCsvData("/finalmetabooks.csv"); // Replace with your CSV file path
  }, []);

  const loadCsvData = (filePath) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
      error: (error) => {
        console.error("Error loading CSV data:", error);
      },
    });
  };

  const handleRecommendation = async () => {
    if (
      tweets.length === 0 &&
      selectedBooks.length === 0 &&
      selectedMovies.length === 0
    ) {
      setError(
        "Please select at least one book, movie, or tweet for recommendations."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://productrecommend-f976b416292c.herokuapp.com/recommend",
        {
          tweets: tweets.map((tweet) => tweet.text),
          selected_books: selectedBooks.map((book) => book.title),
          selected_movies: selectedMovies.map((movie) => movie.title),
        }
      );

      if (response.data && response.data.recommendation) {
        const recommendation = response.data.recommendation;
        const parts = recommendation.split("\nReason: ");
        const bookTitle = parts[0]
          .replace("Recommended Book: ", "")
          .replace(/["']/g, "")
          .trim();

        // Find the recommended book data from csvData
        const recommendedBookData = csvData.filter(
          (book) => book.title === bookTitle
        );

        if (!recommendedBookData) {
          setError(`No data found for recommended book: ${bookTitle}`);
          return;
        }

        const { image_url, ...restData } = recommendedBookData[0];

        setRecommendedBooks([
          { title: bookTitle, reason: parts[1], image_url, ...restData },
        ]);

        prepareChartData(recommendedBookData);
        fetchReviewData(recommendedBookData[0]);
      } else {
        setError("No recommendation received.");
      }
    } catch (error) {
      setError(
        "An error occurred while fetching recommendations. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const prepareChartData = (recommendedBookData) => {
    const ratingCounts = {
      1: { count: 0, reviews: [] },
      2: { count: 0, reviews: [] },
      3: { count: 0, reviews: [] },
      4: { count: 0, reviews: [] },
      5: { count: 0, reviews: [] },
    };
    const ratingsOverTime = [];
    const averageRatingVsPrice = [];

    recommendedBookData.forEach((book) => {
      const rating = parseInt(book.rating);
      ratingCounts[rating].count++;
      ratingCounts[rating].reviews.push(book.review);
      const timestamp = new Date(book.timestamp);
      ratingsOverTime.push({
        x: timestamp.getTime(),
        y: rating,
        review: book.review,
      });
      averageRatingVsPrice.push({
        x: parseFloat(book.average_rating),
        y: parseFloat(book.price),
        review: book.review,
      });
    });
    {
      /*setRatingData(Object.values(ratingCounts));*/
    }
    setRatingData(
      Object.entries(ratingCounts).map(([key, value]) => ({
        rating: key,
        count: value.count,
        reviews: value.reviews,
      }))
    );
    setTimeSeriesData(ratingsOverTime);
    setScatterData(averageRatingVsPrice);
  };

  const fetchReviewData = (recommendedBookData) => {
    if (recommendedBookData) {
      const reviews = recommendedBookData.review.split(". ");
      const features = recommendedBookData.features.split(". ");
      setReviewSentences(reviews);
      setFeatureSentences(features);
    }
  };

  // Combine data for pie chart
  const pieChartData = [
    { name: "Beauty", value: beauty.length },
    { name: "Fashion", value: fashion.length },
    { name: "Phones", value: phones.length },
    { name: "Books", value: selectedBooks.length },
    { name: "Movies", value: selectedMovies.length },
    { name: "Tweets", value: tweets.length },
  ];

  // Detailed items for each category
  const detailedItems = {
    Beauty: beauty.map((item) => ({
      name: item.title,
      description: item.details,
      image_url: item.image_url,
    })),
    Fashion: fashion.map((item) => ({
      name: item.title,
      description: item.details,
      image_url: item.image_url,
    })),
    Phones: phones.map((item) => ({
      name: item.title,
      description: item.details,
      image_url: item.image_url,
    })),
    Books: selectedBooks.map((item) => ({
      name: item.title,
      description: item.details,
      image_url: item.image_url,
    })),
    Movies: selectedMovies.map((item) => ({
      name: item.title,
      description: item.details,
    })),
    Tweets: tweets.map((item) => ({ name: item.text, price: null })),
  };

  const barChartData = [
    { category: "Beauty", count: beauty.length },
    { category: "Fashion", count: fashion.length },
    { category: "Phones", count: phones.length },
    { category: "Movies", count: selectedMovies.length },
    { category: "Books", count: selectedBooks.length },
    { category: "Tweets", count: tweets.length },
  ];

  console.log("ratingplot",ratingData);
  console.log("timeseriesplot",timeSeriesData);
  console.log("scateerplot",scatterData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const rating = payload[0].payload.rating;
      const count = payload[0].payload.count;
      const reviews = payload[0].payload.reviews;
      setHoveredData({ rating, count, reviews }); // Update hovered data
      return (
        <div className="custom-tooltip bg-white shadow-md p-2 rounded-md max-w-xs w-auto">
          <p className="label font-bold">{`No. of users ${count}`}</p>
          <p className="label font-bold">{`Rating ${rating}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip component for rating overtime
  const CustomTooltip1 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label).toLocaleDateString();
      const rating = payload[0].value;
      const review = payload[0].payload.review; // Assuming review data is in payload
      setHoveredData1({ date, rating, review }); // Update hovered data

      return (
        <div className="custom-tooltip bg-white p-2 shadow-md rounded">
          <p className="label">{`Date: ${date}`}</p>
          <p className="rating">{`Rating: ${rating}`}</p>
        </div>
      );
    }

    return null;
  };

  // Custom Tooltip component for average rating vs price
  const CustomTooltip2 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const rating = payload[0].payload.x;
      const price = payload[0].payload.y;
      const review = payload[0].payload.review; // Assuming review data is in payload
      setHoveredData2({ rating, price, review }); // Update hovered data

      return (
        <div className="custom-tooltip bg-white p-2 shadow-md rounded">
          <p className="label">{`Average Rating: ${rating}`}</p>
          <p className="price">{`Price: $${price}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Selected Movies and Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-xl font-bold mb-4">
            Selected Movies for LLM Component
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {selectedMovies.map((movie) => (
              <div
                key={movie.id}
                className="relative h-60 rounded-xl bg-gray-200 flex-shrink-0"
                style={{ minWidth: "200px" }}
              >
                <div
                  className="h-full w-full bg-center bg-cover rounded-xl"
                  style={{
                    backgroundImage: `url(${
                      movie.poster_path ? movie.poster_path : ""
                    })`,
                  }}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 rounded-b-xl">
                  <p className="text-sm font-bold text-center">{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-xl font-bold mb-4">
            Selected Books for LLM Component
          </h2>
          <ul className="grid grid-cols-2 gap-4">
            {selectedBooks.map((book, index) => (
              <li
                key={index}
                className="p-2 border border-gray-200 rounded-md flex items-center"
              >
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-50 h-50 mr-4 object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendation Button */}
      <div className="mt-8 text-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleRecommendation}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Recommendation"}
        </button>
      </div>

      {/* Recommended Books */}
      {Array.isArray(recommendedBooks) && recommendedBooks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Books</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedBooks.map((book, index) => (
              <li
                key={index}
                className="p-4 border border-gray-300 bg-white rounded-md shadow-md"
              >
               <p className="font-bold text-lg text-blue-700 mb-2">
                  {book.title}
                </p>
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-50 h-50 mr-4 object-cover"
                />
                 
                <p className="text-gray-700 text-justify font-semibold hover:font-bold">Reason: {book.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Insights Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">User Insights</h2>

        
        {/* Custom Pie Chart */}
        <div className="flex relative">
          {/* Pie Chart Section */}
          <div className="bg-white p-4 rounded-md shadow-md mt-4 w-2/3">
            <h3 className="text-lg font-bold mb-2">
              Pie Chart for User History
            </h3>
            <CustomPieChart
              data={pieChartData}
              detailedItems={detailedItems}
              setSelectedItem={setSelectedItem}
              setHoveredItem={setHoveredItem}
            />
          </div>

          {/* Sidebar Section */}
          {hoveredItem && (
            <div className="bg-white p-4 rounded-md shadow-2xl w-1/3 absolute right-0 top-0 mt-4">
              <Sidebar
                selectedItem={hoveredItem}
                detailedItems={detailedItems}
              />
            </div>
          )}
        </div>

        {/* Custom Bar Chart Section */}
        <div className="flex relative">
          <div className="bg-white p-4 rounded-md shadow-md mt-4 w-2/3">
            <h3 className="text-lg font-bold mb-2">
              Bar Chart for User History
            </h3>
            <CustomBarChart
              data={barChartData}
              detailedItems={detailedItems}
              setSelectedItem={setSelectedItem1}
              setHoveredItem={setHoveredItem1}
            />
          </div>
          {/* Sidebar Section */}
          {hoveredItem1 && (
            <div className="bg-white p-4 rounded-md shadow-2xl w-1/3 absolute right-0 top-0 mt-4">
              <Sidebar
                selectedItem={hoveredItem1}
                detailedItems={detailedItems}
              />
            </div>
          )}
        </div>
        
          {/* Word Cloud Component */}
        <div className="bg-white p-4 rounded-md shadow-md mt-4">
          <h3 className="text-lg font-bold mb-2">User Tweets</h3>
          {tweets && tweets.length > 0 && (
            <WordCloudComponent tweets={tweets} />
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="flex relative">
        {/* Ratings vs. Number of Users */}
          <div className="bg-white p-4 rounded-md shadow-md mt-4 w-2/3">
          <h3 className="text-lg font-bold mb-2">
            Ratings vs. Number of Users
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill="rgba(75, 192, 192, 0.6)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {hoveredData && (
            <div className="bg-white p-4 rounded-md shadow-2xl w-1/3 absolute right-0 top-0 mt-4">
        <Sidebar1 hoveredData={hoveredData} />
      </div>
        )}
        </div>

        {/* Ratings Over Time */}
        <div className="flex relative">
          <div className="bg-white p-4 rounded-md shadow-md mt-4 w-2/3">
          <h3 className="text-lg font-bold mb-2">Ratings Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                label={{
                  value: "Time",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Rating"
                label={{ value: "Rating", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                content={<CustomTooltip1 />}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="y"
                stroke="rgba(75, 192, 192, 1)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {hoveredData1 && (
            <div className="bg-white p-4 rounded-md shadow-2xl w-1/3 absolute right-0 top-0 mt-4">
        <Sidebar1 hoveredData={hoveredData1} />
      </div>
        )}
        </div>
        {/* Average Rating vs Price */}
        <div className="flex relative">
        <div className="bg-white p-4 rounded-md shadow-md mt-4 w-2/3">
          <h3 className="text-lg font-bold mb-2">Average Rating vs Price</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="Average Rating" />
              <YAxis dataKey="y" name="Price" />
              <Tooltip
                content={<CustomTooltip2 />}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Legend />
              <Scatter data={scatterData} fill="rgba(75, 192, 192, 0.6)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        {hoveredData2 && (
            <div className="bg-white p-4 rounded-md shadow-2xl w-1/3 absolute right-0 top-0 mt-4">
        <Sidebar1 hoveredData={hoveredData2} />
      </div>
        )}
      </div>

      <div>

      <div className="w-200">
      {/* Reviews and Features Word Clouds */}
        {/* Reviews Word Cloud */}
        <div>
          <h2 className="text-2xl font-bold text-left text-black-700">
            Reviews
          </h2>
          <WordCloudGraph sentences={reviewSentences} />
        </div>
        </div>
        {/* Features Word Cloud */}
        <div className=" w-200">
          <h2 className="text-2xl font-bold text-left text-black-700">
            Features
          </h2>
          <WordCloudGraph sentences={featureSentences} />
        </div>
      </div>
      </div>
  );
};

export default LLMComponent;
