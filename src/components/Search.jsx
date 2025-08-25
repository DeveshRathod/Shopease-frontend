import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const Search = ({ searchQuery, setSearchQuery, setClicked }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `/api/products/getSuggestion?searchQuery=${searchQuery}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter") {
      if (selectedSuggestionIndex !== -1) {
        setSearchQuery(suggestions[selectedSuggestionIndex].name);
        setSuggestions([]);
        setClicked(true);
      } else {
        setClicked(true);
        setSearchQuery("");
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="relative">
        <div className="flex items-center bg-white rounded-full shadow-md shadow-md-top">
          <div className="p-2">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="outline-none bg-transparent w-full py-2 px-4"
          />
        </div>
        {searchQuery && suggestions.length > 0 && (
          <div className="absolute bg-white border border-gray-300 mt-1 w-full z-10 shadow-xl rounded-b-md rounded-t-md">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 cursor-pointer hover:bg-gray-100 rounded-md ${
                  selectedSuggestionIndex === index ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex justify-between">
                  <p>
                    {suggestion.name.length > 30
                      ? `${suggestion.name.slice(0, 30)}...`
                      : suggestion.name}
                  </p>
                  <p>{suggestion.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
