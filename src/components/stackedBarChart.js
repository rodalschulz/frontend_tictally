import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
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
  Legend,
  annotationPlugin
);

// Custom plugin to draw text on the chart
const textPlugin = {
  id: "textPlugin",
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = "10px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    // Text 1
    ctx.fillText(
      "4 hours",
      chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2,
      chart.scales.y.getPixelForValue(227)
    );

    // Text 2
    ctx.fillText(
      "7 hours",
      chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2,
      chart.scales.y.getPixelForValue(417)
    );

    // Text 3
    ctx.fillText(
      "10 hours",
      chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2,
      chart.scales.y.getPixelForValue(598)
    );

    // Text 4
    ctx.fillText(
      "13 hours",
      chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2,
      chart.scales.y.getPixelForValue(790)
    );

    ctx.restore();
  },
};
ChartJS.register(textPlugin);

const backgroundColorPlugin = {
  id: "backgroundColorPlugin",
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.fillStyle = "rgba(217, 237, 249, 1)";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};
ChartJS.register(backgroundColorPlugin);

const categoryColors = {
  WORK: "#1D6667",
  LEARN: "#23BAAE",
  BUILD: "#2980B9",
  GENERAL: "#B7950B",
  RECOVERY: "#748586",
  CORE: "#D2D2D2",
  WASTE: "#740000",
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

const StackedBarChart = ({ userActivityData, coreLimits }) => {
  // Aggregate data by date and category
  const aggregatedData = userActivityData.reduce((acc, item) => {
    const date = item.date.slice(0, 10);
    if (!acc[date]) {
      acc[date] = { total: 0, categories: {}, coreSubcategories: {} };
    }
    if (item.category === "CORE") {
      const subcategory = item.subcategory;
      const time = Math.min(
        item.totalTimeMin,
        coreLimits[subcategory] || item.totalTimeMin
      );
      if (!acc[date].coreSubcategories[subcategory]) {
        acc[date].coreSubcategories[subcategory] = 0;
      }
      acc[date].coreSubcategories[subcategory] += time;
    } else {
      if (!acc[date].categories[item.category]) {
        acc[date].categories[item.category] = 0;
      }
      acc[date].categories[item.category] += item.totalTimeMin;
    }
    return acc;
  }, {});

  // Calculate total time for CORE category and overall total
  Object.keys(aggregatedData).forEach((date) => {
    const coreTotal = Object.values(
      aggregatedData[date].coreSubcategories
    ).reduce((a, b) => a + b, 0);
    aggregatedData[date].categories.CORE = coreTotal;
    aggregatedData[date].total = Object.values(
      aggregatedData[date].categories
    ).reduce((a, b) => a + b, 0);
  });

  // Extract dates and categories
  const dates = Object.keys(aggregatedData).sort();
  const categories = Array.from(
    new Set(userActivityData.map((item) => item.category.replace(/-.*$/, "")))
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
          : aggregatedData[date].categories[category] || 0
      ),
      backgroundColor: categoryColors[category],
      maxBarThickness: 15,
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
    maintainAspectRatio: false,
    animation: false,
    backgroundColorPlugin: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Daily Activity Time by Category",
      },
      annotation: {
        annotations: {
          box1: {
            type: "box",
            yScaleID: "y",
            yMin: 250,
            yMax: 210,
            backgroundColor: "rgba(110, 179, 179, 0.5)",
            // borderColor: "rgba(11, 83, 84, 0.25)",
            borderWidth: 0,
          },
          box2: {
            type: "box",
            yScaleID: "y",
            yMin: 440,
            yMax: 400,
            backgroundColor: "rgba(110, 179, 179, 0.5)",
            // borderColor: "rgba(11, 83, 84, 0.25)",
            borderWidth: 0,
          },
          box3: {
            type: "box",
            yScaleID: "y",
            yMin: 620,
            yMax: 580,
            backgroundColor: "rgba(110, 179, 179, 0.5)",
            // borderColor: "rgba(11, 83, 84, 0.25)",
            borderWidth: 0,
          },
          box4: {
            type: "box",
            yScaleID: "y",
            yMin: 810,
            yMax: 770,
            backgroundColor: "rgba(110, 179, 179, 0.5)",
            // borderColor: "rgba(11, 83, 84, 0.25)",
            borderWidth: 0,
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          callback: function (value, index, values) {
            return this.getLabelForValue(value).split("-").reverse().join("-");
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        min: 0,
        max: 1440,
        ticks: {
          stepSize: 120,
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StackedBarChart;
