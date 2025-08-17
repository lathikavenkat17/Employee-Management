import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './listtask.css';
import { exportTasksToPDF, exportTasksToCSV } from './taskexport';

export default function ListTask({ loggedUser }) {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Tasks';
    axios.get('http://127.0.0.1:8000/api/tasks/').then(res => setTasks(res.data));
    axios.get('http://127.0.0.1:8000/api/employee/').then(res => setEmployees(res.data));
    axios.get('http://127.0.0.1:8000/api/projects/').then(res => setProjects(res.data));
  }, []);

  const renderEmployee = (empOrObj) => {
    if (!empOrObj) return '-';
    if (typeof empOrObj === 'object') {
      return `${empOrObj.firstName} ${empOrObj.lastName} (ID: ${empOrObj.id})`;
    }
    const found = employees.find(e => e.id === empOrObj);
    return found ? `${found.firstName} ${found.lastName} (ID: ${found.id})` : `ID: ${empOrObj}`;
  };

  const renderEmployeeList = (list) => {
    if (!list || list.length === 0) return '-';
    return list.map(empOrObj => {
      if (typeof empOrObj === 'object') {
        return `${empOrObj.firstName} ${empOrObj.lastName} (ID: ${empOrObj.id})`;
      }
      const emp = employees.find(e => e.id === empOrObj);
      return emp ? `${emp.firstName} ${emp.lastName} (ID: ${emp.id})` : `ID: ${empOrObj}`;
    }).join(', ');
  };

  const renderProjectName = (projectIdOrName) => {
    if (typeof projectIdOrName === 'number') {
      const project = projects.find(p => p.id === projectIdOrName);
      return project ? `${project.name} (ID: ${project.id})` : `ID: ${projectIdOrName}`;
    }
    return projectIdOrName;
  };

  const role = loggedUser?.role?.toLowerCase() || '';
  const isPrivileged = role.includes('team lead') || role.includes('manager');

  // Pagination
  const indexOfLast = currentPage * tasksPerPage;
  const indexOfFirst = indexOfLast - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <div className="left-align">
      <div style={{ padding: '20px' }}>

        <div className="header-container">
          <div className="left-title">
            <h2>Task List</h2>
          </div>
          <div className="right-link">
            {isPrivileged && (
              <Link to="/addtask" className="addlink">
                <img src="./task.png" alt="Add Icon" />
                <span>Add Task</span>
              </Link>
            )}
          </div>
        </div>

        <div className="export-buttons">
          <button
            className="export-button"
            onClick={() => exportTasksToPDF(tasks, renderProjectName, renderEmployee, renderEmployeeList)}
          >
            Export PDF
          </button>
          <button
            className="export-button"
            onClick={() => exportTasksToCSV(tasks, renderProjectName, renderEmployee, renderEmployeeList)}
          >
            Export CSV
          </button>
        </div>

        <div className="table-responsive">
          <table id="task-table">
            <thead id="task-thead">
              <tr id="task-header-row">
                <th id="th-id">ID</th>
                <th id="th-name">Task Name</th>
                <th id="th-project">Project</th>
                <th id="th-created-by">Created By</th>
                <th id="th-developers">Developers</th>
                <th id="th-testers">Testers</th>
                <th id="th-action">Action</th>
              </tr>
            </thead>
            <tbody id="task-tbody">
              {currentTasks.length > 0 ? (
                currentTasks.map(task => (
                  <tr key={task.id} className="main-row">
                    <td data-label="ID">{task.id}</td>
                    <td data-label="Task Name">{task.name}</td>
                    <td data-label="Project">{renderProjectName(task.project_name)}</td>
                    <td data-label="Created By">{renderEmployee(task.created_by)}</td>
                    <td data-label="Developers">{renderEmployeeList(task.developers)}</td>
                    <td data-label="Testers">{renderEmployeeList(task.testers)}</td>
                    <td data-label="Action">
                      <button
                        className="view-button"
                        onClick={() => navigate(`/edit-task/${task.id}`)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    Loading or No Tasks Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={currentPage === idx + 1 ? 'active' : ''}
            >
              {idx + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
