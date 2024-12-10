import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Use effect to load values from cookies on component mount
  useEffect(() => {
    const storedAgeRange = Cookies.get("ageRange");
    const storedGender = Cookies.get("gender");
    const storedStartDate = Cookies.get("startDate");
    const storedEndDate = Cookies.get("endDate");

    if (storedAgeRange) setAgeRange(storedAgeRange);
    if (storedGender) setGender(storedGender);
    if (storedStartDate) setStartDate(storedStartDate);
    if (storedEndDate) setEndDate(storedEndDate);
  }, []);

  // When filter values change, update the cookies
  useEffect(() => {
    if (ageRange) Cookies.set("ageRange", ageRange, { expires: 7 });
    if (gender) Cookies.set("gender", gender, { expires: 7 });
    if (startDate) Cookies.set("startDate", startDate, { expires: 7 });
    if (endDate) Cookies.set("endDate", endDate, { expires: 7 });
  }, [ageRange, gender, startDate, endDate]);

  return (
    <FilterContext.Provider
      value={{
        ageRange,
        setAgeRange,
        gender,
        setGender,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  return useContext(FilterContext);
};
