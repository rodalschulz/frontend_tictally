import React, { useEffect, useState } from "react";
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
  "EMPTY",
];

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
          backgroundColor: "rgba(110, 179, 179, 0.35)",
          // borderColor: "rgba(11, 83, 84, 0.25)",
          borderWidth: 0,
        },
        box2: {
          type: "box",
          yScaleID: "y",
          yMin: 440,
          yMax: 400,
          backgroundColor: "rgba(110, 179, 179, 0.35)",
          // borderColor: "rgba(11, 83, 84, 0.25)",
          borderWidth: 0,
        },
        box3: {
          type: "box",
          yScaleID: "y",
          yMin: 620,
          yMax: 580,
          backgroundColor: "rgba(110, 179, 179, 0.35)",
          // borderColor: "rgba(11, 83, 84, 0.25)",
          borderWidth: 0,
        },
        box4: {
          type: "box",
          yScaleID: "y",
          yMin: 810,
          yMax: 770,
          backgroundColor: "rgba(110, 179, 179, 0.35)",
          // borderColor: "rgba(11, 83, 84, 0.25)",
          borderWidth: 0,
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true, // Ensure bars are stacked
      ticks: {
        maxRotation: 90,
        minRotation: 90,
        callback: function (value, index, values) {
          // Hide labels that match "emptyXX"
          const label = this.getLabelForValue(value);
          if (label.startsWith("empty")) {
            return ""; // Return empty string to hide the label
          }
          return label.split("-").reverse().join("-");
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

const options2 = {
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
    // annotation: {
    //   annotations: {
    //     box1: {
    //       type: "box",
    //       yScaleID: "y",
    //       yMin: 250,
    //       yMax: 210,
    //       backgroundColor: "rgba(110, 179, 179, 0.35)",
    //       // borderColor: "rgba(11, 83, 84, 0.25)",
    //       borderWidth: 0,
    //     },
    //     box2: {
    //       type: "box",
    //       yScaleID: "y",
    //       yMin: 440,
    //       yMax: 400,
    //       backgroundColor: "rgba(110, 179, 179, 0.35)",
    //       // borderColor: "rgba(11, 83, 84, 0.25)",
    //       borderWidth: 0,
    //     },
    //     box3: {
    //       type: "box",
    //       yScaleID: "y",
    //       yMin: 620,
    //       yMax: 580,
    //       backgroundColor: "rgba(110, 179, 179, 0.35)",
    //       // borderColor: "rgba(11, 83, 84, 0.25)",
    //       borderWidth: 0,
    //     },
    //     box4: {
    //       type: "box",
    //       yScaleID: "y",
    //       yMin: 810,
    //       yMax: 770,
    //       backgroundColor: "rgba(110, 179, 179, 0.35)",
    //       // borderColor: "rgba(11, 83, 84, 0.25)",
    //       borderWidth: 0,
    //     },
    //   },
    // },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        maxRotation: 90,
        minRotation: 90,
        callback: function (value, index, values) {
          // Hide labels that match "emptyXX"
          const label = this.getLabelForValue(value);
          if (label.startsWith("empty")) {
            return ""; // Return empty string to hide the label
          }
          return label.split("-").reverse().join("-");
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
ChartJS.register(textPlugin);

const StackedBarChart = ({ userActivityData, coreLimits }) => {
  const [showThresholds, setShowThresholds] = useState(true);
  const [configOptions, setConfigOptions] = useState(options);
  const [wasteColor, setWasteColor] = useState(true);

  const toggleThresholds = () => {
    if (showThresholds) {
      setConfigOptions(options2);
      ChartJS.unregister(textPlugin);
    } else {
      setConfigOptions(options);
      ChartJS.register(textPlugin);
    }
    setShowThresholds(!showThresholds);
  };

  const toggleWasteColor = () => {
    const wasteColorWhite = localStorage.getItem("wasteColor");
    if (!wasteColorWhite) {
      localStorage.setItem("wasteColor", "#d9edf9");
      setWasteColor(!wasteColor);
    } else {
      localStorage.removeItem("wasteColor");
      setWasteColor(!wasteColor);
    }
  };

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

  // If there is small amount of data, fill space with blanks
  const totalEntries = Object.keys(aggregatedData).length;
  console.log(totalEntries);
  if (totalEntries < 185) {
    for (let i = 0; i < 150 - totalEntries; i++) {
      aggregatedData[`empty${i}`] = {
        categories: { EMPTY: 1440 },
        coreSubcategories: {},
        total: 1440,
      };
    }
  }

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

  const wasteColorStored = localStorage.getItem("wasteColor");
  // Create datasets for each category
  useEffect(() => {}, [wasteColor]);

  let datasets = categories.map((category) => {
    return {
      label: category,
      data: dates.map((date) =>
        category === "WASTE"
          ? 1440 - (aggregatedData[date].total || 0)
          : aggregatedData[date].categories[category] || 0
      ),
      backgroundColor:
        category === "WASTE"
          ? wasteColorStored || categoryColors[category]
          : categoryColors[category],
      // maxBarThickness: 15,
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

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full">
        <button
          className="absolute bg-custom-databg px-1 rounded-md text-[11px] mt-1 ml-1 text-white"
          onClick={() => toggleThresholds()}
        >
          Thresholds
        </button>
        <button
          className="absolute bg-custom-databg px-1 rounded-md text-[11px] mt-1 ml-20 text-white"
          onClick={() => toggleWasteColor()}
        >
          Waste Color
        </button>
        <Bar data={chartData} options={configOptions} />
      </div>
    </div>
  );
};

export default StackedBarChart;
