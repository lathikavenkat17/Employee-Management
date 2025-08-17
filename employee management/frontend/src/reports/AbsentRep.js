import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import './AbsentRep.css';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { exportAbsentToPDF } from './absentexport';
ChartJS.register(ArcElement, Tooltip, Legend);

function AbsentRep() {
  useEffect(() => {
    document.title = 'Leave Report';
  }, []);
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/attendance/leaves/')  // Replace with your API endpoint
      .then(res => res.json())
      .then(data => setLeaveData(data))
      .catch(err => console.error('Error fetching leave data:', err));
  }, []);

  // Aggregate total leave days per employee (full name as key)
  const aggregated = leaveData.reduce((acc, record) => {
    const employeeName = `${record.employee.firstName} ${record.employee.lastName}`;
    const days = record.number_of_days || 0;
    acc[employeeName] = (acc[employeeName] || 0) + days;
    return acc;
  }, {});

  const labels = Object.keys(aggregated);
  const dataValues = Object.values(aggregated);

  // Generate distinct colors for each employee slice (repeat if > 6 employees)
  const colors = [
    'rgba(255, 99, 132, 0.6)',   // red
    'rgba(54, 162, 235, 0.6)',   // blue
    'rgba(255, 206, 86, 0.6)',   // yellow
    'rgba(75, 192, 192, 0.6)',   // teal
    'rgba(153, 102, 255, 0.6)',  // purple
    'rgba(255, 159, 64, 0.6)',   // orange
  ];
  // If employees > colors length, cycle colors
  const backgroundColors = labels.map((_, i) => colors[i % colors.length]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Leave Days',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Leave Records by Employee</h2>
      <button
        style={{ marginBottom: '10px', padding: '5px 10px', cursor: 'pointer' }}
        onClick={() => exportAbsentToPDF(labels, dataValues)}
      >
        Export PDF
      </button>
      <div className="piesize">
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default AbsentRep;