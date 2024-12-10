import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useFilters } from "../context/FilterContext";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

// Register Chart.js components
Chart.register(...registerables);

const GraphComponent = () => {
  const { ageRange, gender, startDate, endDate } = useFilters();
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lineChartData, setLineChartData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      const query = new URLSearchParams({
        ageRange,
        gender,
        startDate,
        endDate,
      }).toString();

      try {
        setIsLoading(true); // Start loading
        const response = await fetch(
          `http://localhost:5000/api/chart/data?${query}`
        );
        const result = await response.json();
        setData(result);
        setIsLoading(false); // End loading
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // End loading on error
      }
    };

    fetchData();
  }, [ageRange, gender, startDate, endDate]);

  // Function to get data for the bar chart
  const getBarChartData = () => {
    const labels = ["A", "B", "C", "D", "E", "F"];
    const totals = labels.map((label) =>
      data.reduce((sum, item) => sum + parseInt(item[label] || 0), 0)
    );

    return {
      labels,
      datasets: [
        {
          label: "Total Time Spent",
          data: totals,
          backgroundColor: "#FFC0CB", // Light pink
          borderColor: "#FF0000", // Red
          borderWidth: 2, // Border width of the bars
          hoverBackgroundColor: "#FFB6C1", // Darker shade of pink for hover
        },
      ],
    };
  };

  // Handle click event on bar chart
  const handleBarClick = (elems) => {
    if (elems.length > 0) {
      const index = elems[0].index;
      const selectedLabel = ["A", "B", "C", "D", "E", "F"][index];
      // Calculate line chart data based on the selected category
      calculateLineChartData(selectedLabel);
    }
  };

  // Calculate line chart data from the selected category
  const calculateLineChartData = (category) => {
    const labels = data.map((item) => item.Day);
    const lineData = data.map((item) => parseInt(item[category] || 0));

    setLineChartData({
      labels,
      datasets: [
        {
          label: `Time Trend for ${category}`,
          data: lineData,
          fill: false,
          borderColor: "red",
          tension: 0.1,
        },
      ],
    });
    setSelectedCategory(category);
  };

  return (
    <div className="p-6 mt-5 md:p-8 lg:p-10">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* Bar Chart Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-center text-gray-800 mb-6 tracking-wide">
            Bar Chart: <span className="text-red-500">Total Time Spent</span>
          </h2>

          {/* Loading Spinner */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-5xl text-pink-500" />
            </div>
          ) : (
            <div className="h-64 md:h-80 lg:h-96">
              <Bar
                className="cursor-pointer"
                data={getBarChartData()}
                options={{
                  indexAxis: "y", // Makes the bar chart horizontal
                  onClick: (event, elems) => handleBarClick(elems),
                  plugins: {
                    zoom: {
                      pan: {
                        enabled: true,
                        mode: "x",
                      },
                      zoom: {
                        enabled: true,
                        mode: "x",
                      },
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true, // Ensure the bars start from 0
                      grid: {
                        display: true, // Show vertical grid lines
                      },
                      border: {
                        display: false, // Remove outer border for x-axis
                      },
                    },
                    y: {
                      grid: {
                        display: false, // Remove horizontal grid lines
                      },
                      border: {
                        display: false, // Remove outer border for y-axis
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Line Chart Section */}
        {lineChartData.labels && selectedCategory && (
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl md:text-2xl lg:text-3xl text-center font-extrabold text-gray-800 mb-6 tracking-wide">
              Line Chart:{" "}
              <span className="text-pink-600">
                Time Trend for {selectedCategory}
              </span>
            </h2>

            <div className="h-64 md:h-80 lg:h-96">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  plugins: {
                    zoom: {
                      pan: {
                        enabled: true,
                        mode: "x",
                      },
                      zoom: {
                        enabled: true,
                        mode: "x",
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      border: {
                        display: false,
                      },
                      ticks: {
                        maxTicksLimit: 10,
                      },
                    },
                    y: {
                      grid: {
                        display: true,
                      },
                      border: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphComponent;
