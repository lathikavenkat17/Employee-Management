import './addemp.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function Addemp() {
  useEffect(() => {
    document.title = 'Add Employee';
  }, []);

  const baseURL = 'http://127.0.0.1:8000/api';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthday: '',
    country: '',
    university: '',
    degree: '',
    department: '',
    phone: '',
    email: '',
    message: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', formData);

    try {
      const response = await fetch(`${baseURL}/employee/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      alert(result.message || 'Submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Submission failed');
    }
  };

  return (
    <form id="form-container" onSubmit={handleSubmit}>
      <h1 id="form-headline">Employee Form</h1>

     <div className="name-row">
  <div className="name-field">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            name="firstName"
            required
            onChange={handleChange}
          />
        </div>

        <div className="name-field">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            name="lastName"
            required
            onChange={handleChange}
          />
        </div>
      </div>

      <label id="label-role" htmlFor="role">Role</label>
      <select
        id="select-role"
        name="role"
        required
        onChange={handleChange}
      >
        <option value="">--Select type--</option>
        <option>Software Developer</option>
        <option>Tester</option>
        <option>Android Developer</option>
        <option>Web Developer</option>
        <option>HR</option>
        <option>Team Lead</option>
        <option>Manager</option>
      </select>

      <label id="label-gender">Gender</label>
      <div id="gender-options">
        <label id="label-gender-male">
          <input
            id="input-gender-male"
            type="radio"
            name="gender"
            value="Male"
            onChange={handleChange}
          />
          Male
        </label>
        <label id="label-gender-female">
          <input
            id="input-gender-female"
            type="radio"
            name="gender"
            value="Female"
            onChange={handleChange}
          />
          Female
        </label>
      </div>

      <label id="label-birthday" htmlFor="birthday">Date of Birth:</label>
      <input
        id="input-birthday"
        type="date"
        name="birthday"
        onChange={handleChange}
      />

      <label id="label-country" htmlFor="country">Country:</label>
      <select
        id="select-country"
        name="country"
        onChange={handleChange}
      >
        <option value="">Select Country</option>
        <option value="Afghanistan">Afghanistan</option>
        <option value="Åland Islands">Åland Islands</option>
        <option value="Monaco">Monaco</option>
        <option value="Mongolia">Mongolia</option>
        <option value="Montenegro">Montenegro</option>
        <option value="Montserrat">Montserrat</option>
        <option value="Morocco">Morocco</option>
        <option value="Mozambique">Mozambique</option>
        <option value="Myanmar">Myanmar</option>
        <option value="Namibia">Namibia</option>
        <option value="Nauru">Nauru</option>
        <option value="Nepal">Nepal</option>
        <option value="Netherlands">Netherlands</option>
        <option value="Netherlands Antilles">Netherlands Antilles</option>
        <option value="New Caledonia">New Caledonia</option>
        <option value="New Zealand">New Zealand</option>
        <option value="Nicaragua">Nicaragua</option>
        <option value="Niger">Niger</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Niue">Niue</option>
        <option value="Norfolk Island">Norfolk Island</option>
        <option value="Northern Mariana Islands">Northern Mariana Islands</option>
        <option value="Norway">Norway</option>
        <option value="Oman">Oman</option>
        <option value="Pakistan">Pakistan</option>
        <option value="Palau">Palau</option>
        <option value="Palestinian Territory, Occupied">
          Palestinian Territory, Occupied
        </option>
        <option value="Panama">Panama</option>
        <option value="Papua New Guinea">Papua New Guinea</option>
        <option value="Paraguay">Paraguay</option>
        <option value="Peru">Peru</option>
      </select>

      <label id="label-university" htmlFor="university">University:</label>
      <input
        id="input-university"
        type="text"
        name="university"
        required
        onChange={handleChange}
      />

      <label id="label-degree" htmlFor="degree">Degree:</label>
      <input
        id="input-degree"
        type="text"
        name="degree"
        required
        onChange={handleChange}
      />

      <label id="label-department" htmlFor="department">Department:</label>
      <input
        id="input-department"
        type="text"
        name="department"
        required
        onChange={handleChange}
      />

      <label id="label-phone" htmlFor="phone">Phone Number:</label>
      <input
        id="input-phone"
        type="tel"
        name="phone"
        onChange={handleChange}
      />

      <label id="label-email" htmlFor="email">Email:</label>
      <input
        id="input-email"
        type="email"
        name="email"
        onChange={handleChange}
      />

      <label id="label-password" htmlFor="password">Password:</label>
      <input
        id="input-password"
        type="password"
        name="password"
        onChange={handleChange}
      />

      <label id="label-message" htmlFor="message">Message:</label>
      <textarea
        id="textarea-message"
        name="message"
        onChange={handleChange}
      />
      <div className="move-right">
      <div id="button-group">
        <button type="submit" id="submit-btn">Submit</button>
        <button
          type="button"
          id="reset-btn"
          onClick={() =>
            setFormData({
              firstName: '',
              lastName: '',
              gender: '',
              birthday: '',
              country: '',
              university: '',
              degree: '',
              department: '',
              phone: '',
              email: '',
              message: '',
              password: '',
            })
          }
        >
          Reset
        </button>
        <button
          id="cancel-btn"
          type="button"
          onClick={() => navigate('/emplist')}
        >
          Cancel
        </button>
      </div>
      </div>
    </form>
  );
}

export default Addemp;
