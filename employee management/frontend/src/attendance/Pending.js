import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './attendance.css';
import './Pending.css';

function Pending({ loggedUser }) {
  useEffect(() => {
    document.title = 'Pending & Rejected Leaves';
  }, []);
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/attendance/leaves/');
        let pendingLeaves = res.data.filter(
          (leave) => leave.status === 'Pending' || leave.status === 'Rejected'
        );
        setLeaves(pendingLeaves);
      } catch (err) {
        console.error('Error fetching leave data:', err);
      }
    };
    fetchLeaves();
  }, [loggedUser]);

  return (
    <div className='complete'>
    <div className="table-container">
      <div className="header-container">
        <div className="left-title">
          <h2>Pending & Rejected Leaves</h2>
        </div>
        {/* ✅ No Add Leave for pending */}
      </div>

      {leaves.length === 0 ? (
        <p>No leave records available.</p>
      ) : (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Leave Type</th>
              <th>Comment</th>
              <th>Days</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.employee.id}</td>
                <td>{leave.employee.firstName}</td>
                <td>{leave.employee.lastName}</td>
                <td>{leave.leave_type}</td>
                <td>{leave.comment}</td>
                <td>{leave.number_of_days}</td>
                <td>{leave.start_date}</td>
                <td>{leave.end_date}</td>
                <td>{leave.status}</td>
                <td>
                  {leave.employee.id === loggedUser.id ? (
                    <button  className="view-button" onClick={() => navigate(`/view-leave/${leave.id}`)}>View</button>
                  ) : leave.status === 'Pending' ? (
                    <button  className="view-button" onClick={() => navigate(`/edit-leave/${leave.id}`)}>Edit</button>
                  ) : (
                    <button  className="view-button" onClick={() => navigate(`/view-leave/${leave.id}`)}>View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}

export default Pending;
