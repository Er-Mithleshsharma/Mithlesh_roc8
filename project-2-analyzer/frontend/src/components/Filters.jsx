import React, { useState, useEffect } from "react";
import { useFilters } from "../context/FilterContext";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FaUser,
  FaVenusMars,
  FaCalendarAlt,
  FaRedo,
  FaShareAlt,
} from "react-icons/fa";

const Filter = () => {
  const {
    ageRange,
    setAgeRange,
    gender,
    setGender,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useFilters();

  const [dates, setDates] = useState([]);
  const [filteredEndDates, setFilteredEndDates] = useState([]);
  const [copySuccess, setCopySuccess] = useState("");
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chart/data`
        );
        const uniqueDates = Array.from(
          new Set(response.data.map((entry) => entry.Day))
        );
        setDates(uniqueDates);
      } catch (error) {
        console.error("Error fetching date data", error);
      }
    };

    fetchDates();
  }, []);

  useEffect(() => {
    const savedAgeRange = Cookies.get("ageRange");
    const savedGender = Cookies.get("gender");
    const savedStartDate = Cookies.get("startDate");
    const savedEndDate = Cookies.get("endDate");

    if (savedAgeRange) setAgeRange(savedAgeRange);
    if (savedGender) setGender(savedGender);
    if (savedStartDate) {
      setStartDate(savedStartDate);
      const availableEndDates = dates.filter((date) => date > savedStartDate);
      setFilteredEndDates(availableEndDates);

      if (savedEndDate && availableEndDates.includes(savedEndDate)) {
        setEndDate(savedEndDate);
      } else {
        setEndDate("");
      }
    }
  }, [dates, setAgeRange, setGender, setStartDate, setEndDate]);

  useEffect(() => {
    if (ageRange) Cookies.set("ageRange", ageRange, { expires: 7 });
    if (gender) Cookies.set("gender", gender, { expires: 7 });
    if (startDate) Cookies.set("startDate", startDate, { expires: 7 });
    if (endDate) Cookies.set("endDate", endDate, { expires: 7 });
  }, [ageRange, gender, startDate, endDate]);

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
    const availableEndDates = dates.filter((date) => date > selectedStartDate);
    setFilteredEndDates(availableEndDates);
    setEndDate("");
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAgeRange(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleReset = () => {
    setAgeRange("");
    setGender("");
    setStartDate("");
    setEndDate("");
    Cookies.remove("ageRange");
    Cookies.remove("gender");
    Cookies.remove("startDate");
    Cookies.remove("endDate");
  };

  const generateShareableUrl = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();

    if (ageRange) params.append("ageRange", ageRange);
    if (gender) params.append("gender", gender);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return `${baseUrl}/?${params.toString()}`;
  };

  const handleShare = () => {
    const shareableUrl = generateShareableUrl();
    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => {
        setCopySuccess("Link copied to clipboard!");
      })
      .catch(() => {
        setCopySuccess("Failed to copy link.");
      });
  };

  useEffect(() => {
    if (copySuccess) {
      setShowCopySuccess(true);
      const timer = setTimeout(() => {
        setShowCopySuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const isAnyFilterSelected = ageRange || gender || startDate || endDate;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-bold text-gray-700 mb-6">Filter Options</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-600 flex items-center mb-2">
            <FaUser className="mr-2 text-gray-500" /> Age Range:
          </label>
          <select
            value={ageRange}
            onChange={handleAgeChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 transition"
          >
            <option value="">Select Age Range</option>
            <option value="15-25">15-25</option>
            <option value=">25">&gt; 25</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 flex items-center mb-2">
            <FaVenusMars className="mr-2 text-gray-500" /> Gender:
          </label>
          <select
            value={gender}
            onChange={handleGenderChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 transition"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 flex items-center mb-2">
            <FaCalendarAlt className="mr-2 text-gray-500" /> Start Date:
          </label>
          <select
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 transition"
          >
            <option value="">Select Start Date</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 flex items-center mb-2">
            <FaCalendarAlt className="mr-2 text-gray-500" /> End Date:
          </label>
          <select
            value={endDate}
            onChange={handleEndDateChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 transition"
          >
            <option value="">Select End Date</option>
            {filteredEndDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-5">
        <button
          onClick={handleReset}
          disabled={!isAnyFilterSelected}
          className={`flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300 ease-in-out ${
            !isAnyFilterSelected ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaRedo className="mr-2" /> Reset
        </button>

        <button
          onClick={handleShare}
          disabled={!isAnyFilterSelected}
          className={`flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-lg shadow-md hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out ${
            !isAnyFilterSelected ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaShareAlt className="mr-2" /> Share
        </button>
      </div>
      {showCopySuccess && <p className="mt-4 text-green-600">{copySuccess}</p>}
    </div>
  );
};

export default Filter;
