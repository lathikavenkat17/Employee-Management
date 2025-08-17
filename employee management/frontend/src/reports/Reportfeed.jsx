import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import './reportfeed.css';
import { exportReportToPDF } from './reportexport';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Reportfeed = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/feedback/");
        setFeedbacks(res.data);

        const uniqueYears = [
          ...new Set(res.data.map(item => item.year)),
        ];
        setYears(uniqueYears);

        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Use employee name from nested employee object
  const combinedData = feedbacks.map(feedback => {
    const employee_name = feedback.employee
      ? `${feedback.employee.firstName} ${feedback.employee.lastName}`
      : "Unknown";
    return { ...feedback, employee_name };
  });

  const filteredData = combinedData.filter(
    item =>
      item.year === parseInt(selectedYear) &&
      item.manager_approval === "Approved" &&
      item.tl_approval === "Approved"
  );

  const labels = filteredData.map(item => item.employee_name);
  const ratings = filteredData.map(item => item.Rating ?? 0);

  const generateColors = (num) => {
    const baseColors = [
      "#4f46e5", "#ef4444", "#10b981", "#f59e0b", "#3b82f6",
      "#8b5cf6", "#ec4899", "#22d3ee", "#84cc16", "#f97316",
      "#e11d48", "#0ea5e9", "#14b8a6", "#a78bfa", "#fbbf24"
    ];
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  const colors = generateColors(filteredData.length);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Rating",
        data: ratings,
        backgroundColor: colors,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed.y;
            return `Employee: ${label} | Rating: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 1,
        max: 10,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Rating",
        },
      },
      x: {
        title: {
          display: true,
          text: "Employee Name",
        },
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4" id="name">Employee Feedback Chart</h2>
      <div className="size">
        <label className="mr-2 font-semibold">Select Year:</label>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="border px-2 py-1 mb-4"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <button
          style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
          onClick={() => exportReportToPDF(labels, ratings, selectedYear)}
        >
          Export PDF
        </button>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Reportfeed;
