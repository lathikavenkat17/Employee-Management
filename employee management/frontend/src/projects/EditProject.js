import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './editproject.css';

export default function EditProject({ onProjectUpdated, onCancel }) {
  useEffect(() => {
    document.title = 'Edit Project';
  }, []);
  useEffect(() => {
    document.title = 'Edit Project';
  }, []);
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    developers: [],
    testers: [],
    teamLead: '',
    manager: '',
  });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
  axios.get(`http://127.0.0.1:8000/api/projects/${projectId}/`)
    .then(res => {
      const p = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!p) {
        console.error('No project found for id:', projectId);
        return;
      }

      const formatDate = (d) => d ? d.split('T')[0] : '';

      const initData = {
        name: p.name || '',
        description: p.description || '',
        start_date: formatDate(p.start_date),
        end_date: formatDate(p.end_date),
        developers: p.developers ? p.developers.map(dev => dev.id) : [],
        testers: p.testers ? p.testers.map(t => t.id) : [],
        teamLead: p.team_lead ? String(p.team_lead.id) : '',
        manager: p.manager ? String(p.manager.id) : '',
      };

      setInitialData(initData);
      setFormData(initData);
    })
    .catch(err => console.error('Error fetching project:', err));

  axios.get('http://127.0.0.1:8000/api/employee/')
    .then(res => setEmployees(res.data))
    .catch(err => console.error('Error fetching employees:', err));
}, [projectId]);

  // Reset form to original data
  const handleReset = () => {
    if (initialData) setFormData(initialData);
  };

  // Handle simple input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add developer from dropdown
  const addDeveloper = (e) => {
    const selectedId = Number(e.target.value);
    if (selectedId && !formData.developers.includes(selectedId)) {
      setFormData(prev => ({
        ...prev,
        developers: [...prev.developers, selectedId],
      }));
    }
    e.target.value = '';
  };

  // Add tester from dropdown
  const addTester = (e) => {
    const selectedId = Number(e.target.value);
    if (selectedId && !formData.testers.includes(selectedId)) {
      setFormData(prev => ({
        ...prev,
        testers: [...prev.testers, selectedId],
      }));
    }
    e.target.value = '';
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      developers: formData.developers,
      testers: formData.testers,
      team_lead: Number(formData.teamLead),
      manager: Number(formData.manager),
    };

    axios.put(`http://127.0.0.1:8000/api/projects/${projectId}/`, payload)
      .then(() => {
        alert('Project updated successfully!');
        if (onProjectUpdated) onProjectUpdated();
        navigate('/listproject');
      })
      .catch(err => {
        console.error('Error updating project:', err.response || err);
        alert('Error updating project.');
      });
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    <form id="edit-project-form" onSubmit={handleSubmit} className="form-container">

      <h2 id="heading-edit-project">Edit Project</h2>

      <label id="label-name" htmlFor="input-name">Project Name:</label>
      <input
        type="text"
        id="input-name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />

      <label id="label-description" htmlFor="input-description">Description:</label>
      <textarea
        id="input-description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        required
      />

      <label id="label-start-date" htmlFor="input-start-date">Start Date:</label>
      <input
        type="date"
        id="input-start-date"
        name="start_date"
        value={formData.start_date}
        onChange={handleInputChange}
        required
      />

      <label id="label-end-date" htmlFor="input-end-date">End Date:</label>
      <input
        type="date"
        id="input-end-date"
        name="end_date"
        value={formData.end_date}
        onChange={handleInputChange}
        required
      />

      <label id="label-developers" htmlFor="select-developers">Developers:</label>
      <select id="select-developers" onChange={addDeveloper} value="">
        <option value="">-- Add Developer --</option>
        {employees
          .filter(emp => !['Manager', 'Team Lead', 'Tester', 'HR'].includes(emp.role))
          .filter(emp => !formData.developers.includes(emp.id))
          .map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
      </select>

      <div id="tags-developers">
        {formData.developers.map(devId => {
          const dev = employees.find(e => e.id === devId);
          return dev ? (
            <span key={devId} style={{ marginRight: '8px' }}>
              {dev.firstName} {dev.lastName}
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  developers: prev.developers.filter(id => id !== devId)
                }))}
                style={{ marginLeft: '4px' }}
              >
                ×
              </button>
            </span>
          ) : null;
        })}
      </div>

      <label id="label-testers" htmlFor="select-testers">Testers:</label>
      <select id="select-testers" onChange={addTester} value="">
        <option value="">-- Add Tester --</option>
        {employees
          .filter(emp => emp.role === 'Tester')
          .filter(emp => !formData.testers.includes(emp.id))
          .map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
      </select>

      <div id="tags-testers">
        {formData.testers.map(testerId => {
          const tester = employees.find(e => e.id === testerId);
          return tester ? (
            <span key={testerId} style={{ marginRight: '8px' }}>
              {tester.firstName} {tester.lastName}
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  testers: prev.testers.filter(id => id !== testerId)
                }))}
                style={{ marginLeft: '4px' }}
              >
                ×
              </button>
            </span>
          ) : null;
        })}
      </div>

      <label id="label-teamLead" htmlFor="select-teamLead">Team Lead:</label>
        <select
        id="select-teamLead"
        name="teamLead"
        value={formData.teamLead}
        onChange={handleInputChange}
        required
        >
        {formData.teamLead === '' && (
            <option value="">-- Select --</option>
        )}

        {/* 👇 Current value from project API */}
        {formData.teamLead !== '' && !employees.some(emp => emp.id === Number(formData.teamLead)) && (
            <option value={formData.teamLead}>
            {initialData.teamLeadName || 'Current Team Lead'}
            </option>
        )}

        {/* 👇 Available employees */}
        {employees
            .filter(emp => emp.role === 'Team Lead')
            .map(emp => (
            <option key={emp.id} value={String(emp.id)}>
                {emp.firstName} {emp.lastName}
            </option>
            ))}
        </select>


      <label id="label-manager" htmlFor="select-manager">Manager:</label>
        <select
        id="select-manager"
        name="manager"
        value={formData.manager}
        onChange={handleInputChange}
        required
        >
        {formData.manager === '' && (
            <option value="">-- Select --</option>
        )}

        {formData.manager !== '' && !employees.some(emp => emp.id === Number(formData.manager)) && (
            <option value={formData.manager}>
            {initialData.managerName || 'Current Manager'}
            </option>
        )}

        {employees
            .filter(emp => emp.role === 'Manager')
            .map(emp => (
            <option key={emp.id} value={String(emp.id)}>
                {emp.firstName} {emp.lastName}
            </option>
            ))}
        </select>


      <div id="button-group" style={{ marginTop: '20px' }}>
        <button id="submit-btn" type="submit" style={{ marginRight: '15px' }}>Update</button>
        <button id="reset-btn" type="button" onClick={handleReset} style={{ marginRight: '15px' }}>Reset</button>
        <button
          id="cancel-btn"
          type="button"
          onClick={() => {
            if (onCancel) onCancel();
            else navigate('/listproject');
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
