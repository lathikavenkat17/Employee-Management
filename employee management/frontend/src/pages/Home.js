import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './home.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';
import './home.css';
// Import some icons
import { FaUsers, FaProjectDiagram, FaTasks } from 'react-icons/fa';

function Home({ isLoggedIn, loggedUser }) {
  useEffect(() => {
      document.title = 'Employee Management';
    }, []);
   
  const role = loggedUser?.role?.toLowerCase();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [monthlyTaskData, setMonthlyTaskData] = useState([]);

  useEffect(() => {
    if (role === 'manager' || role === 'team lead' || role === 'hr') {
      // Fetch all employees
      axios.get('http://127.0.0.1:8000/api/employee/')
        .then(res => setEmployeeCount(res.data.length))
        .catch(err => console.error('Failed to fetch employees', err));

      // Fetch all projects
      axios.get('http://127.0.0.1:8000/api/projects/')
        .then(res => {
          setProjectCount(res.data.length);
          const completed = res.data.filter(p => p.status.toLowerCase() === 'completed').length;
          setCompletedProjects(completed);
        })
        .catch(err => console.error('Failed to fetch projects', err));

      // Fetch all tasks
      axios.get('http://127.0.0.1:8000/api/tasks/')
        .then(res => {
          setTaskCount(res.data.length);
          const completed = res.data.filter(t => t.status.toLowerCase() === 'completed').length;
          setCompletedTasks(completed);

          // Prepare monthly chart data
          const monthStatusMap = {};
          res.data.forEach(task => {
            const month = dayjs(task.start_date).format('MMMM YYYY');
            if (!monthStatusMap[month]) {
              monthStatusMap[month] = { Completed: 0, Pending: 0 };
            }
            if (task.status.toLowerCase() === 'completed') {
              monthStatusMap[month].Completed += 1;
            } else {
              monthStatusMap[month].Pending += 1;
            }
          });
          const chartData = Object.entries(monthStatusMap).map(([month, counts]) => ({
            month,
            Completed: counts.Completed,
            Pending: counts.Pending,
          }));
          setMonthlyTaskData(chartData);
        })
        .catch(err => console.error('Failed to fetch tasks', err));

    } else {
      // For developer or tester, fetch only involved projects and tasks

      // Fetch projects where loggedUser is involved
      axios.get(`http://127.0.0.1:8000/api/projects/?userId=${loggedUser.id}`)
        .then(res => {
          // Assuming your backend filters projects by user involvement via userId param
          setProjectCount(res.data.length);
          const completed = res.data.filter(p => p.status.toLowerCase() === 'completed').length;
          setCompletedProjects(completed);
        })
        .catch(err => console.error('Failed to fetch user projects', err));

      // Fetch tasks where loggedUser is involved
      axios.get(`http://127.0.0.1:8000/api/tasks/?userId=${loggedUser.id}`)
        .then(res => {
          setTaskCount(res.data.length);
          const completed = res.data.filter(t => t.status.toLowerCase() === 'completed').length;
          setCompletedTasks(completed);

          // Monthly chart data for user's tasks only
          const monthStatusMap = {};
          res.data.forEach(task => {
            const month = dayjs(task.start_date).format('MMMM YYYY');
            if (!monthStatusMap[month]) {
              monthStatusMap[month] = { Completed: 0, Pending: 0 };
            }
            if (task.status.toLowerCase() === 'completed') {
              monthStatusMap[month].Completed += 1;
            } else {
              monthStatusMap[month].Pending += 1;
            }
          });
          const chartData = Object.entries(monthStatusMap).map(([month, counts]) => ({
            month,
            Completed: counts.Completed,
            Pending: counts.Pending,
          }));
          setMonthlyTaskData(chartData);
        })
        .catch(err => console.error('Failed to fetch user tasks', err));
    }
  }, [role, loggedUser]);

  const taskCompletionRate = taskCount ? Math.round((completedTasks / taskCount) * 100) : 0;
  const projectCompletionRate = projectCount ? Math.round((completedProjects / projectCount) * 100) : 0;

  return (
    <div className="wel">
      <br />
      {isLoggedIn && loggedUser ? (
        <p className="welcome">Welcome, {loggedUser.firstName} {loggedUser.lastName}!</p>
      ) : (
        <p>Welcome, Guest!</p>
      )}

      <div className="overall-box">
        <div className="top-stats-grid">
          {(role === 'manager' || role === 'team lead' || role === 'hr') && (
            <div className="stat-box">
              <img src="./business.png" alt="Logo" className="logo" />
              <h4>Total Employees</h4>
              <strong>{employeeCount}</strong>
            </div>
          )}

          <div className="stat-box">
            <img src="./projecthome.png" alt="Logo" className="logo" />
            <h4>Total Projects</h4>
            <strong>{projectCount}</strong>
          </div>
          <div className="stat-box">
            <img src="./taskhome.png" alt="Logo" className="logo" />
            <h4>Total Tasks</h4>
            <strong>{taskCount}</strong>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-item-box">
            <h4>Task Completion</h4>
            <div className="progress-item">
              <CircularProgressbar
                value={taskCompletionRate}
                text={`${taskCompletionRate}%`}
                styles={buildStyles({
                  pathColor: `#0080fd`,
                  textColor: '#333',
                  trailColor: 'white',
                })}
              />
              <p>{completedTasks} of {taskCount} tasks completed</p>
            </div>
          </div>

          <div className="dashboard-item-box">
            <h4>Project Completion</h4>
            <div className="progress-item">
              <CircularProgressbar
                value={projectCompletionRate}
                text={`${projectCompletionRate}%`}
                styles={buildStyles({
                  pathColor: `#0080fd`,
                  textColor: '#333',
                  trailColor: 'white',
                })}
              />
              <p>{completedProjects} of {projectCount} projects completed</p>
            </div>
          </div>

          <div className="dashboard-item-box bar-chart-wrapper">
            <h4 style={{ textAlign: 'center' }}>Tasks per Month (Completed vs Pending)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyTaskData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completed" stackId="a" fill="#6dbfb8" />
                <Bar dataKey="Pending" stackId="a" fill="#afdcff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
 // Ensure this is the correct path to your CSS file