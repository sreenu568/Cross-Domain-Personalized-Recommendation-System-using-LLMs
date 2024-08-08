import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  Scatter,
} from "recharts";
import WordCloudGraph from "./WordCloudGraph"; // Assuming this is another component in your project
import Sidebar1 from "../Graphs/Sidebar1";

const defaultTitles = {
  Books: "Watercolor with Me in the Jungle",
  Movies_and_TV: "Watercolor with Me in the Jungle",
  All_Beauty: "Watercolor with Me in the Jungle",
  Amazon_Fashion: "Watercolor with Me in the Jungle",
  Cell_Phones_and_Accessories: "Watercolor with Me in the Jungle",
};

const Ratingplot = ({bookTitle, domain}) => {
  const [ratingData, setRatingData] = useState([
    { rating: 1, count: 0, reviews: [] },
    { rating: 2, count: 0, reviews: [] },
    { rating: 3, count: 0, reviews: [] },
    { rating: 4, count: 0, reviews: [] },
    { rating: 5, count: 0, reviews: [] },
  ]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [csvData1,setCsvData1]=useState();
  const [reviewSentences, setReviewSentences] = useState([]);
  const [featureSentences, setFeatureSentences] = useState([]);
  const [error, setError] = useState("");
  const [hoveredData, setHoveredData] = useState(null);
  const [hoveredData1, setHoveredData1] = useState(null);
  const [hoveredData2, setHoveredData2] = useState(null);
  const [hoveredData3, setHoveredData3] = useState(null);
  const [hoveredData4, setHoveredData4] = useState(null);

  useEffect(() => {
    if (domain) {
     loadCsvData(`${domain}.csv`); // Construct file path based on domain
     //loadCsvData("finalmetabooks.csv");
    }
  }, [domain]);

  const loadCsvData = (filePath) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: (results) => {
        setCsvData(results.data);
        prepareChartData(results.data);
      },
      error: (error) => {
        console.error("Error loading CSV data:", error);
        setError("Failed to load CSV data.");
      },
    });
  };
  
  useEffect(() => {
    if (domain) {
     //loadCsvData(`${domain}.csv`); // Construct file path based on domain
     loadCsvData1("finalmetabooks.csv");
    }
  }, [domain]);

  const loadCsvData1 = (filePath) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: (results) => {
        setCsvData1(results.data);
        prepareChartData(results.data);
      },
      error: (error) => {
        console.error("Error loading CSV data:", error);
        setError("Failed to load CSV data.");
      },
    });
  };

  const prepareChartData = (csvData) => {
    const ratingCounts = {
      1: { count: 0, reviews: [] },
      2: { count: 0, reviews: [] },
      3: { count: 0, reviews: [] },
      4: { count: 0, reviews: [] },
      5: { count: 0, reviews: [] },
    };
    const ratingsOverTime = [];
    const averageRatingVsPrice = [];

    const recommendedBookData = csvData.filter(
      (book) => book.title === bookTitle
    );

    if (!recommendedBookData.length) {
      const defaultTitle = defaultTitles[domain] || "Unknown Title";
      setError(`No data found for recommended product: ${bookTitle}. Using default title: ${defaultTitle}`);
      // Use default title data if no specific book data is found
      const defaultData = csvData1.filter(
        (book) => book.title === defaultTitle
      );
      if (defaultData.length) {
        prepareChartDataForBook(defaultData);
      } else {
        setError(`No data found for default title: ${defaultTitle}`);
      }
      return;
    }

    prepareChartDataForBook(recommendedBookData);
  };

  const prepareChartDataForBook = (bookData) => {
    const ratingCounts = {
      1: { count: 0, reviews: [] },
      2: { count: 0, reviews: [] },
      3: { count: 0, reviews: [] },
      4: { count: 0, reviews: [] },
      5: { count: 0, reviews: [] },
    };
    const ratingsOverTime = [];
    const averageRatingVsPrice = [];

    bookData.forEach((book) => {
      const rating = parseInt(book.rating);
      if (!isNaN(rating) && ratingCounts[rating]) {
        ratingCounts[rating].count++;
        ratingCounts[rating].reviews.push(book.review);
      }

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

    setRatingData(
      Object.entries(ratingCounts).map(([key, value]) => ({
        rating: parseInt(key),
        count: value.count,
        reviews: value.reviews,
      }))
    );
    setTimeSeriesData(ratingsOverTime);
    setScatterData(averageRatingVsPrice);

    fetchReviewData(bookData[0]);
  };

  const fetchReviewData = (bookData) => {
    if (bookData) {
      const reviews = bookData.review ? bookData.review.split(". ") : [];
      const features = bookData.features ? bookData.features.split(". ") : [];
      setReviewSentences(reviews);
      setFeatureSentences(features);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { rating, count, reviews } = payload[0].payload;
      setHoveredData({ rating, count, reviews }); // Update hovered data
      return (
        <div className="custom-tooltip bg-white shadow-md p-2 rounded-md max-w-xs w-auto">
          <p className="label font-bold">{`No. of users ${count}`}</p>
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
  const CustomTooltip2 = ({ active, payload }) => {
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
    <div>
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

export default Ratingplot;
