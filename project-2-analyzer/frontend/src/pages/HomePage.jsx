import React, { useEffect, useState } from "react";
import { FilterProvider } from "../context/FilterContext";
import Filter from "../components/Filters";
import Charts from "../components/Charts";

const HomePage = () => {
  return (
    <FilterProvider>
      <div>
        <Filter />
        <Charts />
      </div>
    </FilterProvider>
  );
};

export default HomePage;
