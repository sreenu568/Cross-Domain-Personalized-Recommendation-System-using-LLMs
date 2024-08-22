import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const MovieSearch = ({ setSelectedMovies }) => {
  const [searchTerm, setSearchTerm] = useState('The Boys');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovies, setSelectedMoviesState] = useState([]);
  const moviesPerPage = 100;
  const apiKey = "84f6272e"; // Replace with your API key

  useEffect(() => {
    fetchMovies();
  }, [currentPage, searchTerm]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&page=${currentPage}`
      );

      if (response.data.Response === 'True') {
        const updatedMovies = response.data.Search.map((movie) => ({
          id: movie.imdbID,
          title: movie.Title,
          poster_path: movie.Poster || 'https://via.placeholder.com/200x300', // Use a placeholder if no poster
        }));
        setMovies(updatedMovies);
      } else {
        setError('No movies found.');
      }
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    fetchMovies();
  };

  const handleSelectMovie = (movie) => {
    const isMovieSelected = selectedMovies.some((selectedMovie) => selectedMovie.id === movie.id);

    if (!isMovieSelected) {
      const updatedSelectedMovies = [...selectedMovies, movie];
      setSelectedMoviesState(updatedSelectedMovies);
      setSelectedMovies(updatedSelectedMovies);
    }
  };

  const handleRemoveMovie = (movieId) => {
    const updatedMovies = selectedMovies.filter((movie) => movie.id !== movieId);
    setSelectedMoviesState(updatedMovies);
    setSelectedMovies(updatedMovies);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-left mb-4">
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for movies..."
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
         {/* <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>*/}
        </form>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="relative bg-gray-200 rounded-xl overflow-hidden hover:scale-105 duration-300 cursor-pointer"
            onClick={() => handleSelectMovie(movie)}
          >
            <div
              className="w-full h-60 bg-center bg-cover"
              style={{ backgroundImage: `url(${movie.poster_path})` }}
            >
              <button
                className="absolute bottom-4 right-4 bg-blue-500 text-white py-1 px-2 rounded-md"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the click event from selecting the movie
                  handleSelectMovie(movie);
                }}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center my-4 space-x-2">
        {Array.from({ length: Math.ceil(500 / moviesPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Selected Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {selectedMovies.length > 0 ? (
            selectedMovies.map((movie) => (
              <div
                key={movie.id}
                className="relative bg-gray-200 rounded-xl overflow-hidden hover:scale-105 duration-300 cursor-pointer"
              >
                <button
                  className="absolute top-2 right-2 text-red-500"
                  onClick={() => handleRemoveMovie(movie.id)}
                >
                  <FaTimes />
                </button>
                <div
                  className="w-full h-[300px] bg-center bg-cover"
                  style={{ backgroundImage: `url(${movie.poster_path})` }}
                ></div>
              </div>
            ))
          ) : (
            <p className="text-center">No movies selected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieSearch;
