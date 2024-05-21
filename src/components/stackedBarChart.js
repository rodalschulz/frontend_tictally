import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useParams } from "react-router-dom";
import * as SDK from "../sdk_backend_fetch.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const categoryColors = {
  WORK: "rgba(54, 162, 235, 0.6)",
  LEARN: "rgba(153, 102, 255, 0.6)",
  BUILD: "rgba(255, 159, 64, 0.6)",
  GENERAL: "rgba(75, 192, 192, 0.6)",
  RECOVERY: "rgba(255, 99, 132, 0.6)",
  CORE: "rgba(255, 206, 86, 0.6)",
  WASTE: "rgba(201, 203, 207, 0.6)",
};

const categoryOrder = [
  "WORK",
  "LEARN",
  "BUILD",
  "GENERAL",
  "RECOVERY",
  "CORE",
  "WASTE",
];

const StackedBarChart = () => {
  const { userId } = useParams();

  // USER ACTIVITY DATA
  const [userActivityData, setUserActivityData] = useState([]);

  const fetchUserActivityData = async () => {
    try {
      const data = await SDK.getUserActivityData(userId);
      setUserActivityData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserActivityData();
  }, [userId]);

  // Aggregate data by date and category
  const aggregatedData = userActivityData.reduce((acc, item) => {
    const date = item.date.slice(0, 10);
    if (!acc[date]) {
      acc[date] = { total: 0 }; // Initialize total for the date
    }
    if (!acc[date][item.category]) {
      acc[date][item.category] = 0;
    }
    acc[date][item.category] += item.totalTimeMin;
    acc[date].total += item.totalTimeMin; // Sum the total time for the date
    return acc;
  }, {});

  // Extract dates and categories
  const dates = Object.keys(aggregatedData).sort();
  const categories = Array.from(
    new Set(userActivityData.map((item) => item.category))
  );

  // Add the implicit "waste" category
  categories.push("WASTE");

  // Create datasets for each category
  let datasets = categories.map((category) => {
    return {
      label: category,
      data: dates.map((date) =>
        category === "WASTE"
          ? 1440 - (aggregatedData[date].total || 0)
          : aggregatedData[date][category] || 0
      ),
      backgroundColor: categoryColors[category] || "rgba(201, 203, 207, 0.6)", // Default color if category not found
      borderColor: categoryColors[category] || "rgba(201, 203, 207, 1)",
      borderWidth: 1,
    };
  });

  // Sort datasets according to the predefined category order
  datasets = datasets.sort(
    (a, b) => categoryOrder.indexOf(a.label) - categoryOrder.indexOf(b.label)
  );

  const chartData = {
    labels: dates,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Activity Time by Category per Day",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className="">
      <div className="">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StackedBarChart;
