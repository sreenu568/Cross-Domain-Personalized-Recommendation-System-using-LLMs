import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Pagination from './Pagination';

function Books({ onSelectedBooksChange }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 84;

  useEffect(() => {
    Papa.parse('/finalmetabooks.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setItems(results.data);
       // console.log(results.data);
      },
    });
  }, []);

  useEffect(() => {
    onSelectedBooksChange(selectedItems);
  }, [selectedItems, onSelectedBooksChange]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = items.filter(item =>
    item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const selectItem = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const removeItem = (itemToRemove) => {
    setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
  };

  return (
    <div>
      <div className="p-4">
        <input
          type="text"
          placeholder="Search Books by Title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl bg-gray-200 hover:scale-105 duration-300 cursor-pointer"
            onDoubleClick={() => selectItem(item)}
          >
            <div className="h-48 w-full bg-center bg-cover rounded-xl overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'fallback-image-url'; // Fallback image URL if needed
                }}
              />
              <button
                className="absolute bottom-4 right-4 bg-blue-500 text-white py-1 px-2 rounded-md"
                onClick={() => selectItem(item)}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        booksPerPage={itemsPerPage}
        totalBooks={filteredItems.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Selected Books</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {selectedItems.map((item, index) => (
            <div
              key={index}
              className="relative rounded-xl bg-gray-50 hover:scale-105 duration-300 cursor-pointer"
            >
              <div className="h-48 w-50 bg-center bg-cover rounded-xl overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-50 h-50 object-cover"
                  onError={(e) => {
                    e.target.src = 'fallback-image-url'; // Fallback image URL if needed
                  }}
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full text-xl font-bold"
                  onClick={() => removeItem(item)}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Books;
