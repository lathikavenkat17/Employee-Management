import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Feedform.css';

function Feedform({ loggedUser }) {
  useEffect(() => {
    document.title = 'Feedback Form';
  }, []);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    performed_by: '',
    month: '',
    year: new Date().getFullYear(),
    comment: '',
    Rating: '',
    manager_approval: 'Pending',
    manager_name: 'Need to view',
    tl_approval: 'Pending',
    tl_name: 'Need to view',
  });

  const years = [];
  for (let y = 2020; y <= 2040; y++) {
    years.push(y);
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/employee/');
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchHrs = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/hr/');
        const data = await res.json();
        setHrs(data);
      } catch (error) {
        console.error('Error fetching HRs:', error);
      }
    };

    fetchEmployees();
    fetchHrs();
  }, []);

  // ✅ Fix: Set performed_by when loggedUser is available
  useEffect(() => {
    if (loggedUser) {
      setFormData((prev) => ({
        ...prev,
        performed_by: `${loggedUser.id} - ${loggedUser.firstName} ${loggedUser.lastName}`,
      }));
    }
  }, [loggedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      employee_id: '',
      performed_by: loggedUser
        ? `${loggedUser.id} - ${loggedUser.firstName} ${loggedUser.lastName}`
        : '',
      month: '',
      year: new Date().getFullYear(),
      comment: '',
      Rating: '',
      manager_approval: 'Pending',
      manager_name: 'Need to view',
      tl_approval: 'Pending',
      tl_name: 'Need to view',
    });
  };

  const handleCancel = () => {
    navigate('/listfeed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', formData);

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/feedback/',
        formData
      );
      console.log('Response:', res);
      if (res.status === 201) {
        alert('Feedback submitted!');
        handleReset();
      }
    } catch (err) {
      console.error('Caught error:', err);

      try {
        if (err.response) {
          console.error('Error response data:', err.response.data);
          alert('Server responded with error: ' + JSON.stringify(err.response.data));
        } else if (err.request) {
          console.error('No response received:', err.request);
          alert('No response received from server.');
        } else if (err.message) {
          console.error('Error message:', err.message);
          alert('Error message: ' + err.message);
        } else {
          alert('Unknown error occurred. See console for details.');
        }
      } catch (innerErr) {
        console.error('Error while handling error:', innerErr);
        alert('Unexpected error occurred. Check console.');
      }
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h1 className="heads">Feedback Form</h1>

      <label className="form-label" htmlFor="employee_id">Employee:</label>
      <select
        id="employee_id"
        name="employee_id"
        className="select-input"
        value={formData.employee_id}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Employee --</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.id} - {emp.firstName} {emp.lastName}
          </option>
        ))}
      </select>

      {loggedUser && (
        <>
          <label className="form-label" htmlFor="employee_display">Performed by:</label>
          <input
            id="employee_display"
            className="employee-display"
            type="text"
            value={`${loggedUser.id} - ${loggedUser.firstName} ${loggedUser.lastName}`}
            readOnly
          />
        </>
      )}

      <label className="form-label" htmlFor="month">Month:</label>
      <select
        id="month"
        name="month"
        className="select-input"
        value={formData.month}
        onChange={handleChange}
        required
      >
        <option value="">-- Select month --</option>
        {[...Array(12).keys()].map((m) => (
          <option key={m + 1} value={m + 1}>
            {new Date(0, m).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>

      <label className="form-label" htmlFor="year">Year:</label>
      <select
        id="year"
        name="year"
        className="select-input"
        value={formData.year}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Year --</option>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <label className="form-label" htmlFor="Rating">Rating:</label>
      <select
        id="Rating"
        name="Rating"
        className="select-input"
        value={formData.Rating}
        onChange={handleChange}
        required
      >
        <option value="">--Select option--</option>
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>

      <label className="form-label" htmlFor="comment">Comment:</label>
      <textarea
        id="comment"
        name="comment"
        className="textarea-input"
        value={formData.comment}
        onChange={handleChange}
        rows="4"
        placeholder="Add your comments here..."
      ></textarea>

      <div className="button-group">
        <button type="submit" className="submit-btn">Submit</button>
        <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
        <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
      </div>
    </form>
  );
}

export default Feedform;
