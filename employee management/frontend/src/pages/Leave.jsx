import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './leave.css';

function Leave({ loggedUser, onLeaveAdded }) {
  useEffect(() => {
    document.title = 'Submit Leave';
  }, []);
  const navigate = useNavigate();

  //  Always define today in YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: '',
    comment: '',
    number_of_days: '0',
    start_date: today,   //  default value is today
    end_date: today,     //  default value is today
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    if (name === 'start_date' || name === 'end_date') {
      const start = new Date(name === 'start_date' ? value : updatedFormData.start_date);
      const end = new Date(name === 'end_date' ? value : updatedFormData.end_date);

      if (!isNaN(start) && !isNaN(end) && end >= start) {
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        updatedFormData.number_of_days = diffDays;
      } else {
        updatedFormData.number_of_days = 0;
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = loggedUser?.role?.toLowerCase() || '';

      const payload = {
        ...formData,
        employee_id: loggedUser.id,
        status:
          role.includes('manager') || role.includes('team lead')
            ? 'Approved'
            : undefined,
      };

      await axios.post('http://127.0.0.1:8000/api/attendance/leaves/', payload);
      alert('Leave submitted successfully');

      // ✅ Reset back to today
      setFormData({
        employee_id: '',
        leave_type: '',
        comment: '',
        number_of_days: '0',
        start_date: today,
        end_date: today,
      });

      navigate('/home');
      onLeaveAdded && onLeaveAdded();
    } catch (err) {
      console.error('Error submitting leave', err);
      alert('Failed to submit leave');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="heads">Submit Leave</h2>
      {loggedUser && (
        <>
          <label className="form-label" htmlFor="employee_display">
            Employee:
          </label>
          <input
            id="employee_display"
            className="employee-display"
            type="text"
            value={`${loggedUser.id} - ${loggedUser.firstName} ${loggedUser.lastName}`}
            readOnly
          />
        </>
      )}

      <label className="form-label" htmlFor="leave_type">
        Leave Type:
      </label>
      <select
        id="leave_type"
        name="leave_type"
        className="select-input"
        value={formData.leave_type}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Type --</option>
        <option value="Causal">Causal</option>
        <option value="Sick">Sick</option>
        <option value="Emergency">Emergency</option>
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
      </select>

      <label className="form-label" htmlFor="comment">
        Comment:
      </label>
      <textarea
        id="comment"
        name="comment"
        className="textarea-input"
        value={formData.comment}
        onChange={handleChange}
      />

      <label className="form-label" htmlFor="start_date">
        Start Date:
      </label>
      <input
        id="start_date"
        type="date"
        name="start_date"
        className="date-input"
        value={formData.start_date} //  bound to correct value
        onChange={handleChange}
        min={today}
        required
      />

      <label className="form-label" htmlFor="end_date">
        End Date:
      </label>
      <input
        id="end_date"
        type="date"
        name="end_date"
        className="date-input"
        value={formData.end_date} // ✅ bound to correct value
        onChange={handleChange}
        required
      />

      <label className="form-label" htmlFor="number_of_days">
        Number of Days:
      </label>
      <input
        id="number_of_days"
        type="number"
        name="number_of_days"
        className="text-input"
        value={formData.number_of_days}
        readOnly
      />

      <div className="button-group">
        <button type="submit" className="submit-btn">
          Submit
        </button>
        <button
          type="button"
          id="reset-btn"
          className="reset-btn"
          onClick={() =>
            setFormData({
              employee_id: '',
              leave_type: '',
              comment: '',
              number_of_days: '0',
              start_date: today, //  reset to today
              end_date: today, //  reset to today
            })
          }
        >
          Reset
        </button>
        <button
          className="cancel-btn"
          type="button"
          onClick={() => navigate('/attendance')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default Leave;
