import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './viewleave.css';

function ViewLeave({ loggedUser }) {
  useEffect(() => {
    document.title = 'View Leave';
  }, []);
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/attendance/leaves/${id}/`)
      .then((res) => setLeaveData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!leaveData) return <p className="form-container">Loading...</p>;

  const isPrivileged = loggedUser && ['Manager', 'Team Lead', 'HR'].includes(loggedUser.role);

  const handleBack = () => {
    if (
      isPrivileged &&
      leaveData?.employee?.id === loggedUser?.id
    ) {
      navigate('/attendance');
    } else if (isPrivileged) {
      navigate('/pending');
    } else {
      navigate('/attendance');
    }
  };

  return (
    <div className="form-container">
      <h2 className="heads">View Leave</h2>
      <form>
        <label className="form-label">Employee ID:</label>
        <input
          className="text-input"
          type="text"
          value={leaveData.employee.id}
          readOnly
        />

        <label className="form-label">First Name:</label>
        <input
          className="text-input"
          type="text"
          value={leaveData.employee.firstName}
          readOnly
        />

        <label className="form-label">Last Name:</label>
        <input
          className="text-input"
          type="text"
          value={leaveData.employee.lastName}
          readOnly
        />

        <label className="form-label">Leave Type:</label>
        <input
          className="text-input"
          type="text"
          value={leaveData.leave_type}
          readOnly
        />

        <label className="form-label">Comment:</label>
        <textarea
          className="textarea-input"
          value={leaveData.comment}
          readOnly
        />

        <label className="form-label">Number of Days:</label>
        <input
          className="text-input"
          type="number"
          value={leaveData.number_of_days}
          readOnly
        />

        <label className="form-label">Start Date:</label>
        <input
          className="date-input"
          type="date"
          value={leaveData.start_date}
          readOnly
        />

        <label className="form-label">End Date:</label>
        <input
          className="date-input"
          type="date"
          value={leaveData.end_date}
          readOnly
        />

        <label className="form-label">Status:</label>
        <input
          className="text-input"
          type="text"
          value={leaveData.status}
          readOnly
        />

        {leaveData.status === 'rejected' && (
          <>
            <label className="form-label">Rejection Reason:</label>
            <textarea
              className="textarea-input"
              value={leaveData.reason || ''}
              readOnly
            />
          </>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
          }}
        >
          <button
            type="button"
            className="cancel-btn"
            onClick={handleBack}
            style={{
              padding: '16px 40px',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '8px',
            }}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default ViewLeave;
