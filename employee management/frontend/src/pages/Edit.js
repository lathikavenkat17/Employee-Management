import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './edit.css'
function Edit() {
  useEffect(() => {
    document.title = 'Edit Employee';
  }, []);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/employee/${id}/`)
      .then(res => res.json())
      .then(data => setFormData(data))
      .catch(err => console.error('Error fetching employee:', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/employee/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (res.ok) {
          alert('Employee updated!');
          navigate('/emplist');
        } else {
          alert('Update failed.');
        }
      })
      .catch(err => console.error('Update error:', err));
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="form-container">
  <h2 className="heads">Edit Employee</h2>
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      name="firstName"
      value={formData.firstName}
      onChange={handleChange}
      placeholder="First Name"
      required
      className="text-input"
    />
    <input
      type="text"
      name="role"
      value={formData.role}
      onChange={handleChange}
      placeholder="Role"
      required
      className="text-input"
    />
    <input
      type="text"
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      placeholder="Gender"
      required
      className="text-input"
    />
    <input
      type="date"
      name="birthday"
      value={formData.birthday}
      onChange={handleChange}
      className="date-input"
    />
    <input
      type="text"
      name="country"
      value={formData.country}
      onChange={handleChange}
      placeholder="Country"
      className="text-input"
    />
    <input
      type="text"
      name="university"
      value={formData.university}
      onChange={handleChange}
      placeholder="University"
      className="text-input"
    />
    <input
      type="text"
      name="degree"
      value={formData.degree}
      onChange={handleChange}
      placeholder="Degree"
      className="text-input"
    />
    <input
      type="text"
      name="department"
      value={formData.department}
      onChange={handleChange}
      placeholder="Department"
      className="text-input"
    />
    <input
      type="text"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="Phone"
      className="tel-input"
    />
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Email"
      className="emails-input"
    />

    <div className="button-group">
      <button type="submit" className="submit-btn">
        Update
      </button>
      <button type="button" className="cancel-btn" onClick={() => navigate('/emplist')}>
        Cancel
      </button>
    </div>
  </form>
</div>
  );
}

export default Edit;
