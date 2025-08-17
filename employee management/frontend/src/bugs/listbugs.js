import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './listbugs.css'; // reuse the same CSS for consistency
import { exportBugsToPDF, exportBugsToCSV } from './bugexport';

export default function Listbugs({ loggedUser }) {
  useEffect(() => {
    document.title = 'Bug List';
  }, []);

  const [bugs, setBugs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/bugs/')
      .then(res => setBugs(res.data))
      .catch(err => console.error('Error fetching bugs:', err));

    axios.get('http://127.0.0.1:8000/api/employee/')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Error fetching employees:', err));

    axios.get('http://127.0.0.1:8000/api/tasks/')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const renderEmployee = (empId) => {
    const emp = employees.find(e => e.id === empId || e.id === Number(empId));
    return emp ? `${emp.firstName} ${emp.lastName} (ID: ${emp.id})` : `ID: ${empId}`;
  };

  const renderEmployeeList = (list) => {
    if (!list || list.length === 0) return '-';
    return list.map(emp => {
      const e = employees.find(x => x.id === emp || x.id === Number(emp.id));
      if (e) return `${e.firstName} ${e.lastName} (ID: ${e.id})`;
      return typeof emp === 'object'
        ? `${emp.firstName} ${emp.lastName} (ID: ${emp.id})`
        : `ID: ${emp}`;
    }).join(', ');
  };

  const renderTaskName = (taskId) => {
    const t = tasks.find(t => t.id === taskId || t.id === Number(taskId));
    return t ? `${t.name} (ID: ${t.id})` : `ID: ${taskId}`;
  };

  const role = loggedUser?.role?.toLowerCase().trim() || '';
  const isPrivileged = role.includes('tester');

  return (
    <div className="left-align">
      <div style={{ padding: '20px' }} id="bug-list-container">
        <div className="header-container" id="bug-header-container">
          <div className="left-title" id="bug-left-title">
            <h2 id="page-title">Bug List</h2>
          </div>

          <div className="right-link" id="bug-right-link">
            {isPrivileged && (
              <Link to="/addbugs" className="addlink" id="addlink">
                <img src="./bug.png" alt="Add Icon" id="add-icon" />
                <span id="add-text">Add Bug</span>
              </Link>
            )}
          </div>
        </div>
        
          <div className="export-buttons" id="bug-export-buttons">
            <button
              className="export-button"
              id="export-pdf-btn"
              onClick={() => exportBugsToPDF(bugs, renderTaskName, renderEmployeeList, renderEmployee)}
            >
              Export PDF
            </button>

            <button
              className="export-button"
              id="export-csv-btn"
              onClick={() => exportBugsToCSV(bugs, renderTaskName, renderEmployeeList, renderEmployee)}
            >
              Export CSV
            </button>
          </div>

        <div className="table-responsive" id="bug-table-responsive">
          <table id="bug-table">
            <thead id="bug-thead">
              <tr id="bug-header-row">
                <th id="th-id">ID</th>
                <th id="th-title">Title</th>
                <th id="th-task">Task</th>
                <th id="th-priority">Priority</th>
                <th id="th-status">Status</th>
                <th id="th-assigned-to">Assigned To</th>
                <th id="th-assigned-by">Assigned By</th>
                <th id="th-action">Action</th>
              </tr>
            </thead>
            <tbody id="bug-tbody">
              {bugs.map(bug => (
                <tr key={bug.id} className="main-row">
                  <td data-label="ID">{bug.id}</td>
                  <td data-label="Title">{bug.title}</td>
                  <td data-label="Task">{renderTaskName(bug.task)}</td>
                  <td data-label="Priority">{bug.priority}</td>
                  <td data-label="Status">{bug.status}</td>
                  <td data-label="Assigned To">{renderEmployeeList(bug.assigned_to)}</td>
                  <td data-label="Assigned By">{renderEmployee(bug.assigned_by)}</td>
                  <td data-label="Action">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-bugs/${bug.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
