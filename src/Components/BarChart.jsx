import React, { useRef, useEffect } from "react";
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

  const data = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    datasets: [
      {
        label: "Sit Laborum",
        data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 85],
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
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
        pointStyle: "circle", // Use circle as the point style
        pointRadius: 5, // Set the radius of the circle
        pointBorderColor: "rgba(54, 162, 235, 1)", // Border color of the circle
        pointBackgroundColor: "rgba(255, 255, 255, 0.6)",
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
        text: "Monthly Sales Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
        <Select width="150px" placeholder="Year 2024">
          <option value="2011">2023</option>
          <option value="2012">2022</option>
          <option value="2013">2021</option>
        </Select>
      </Flex>
      <Bar ref={chartRef} data={data} options={options} />
    </Box>
  );
};

export default BarChart;
