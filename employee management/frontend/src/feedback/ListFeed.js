import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './listfeed.css';
import { exportFeedbackToPDF, exportFeedbackToCSV } from './exportfeed';

function FeedbackList({ loggedUser }) {
  useEffect(() => {
    document.title = 'Feedback List';
  }, []);

  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/feedback/');
        const sorted = res.data.sort((a, b) => {
          const dateA = new Date(`${a.last_modified_date}T${a.last_modified_time}`);
          const dateB = new Date(`${b.last_modified_date}T${b.last_modified_time}`);
          return dateB - dateA;
        });
        setFeedbacks(sorted);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      }
    };
    fetchData();
  }, []);

  const isHR = loggedUser?.role?.toLowerCase() === 'hr';

  const indexOfLast = currentPage * tasksPerPage;
  const indexOfFirst = indexOfLast - tasksPerPage;
  const currentTasks = feedbacks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(feedbacks.length / tasksPerPage);

  if (feedbacks.length === 0) {
    return (
      <div className="left-align">
        <div style={{ padding: '20px' }}>
          <h2>Feedback List</h2>
          <p>No feedback records available.</p>
          {isHR && <Link to="/Feedform" className="addlink">Add Feedback</Link>}
        </div>
      </div>
    );
  }

  return (
    <div className="left-align">
      <div style={{ padding: '20px' }}>
        <div className="header-container">
          <div className="left-title">
            <h2>Feedback List</h2>
          </div>
          {isHR && (
            <div className="right-link">
              <Link to="/Feedform" className="addlink">
                <img src="/feedback.png" alt="Add Icon" />
                <span>Add Feedback</span>
              </Link>
            </div>
          )}
        </div>

        <div className="export-buttons">
          <button className="export-button" onClick={() => exportFeedbackToPDF(feedbacks)}>
            Export PDF
          </button>
          <button className="export-button" onClick={() => exportFeedbackToCSV(feedbacks)}>
            Export CSV
          </button>
        </div>

        <div className="table-responsive">
          <table id="feedback-table">
            <thead id="feedback-thead">
              <tr id="feedback-header-row">
                <th id="th-id">ID</th>
                <th id="th-employee">Employee</th>
                <th id="th-manager-approval">Manager Approval</th>
                <th id="th-tl-approval">TL Approval</th>
                <th id="th-performed-by">Performed By</th>
                <th id="th-rating">Rating</th>
                <th id="th-year">Year</th>
                <th id="th-month">Month</th>
                <th id="th-action">Action</th>
              </tr>
            </thead>
            <tbody id="feedback-tbody">
              {currentTasks.map(fb => (
                <tr key={fb.id} className="main-row">
                  <td data-label="ID">{fb.employee.id}</td>
                  <td data-label="Employee">{fb.employee.firstName} {fb.employee.lastName}</td>
                  <td data-label="Manager Approval">{fb.manager_approval}</td>
                  <td data-label="TL Approval">{fb.tl_approval}</td>
                  <td data-label="Performed By">{fb.performed_by}</td>
                  <td data-label="Rating">{fb.Rating}</td>
                  <td data-label="Year">{fb.year}</td>
                  <td data-label="Month">{fb.month}</td>
                  <td data-label="Action">
                    <button className="view-button" onClick={() => navigate(`/feedback/Viewfeed/${fb.id}`)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
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

export default FeedbackList;
