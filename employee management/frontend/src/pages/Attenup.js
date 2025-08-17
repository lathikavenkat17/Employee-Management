import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./attenup.css";

function Attenup() {
  useEffect(() => {
    document.title = 'Edit Leave';
  }, []);
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState(null);
  const [teamLeads, setTeamLeads] = useState([]);

  useEffect(() => {
    // Fetch leave
    axios.get(`http://127.0.0.1:8000/api/attendance/leaves/${id}/`)
      .then(res => setLeaveData(res.data))
      .catch(err => console.error('Error fetching leave:', err));

    // Fetch team leads
    axios.get('http://127.0.0.1:8000/api/employee/')
      .then(res => {
        const leads = res.data.filter(emp => emp.role.toLowerCase() === 'team lead');
        setTeamLeads(leads);
      })
      .catch(err => console.error('Error fetching team leads:', err));
  }, [id]);

  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleStatusClick = (status) => {
    if (status === 'approved') {
      setLeaveData({ ...leaveData, status: 'approved' });
    } else if (status === 'rejected') {
      setLeaveData({ ...leaveData, status: 'rejected' });
    }
  };

  const handleUpdate = async () => {
    try {
      const updatePayload = {
        employee_id: leaveData.employee.id,
        leave_type: leaveData.leave_type,
        comment: leaveData.comment, // you can still send comment if you want, but rejection reason is in `reason`
        number_of_days: leaveData.number_of_days,
        start_date: leaveData.start_date,
        end_date: leaveData.end_date,
        status: leaveData.status,
        approve: leaveData.approve || '', // team lead selection
        reason: leaveData.reason || '',    // add this line
      };


      await axios.put(`http://127.0.0.1:8000/api/attendance/leaves/${id}/`, updatePayload);
      alert('Leave updated');
      navigate('/attendance');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update');
    }
  };

  if (!leaveData) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h2 className="headline">Edit Leave</h2>
      <form>
        <label className="form-label">Employee:</label>
        <select disabled className="select-input" value={leaveData.employee.id} readOnly>
          <option value={leaveData.employee.id}>
            {leaveData.employee.id} - {leaveData.employee.firstName} {leaveData.employee.lastName}
          </option>
        </select>

        <label className="form-label">Leave Type:</label>
        <select
          name="leave_type"
          value={leaveData.leave_type}
          onChange={handleChange}
          className="select-input"
        >
          <option value="Causal">Causal</option>
          <option value="Sick">Sick</option>
          <option value="Emergency">Emergency</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <label className="form-label">Number of Days:</label>
        <input
          type="number"
          name="number_of_days"
          value={leaveData.number_of_days}
          onChange={handleChange}
          className="number-input"
        />

        <label className="form-label">Start Date:</label>
        <input
          type="date"
          name="start_date"
          value={leaveData.start_date}
          onChange={handleChange}
          className="date-input"
        />

        <label className="form-label">End Date:</label>
        <input
          type="date"
          name="end_date"
          value={leaveData.end_date}
          onChange={handleChange}
          className="date-input"
        />

        <label className="form-label">Team Lead :</label>
        <select
          name="approve"
          value={leaveData.approve || ''}
          onChange={handleChange}
          className="select-input"
        >
          <option value="">-- Select Team Lead --</option>
          {teamLeads.map((lead) => (
            <option
              key={lead.id}
              value={`${lead.firstName} ${lead.lastName}`}
            >
              {lead.firstName} {lead.lastName}
            </option>
          ))}
        </select>

        <div className="approve-reject-group">
        <button
          type="button"
          onClick={() => handleStatusClick('approved')}
          className={`approve-btn small-btn ${leaveData.status === 'approved' ? 'greyed' : ''}`}
        >
          Approve
        </button>

        <button
          type="button"
          onClick={() => handleStatusClick('rejected')}
          className={`reject-btn small-btn ${leaveData.status === 'rejected' ? 'greyed' : ''}`}
        >
          Reject
        </button>
      </div>

      {leaveData.status === 'rejected' && (
        <div>
          <label className="form-label">Rejection Comment:</label>
          <textarea
            name="reason"                 // <-- change name here
            value={leaveData.reason || ''} // <-- use reason here
            onChange={handleChange}
            rows="3"
            className="textarea-input"
            placeholder="Please provide reason for rejection"
          />
        </div>
      )}

      <div className="action-buttons">
        <button type="button" onClick={handleUpdate} className="update-btn big-btn">
          Update
        </button>
        <button type="button" onClick={() => navigate('/pending')} className="cancel-btn big-btn">
          Cancel
        </button>
      </div>

      </form>
    </div>
  );
}

export default Attenup;
