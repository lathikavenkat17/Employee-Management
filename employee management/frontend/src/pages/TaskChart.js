import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';

function TaskChart() {
  useEffect(() => {
    document.title = 'Tasks chart';
  }, []);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/tasks/')
      .then(res => {
        const rawTasks = res.data;

        // Count tasks by month
        const monthMap = {};

        rawTasks.forEach(task => {
          const month = dayjs(task.start_date).format('MMMM YYYY');
          if (!monthMap[month]) {
            monthMap[month] = 0;
          }
          monthMap[month]++;
        });

        // Convert to chart format
        const formattedData = Object.entries(monthMap).map(([month, count]) => ({
          month,
          tasks: count
        }));

        setMonthlyData(formattedData);
      })
      .catch(err => console.error('Error fetching task data:', err));
  }, []);

  return (
    <div style={{ width: '100%', height: 400, padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Tasks per Month</h3>
      <ResponsiveContainer>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="tasks" fill="#8884d8" name="Number of Tasks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TaskChart;
