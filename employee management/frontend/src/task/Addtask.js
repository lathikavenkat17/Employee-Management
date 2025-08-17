import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './addtask.css';
function Addtask({ loggedUser }) {
  useEffect(() => {
    document.title = 'Add Task';
  }, []);

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    project: '',
    description: '',
    start_date: '',
    end_date: '',
    developers: [],
    testers: [],
    createdBy: loggedUser?.id || '',
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/employee/')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Error fetching employees:', err));

    axios.get('http://127.0.0.1:8000/api/projects/')
      .then(res => setProjects(res.data))
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      project_name_id: Number(formData.project),
      developers_ids: formData.developers,
      testers_ids: formData.testers,
      created_by: Number(formData.createdBy),
    };

    axios.post('http://127.0.0.1:8000/api/tasks/', payload)
      .then(() => {
        alert('Task created successfully!');
        setFormData({
          name: '',
          project: '',
          description: '',
          start_date: '',
          end_date: '',
          developers: [],
          testers: [],
          createdBy: loggedUser?.id || '',
        });
        navigate('/listtask');
      })
      .catch((error) => {
        if (error.response) {
          console.error('Response error:', error.response);
        } else if (error.request) {
          console.error('Request error:', error.request);
        } else {
          console.error('Error:', error.message);
        }
      });
  };

  return (
    <div className="move-right">
      <form onSubmit={handleSubmit} id="form-container">
        <h2 id="form-headline">Create Task</h2>

        <label>Task Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </label>

        <label>Project:
          <select name="project" value={formData.project} onChange={handleInputChange} required>
            <option value="">-- Select Project --</option>
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>{proj.name}</option>
            ))}
          </select>
        </label>

        <label>Description:
          <textarea name="description" id="textarea-message" value={formData.description} onChange={handleInputChange} required />
        </label>

        <label>Start Date:
          <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
        </label>

        <label>End Date:
          <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
        </label>

        <label>Developers:
          <select value="" onChange={(e) => {
            const selectedId = Number(e.target.value);
            if (selectedId && !formData.developers.includes(selectedId)) {
              setFormData(prev => ({
                ...prev,
                developers: [...prev.developers, selectedId],
              }));
            }
          }}>
            <option value="">-- Add Developer --</option>
            {employees.filter(emp => !formData.developers.includes(emp.id) && !['Manager', 'Team Lead', 'Tester', 'HR'].includes(emp.role))
              .map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
          </select>
          <div className="selected-tags">
            {formData.developers.map(devId => {
              const dev = employees.find(e => e.id === devId);
              return dev ? (
                <span key={devId} className="tag">
                  {dev.firstName} {dev.lastName}
                  <button type="button" className="remove-tag" onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      developers: prev.developers.filter(id => id !== devId),
                    }));
                  }}>×</button>
                </span>
              ) : null;
            })}
          </div>
        </label>

        <label>Testers:
          <select value="" onChange={(e) => {
            const selectedId = Number(e.target.value);
            if (selectedId && !formData.testers.includes(selectedId)) {
              setFormData(prev => ({
                ...prev,
                testers: [...prev.testers, selectedId],
              }));
            }
          }}>
            <option value="">-- Add Tester --</option>
            {employees.filter(emp => !formData.testers.includes(emp.id) && emp.role === 'Tester')
              .map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
          </select>
          <div className="selected-tags">
            {formData.testers.map(testerId => {
              const tester = employees.find(e => e.id === testerId);
              return tester ? (
                <span key={testerId} className="tag">
                  {tester.firstName} {tester.lastName}
                  <button type="button" className="remove-tag" onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      testers: prev.testers.filter(id => id !== testerId),
                    }));
                  }}>×</button>
                </span>
              ) : null;
            })}
          </div>
        </label>

        <label>Created By:
          <input type="text" value={`${loggedUser?.id || ''} - ${loggedUser?.firstName || ''} ${loggedUser?.lastName || ''}`} readOnly />
        </label>

        <div id="button-group" className='button-groups'>
          <button className='move-right' type="submit" id="submit-btn">Create Task</button>
          <button type="button" id="cancel-btn" onClick={() => navigate('/listtask')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default Addtask;
