import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Pagination from './Pagination';

function AllBeauty({ onSelectedItemsChange }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 36;

  useEffect(() => {
    Papa.parse('/final_raw_meta_All_Beauty.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setItems(results.data);
        console.log(results.data);
      },
    });
  }, []);

  useEffect(() => {
    onSelectedItemsChange(selectedItems);
  }, [selectedItems, onSelectedItemsChange]);

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
          placeholder="Search Beauty Items by Title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl bg-gray-200 hover:scale-105 duration-300 cursor-pointer"
            onDoubleClick={() => selectItem(item)}
          >
            <div
              className="h-[200px] w-full bg-center bg-cover rounded-xl"
              style={{ backgroundImage: `url(${item.image_url})` }}
            >
              {/* Fallback image if URL is not valid */}
              <img
                src={item.image_url}
                alt={item.title}
                className="hidden"
                onError={(e) => {
                  e.target.style.display = 'none'; // Hide broken images
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
        <h2 className="text-xl font-bold mb-4">Selected Beauty Items</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {selectedItems.map((item, index) => (
            <div
              key={index}
              className="relative rounded-xl bg-gray-200 hover:scale-105 duration-300 cursor-pointer"
            >
              <div
                className="h-[200px] w-full bg-center bg-cover rounded-xl"
                style={{ backgroundImage: `url(${item.image_url})` }}
              >
                {/* Fallback image if URL is not valid */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="hidden"
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide broken images
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

export default AllBeauty;
