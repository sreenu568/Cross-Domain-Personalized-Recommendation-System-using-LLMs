import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar';
import './App.css';
import MovieSearch from './components/Domains/MovieSearch';
import Dashboard1 from './components/Twitter/Dashboard1';
import AllBeauty from './components/Domains/AllBeauty';
import AmazonFashion from './components/Domains/AmazonFashion';
import CellPhones from './components/Domains/CellPhones';
import Books from './components/Domains/Books';
import Personalize from './components/Graphs/Personalize';
import RecommendationDashboard2 from './components/Recommendations/RecommendationDashboard2';
import RecommendationDashboard4 from './components/Recommendations/RecommendedDashboard4';
import Mainsidebar from './components/NavBar/Mainsidebar';
import { RecommendationProvider } from './components/Recommendations/RecommendationsContext';

function App() {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedTweets, setSelectedTweets] = useState([]);
  const [selectedBeauty, setSelectedBeauty] = useState([]);
  const [selectedFashion, setSelectedFashion] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState({});
  const [username, setUsername] = useState('');

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
  };

  return (
    <RecommendationProvider>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <Navbar selectedDomain={selectedDomain} />

          <div className="flex flex-grow">
            <Mainsidebar selectedDomain={selectedDomain} />

            <div className="flex-grow ml-48 p-4">
              <Routes>
                <Route 
                  path="/watchlist" 
                  element={<MovieSearch setSelectedMovies={setSelectedMovies} onDomainSelect={() => handleDomainSelect('Movies')} />} 
                />
                <Route 
                  path="/twitter" 
                  element={<Dashboard1 setSelectedTweets={setSelectedTweets} setUsername={setUsername} />} 
                />
                <Route 
                  path="/allbeauty" 
                  element={<AllBeauty onSelectedItemsChange={setSelectedBeauty} onDomainSelect={() => handleDomainSelect('Beauty')} />} 
                />
                <Route 
                  path="/fashion" 
                  element={<AmazonFashion onSelectedItemsChange={setSelectedFashion} onDomainSelect={() => handleDomainSelect('Fashion')} />} 
                />
                <Route 
                  path="/phones" 
                  element={<CellPhones onSelectedItemsChange={setSelectedPhones} onDomainSelect={() => handleDomainSelect('Phones')} />} 
                />
                <Route 
                  path="/books" 
                  element={<Books onSelectedBooksChange={setSelectedBooks} onDomainSelect={() => handleDomainSelect('Books')} />} 
                />
                <Route 
                  path="/personalize" 
                  element={<Personalize 
                    selectedMovies={selectedMovies} 
                    selectedBooks={selectedBooks} 
                    tweets={selectedTweets} 
                    beauty={selectedBeauty} 
                    fashion={selectedFashion} 
                    phones={selectedPhones} 
                  />} 
                />
                <Route 
                  path="/llm1" 
                  element={<RecommendationDashboard2 
                    selectedMovies={selectedMovies} 
                    selectedBooks={selectedBooks} 
                    tweets={selectedTweets} 
                    beauty={selectedBeauty} 
                    fashion={selectedFashion} 
                    phones={selectedPhones} 
                    username={username} 
                    onRecommendedProducts={setRecommendedProducts}
                    recommendedProducts={recommendedProducts}
                  />} 
                />
                {/*<Route 
                  path="/llm2" 
                  element={<RecommendationDashboard4 
                    recommendedProducts={recommendedProducts}
                  />} 
                />*/}
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </RecommendationProvider>
  );
}

export default App;
