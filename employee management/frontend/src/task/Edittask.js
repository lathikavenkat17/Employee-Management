import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './edittask.css'; 

export default function Edittask({ onTaskUpdated, onCancel }) {
  useEffect(() => {
    document.title = 'Edit Task';
  }, []);
  const { id: taskId } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    project: '',
    developers: [],
    testers: [],
  });

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

 useEffect(() => {
  axios.get(`http://127.0.0.1:8000/api/tasks/${taskId}/`)
    .then(res => {
      const t = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!t) return;

      const formatDate = (d) => d ? d.split('T')[0] : '';

      setInitialData({
        name: t.name || '',
        description: t.description || '',
        start_date: formatDate(t.start_date),
        end_date: formatDate(t.end_date),
        project: t.project_name || '',  // store name for now
        developers: t.developers ? t.developers.map(dev => dev.id) : [],
        testers: t.testers ? t.testers.map(t => t.id) : [],
      });
    });

  axios.get('http://127.0.0.1:8000/api/employee/')
    .then(res => setEmployees(res.data));

  axios.get('http://127.0.0.1:8000/api/projects/')
    .then(res => setProjects(res.data));
}, [taskId]);

// Now sync formData.project (ID) when initialData and projects are loaded
useEffect(() => {
  if (initialData && projects.length > 0) {
    const project = projects.find(p => p.name === initialData.project);
    setFormData({
      ...initialData,
      project: project ? String(project.id) : '',
    });
  }
}, [initialData, projects]);

  const handleReset = () => {
    if (initialData) setFormData(initialData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

   const payload = {
    name: formData.name,
    description: formData.description,
    start_date: formData.start_date,
    end_date: formData.end_date,
    project_name_id: Number(formData.project),         // use _id suffix
    developers_ids: formData.developers,                // many=True fields, arrays of IDs
    testers_ids: formData.testers,
  };


    axios.put(`http://127.0.0.1:8000/api/tasks/${taskId}/`, payload)
      .then(() => {
        alert('Task updated successfully!');
        if (onTaskUpdated) onTaskUpdated();
        navigate('/listtask');
      })
      .catch(err => {
        console.error('Error updating task:', err.response || err);
        alert('Error updating task.');
      });
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    
    <form id="edit-project-form" onSubmit={handleSubmit}>
      <h2 id="heading-edit-project">Edit Task</h2>

      <label htmlFor="input-name">Task Name:</label>
      <input
        type="text"
        id="input-name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="input-project">Project:</label>
      <select
        id="input-project"
        name="project"
        value={formData.project}
        onChange={handleInputChange}
        required
      >
        <option value="">-- Select Project --</option>
        {projects.map(proj => (
          <option key={proj.id} value={String(proj.id)}>
            {proj.name}
          </option>
        ))}

      </select>


      <label htmlFor="input-description">Description:</label>
      <textarea
        id="input-description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="input-start-date">Start Date:</label>
      <input
        type="date"
        id="input-start-date"
        name="start_date"
        value={formData.start_date}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="input-end-date">End Date:</label>
      <input
        type="date"
        id="input-end-date"
        name="end_date"
        value={formData.end_date}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="select-developers">Developers:</label>
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
      <span key={devId}>
        {dev.firstName} {dev.lastName}
        <button
          type="button"
          onClick={() => setFormData(prev => ({
            ...prev,
            developers: prev.developers.filter(id => id !== devId)
          }))}
        >
          ×
        </button>
      </span>
    ) : null;
  })}
</div>


      <label htmlFor="select-testers">Testers:</label>
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
      <span key={testerId}>
        {tester.firstName} {tester.lastName}
        <button
          type="button"
          onClick={() => setFormData(prev => ({
            ...prev,
            testers: prev.testers.filter(id => id !== testerId)
          }))}
        >
          ×
        </button>
      </span>
    ) : null;
  })}
</div>
      <div id="button-group" style={{ marginTop: '20px' }}>
        <button id="submit-btn" type="submit" style={{ marginRight: '15px' }}>Update</button>
        <button id="reset-btn" type="button" onClick={handleReset} style={{ marginRight: '15px' }}>Reset</button>
        <button
          id="cancel-btn"
          type="button"
          onClick={() => {
            if (onCancel) onCancel();
            else navigate('/listtask');
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
