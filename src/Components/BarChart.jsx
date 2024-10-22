import React, { useRef, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Flex, Select, Text } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const chartRef = useRef(null);

  // Get current year and month
  const currentYear = new Date().getFullYear(); // Get current year
  const currentMonth = new Date().getMonth() + 1; // Get current month (0-indexed, so add 1)

  // Define state for year and month selections
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString()); // Set to current month
  const [userLogins, setUserLogins] = useState([]); // State to hold fetched data
  const [error, setError] = useState(null); // State to hold error messages

  // Fetch user login data from API
  const fetchUserLogins = async () => {
    try {
      const response = await fetch(
        `https://oxygenkart-backend.onrender.com/loggedInUser/get?year=${selectedYear}&month=${selectedMonth}`
      );
      const data = await response.json();

      if (response.ok) {
        // Assuming the API returns user count for each month
        const logins = Array(12).fill(0); // Initialize logins for all months

        // If userCount exists, fill the corresponding month
        if (data.userCount !== undefined) {
          logins[selectedMonth - 1] = data.userCount; // Set the user count for the selected month
        }

        setUserLogins(logins); // Set user logins state
        setError(null); // Reset error
      } else {
        setError(data.msg || "Failed to fetch user logins.");
      }
    } catch (error) {
      setError("Failed to fetch user logins.");
      console.error("Error fetching user logins:", error);
    }
  };

  useEffect(() => {
    fetchUserLogins(); // Fetch data whenever year or month is selected
  }, [selectedYear, selectedMonth]);

  // Handle the year selection change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Handle the month selection change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Prepare data for chart based on selected year and month
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ], // Month labels
    datasets: [
      {
        label: "User Logins",
        data: userLogins.length ? userLogins : Array(12).fill(0), // Use fetched data or default to 0
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(153, 102, 255, 0.6)"); // Purple
          gradient.addColorStop(1, "rgba(54, 162, 235, 0.6)"); // Blue
          return gradient;
        },
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `User Logins in ${selectedYear}`,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const month = tooltipItem.label;
            const users = tooltipItem.raw || 0; // Use raw value or 0 if undefined
            return `${month}: ${users} user logins`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Logins",
        },
      },
    },
    barThickness: 30, // Set bar thickness for larger bars
  };

  return (
    <Box width="100%" margin="20px auto">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Statistics
        </Text>
        {/* Year Dropdown */}
        <Select
          width="150px"
          value={selectedYear}
          onChange={handleYearChange}
          placeholder="Select Year"
        >
          <option value={currentYear}>{currentYear}</option>
          <option value={currentYear - 1}>{currentYear - 1}</option>
          <option value={currentYear - 2}>{currentYear - 2}</option>
        </Select>

        {/* Month Dropdown */}
        <Select
          width="150px"
          value={selectedMonth}
          onChange={handleMonthChange}
          placeholder="Select Month"
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </Select>
      </Flex>
      {error && <Text color="red.500">{error}</Text>}{" "}
      {/* Display error if any */}
      {/* Bar chart */}
      <Bar ref={chartRef} data={data} options={options} />
    </Box>
  );
};

export default BarChart;
