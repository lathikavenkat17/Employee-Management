import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './addbugs.css';

function Addbugs({ loggedUser }) {
  useEffect(() => {
    document.title = 'Add Bug';
  }, []);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);


  // Initial formdata state
  const [formdata, setFormdata] = useState({
    title: '',
    task: '',
    description: '',
    assigned_to: [],
    priority: '',
    status: 'Open',  // default Open
    comments: '',
    assigned_by: loggedUser.id
  });


  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/tasks/')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormdata(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'task') {
      const selectedTask = tasks.find(t => t.id.toString() === value);
      if (selectedTask) {
        setEmployees(Array.isArray(selectedTask.developers) ? selectedTask.developers : []);
      } else {
        setEmployees([]);
      }
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append('title', formdata.title);
  formData.append('task', formdata.task);
  formData.append('description', formdata.description);
  formdata.assigned_to.forEach(id => formData.append('assigned_to', id));
  formData.append('priority', formdata.priority);
  formData.append('status', formdata.status);
  formData.append('comments', formdata.comments);
  formData.append('assigned_by', loggedUser.id);

  images.forEach((image) => {
    formData.append('images', image);
  });

  axios.post('http://127.0.0.1:8000/api/bugs/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(res => {
      const newBug = res.data;
      const bugId = newBug.id;

      const historyPayload = {
        bug: bugId,
        name: `${loggedUser.firstName} ${loggedUser.lastName}`,
        status: formdata.status,
        comments: formdata.comments,
        title: formdata.title
      };

      return axios.post('http://127.0.0.1:8000/api/bug-history/', historyPayload);
    })
    .then(() => {
      alert('Bug raised successfully!');
      setFormdata({
        title: '',
        task: '',
        description: '',
        assigned_to: [],
        priority: '',
        status: '',
        comments: '',
        assigned_by: loggedUser.id
      });
      setImages([]);
      setEmployees([]);
      navigate('/listbugs');
    })
    .catch(error => {
      if (error.response) {
        console.log('Error response data:', error.response.data);
      } else if (error.request) {
        console.log('Error request:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
    });
};


  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="heads">Raise Bug</h2>

        <label className="form-label">
          Title:
          <input
            type="text"
            name="title"
            value={formdata.title}
            onChange={handleInputChange}
            className="text-input"
            required
          />
        </label>

        <label className="form-label">
          Task:
          <select
            name="task"
            value={formdata.task}
            onChange={handleInputChange}
            className="select-input"
            required
          >
            <option value="">--Select Task--</option>
            {tasks.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Upload Images:
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            className="file-input"
          />
        </label>

        <label className="form-label">
          Description:
          <textarea
            name="description"
            value={formdata.description}
            onChange={handleInputChange}
            className="textarea-input"
            required
          />
        </label>

        <label className="form-label">
          Assigned To:
          <select
            className="select-input"
            value=""
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              if (selectedId && !formdata.assigned_to.includes(selectedId)) {
                setFormdata(prev => ({
                  ...prev,
                  assigned_to: [...prev.assigned_to, selectedId],
                }));
              }
            }}
          >
            <option value="">-- Add Developer --</option>
            {employees
              .filter(emp => !formdata.assigned_to.includes(emp.id))
              .map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
          </select>

          <div className="selected-tags">
            {formdata.assigned_to.map(devId => {
              const dev = employees.find(e => e.id === devId);
              if (!dev) return null;
              return (
                <span key={devId} className="tag">
                  {dev.firstName} {dev.lastName}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => {
                      setFormdata(prev => ({
                        ...prev,
                        assigned_to: prev.assigned_to.filter(id => id !== devId),
                      }));
                    }}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </label>

        <label className="form-label">
          Priority:
          <select
            name="priority"
            value={formdata.priority}
            onChange={handleInputChange}
            className="select-input"
            required
          >
            <option value="">--Select Priority--</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Critical">Critical</option>
            <option value="Low">Low</option>
          </select>
        </label>

        <label className="form-label">
          Status:
          <input
            type="text"
            name="status"
            value="Open"
            readOnly
            className="text-input"
          />
        </label>


        <label className="form-label">
          Comments:
          <textarea
            name="comments"
            value={formdata.comments}
            onChange={handleInputChange}
            className="textarea-input"
          />
        </label>

        <div className="button-container">
          <button type="submit" className="submit-btn">Submit</button>
          <button
            type="button"
            onClick={() => navigate('/listbugs')}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Addbugs;
