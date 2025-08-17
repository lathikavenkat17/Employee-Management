import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './editbugs.css';
import { Image } from 'primereact/image';

export default function EditBugs({ loggedUser }) {
  useEffect(() => {
    document.title = 'Edit Bug';
  }, []);
  const role = loggedUser?.role?.toLowerCase() || '';
  const isPrivileged = role.includes('tester');
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [sliderIndices, setSliderIndices] = React.useState({});
  // Add these two lines for zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const { id: bugId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [history, setHistory] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    task: '',
    description: '',
    assigned_to: [],
    priority: '',
    status: '',
    comments: '',
    assigned_by: '',
  });

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/bugs/${bugId}/`)
      .then(res => {
        const bug = res.data;
        let taskId = bug.task_id || '';
        if (!taskId && bug.task) {
          taskId = bug.task;
        }
        setInitialData({
          title: bug.title || '',
          task: taskId,
          description: bug.description || '',
          assigned_to: bug.assigned_to_ids 
            || (Array.isArray(bug.assigned_to) ? bug.assigned_to.map(a => a.id) : []),
          priority: bug.priority || '',
          status: bug.status || '',
          comments: bug.comments || '',
          assigned_by: bug.assigned_by || loggedUser?.id
        });
      })
      .catch(err => console.error('Error fetching bug:', err));

    axios.get('http://127.0.0.1:8000/api/tasks/')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, [bugId, loggedUser]);

  useEffect(() => {
    if (initialData?.title) {
      axios.get(`http://127.0.0.1:8000/api/bug-history/?bug=${bugId}&title=${encodeURIComponent(initialData.title)}`)
        .then(res => setHistory(res.data))
        .catch(err => console.error('Error fetching history:', err));
    }
  }, [initialData, bugId]);

  useEffect(() => {
    if (initialData && tasks.length > 0 && isNaN(Number(initialData.task))) {
      const match = tasks.find(t => t.name === initialData.task);
      if (match) {
        setFormData(prev => ({
          ...prev,
          ...initialData,
          task: match.id
        }));
      } else {
        setFormData(initialData);
      }
    } else if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, tasks]);

  useEffect(() => {
    if (formData.task) {
      const selectedTask = tasks.find(t => t.id === Number(formData.task));
      if (selectedTask) {
        setEmployees(Array.isArray(selectedTask.developers) ? selectedTask.developers : []);
      } else {
        setEmployees([]);
      }
    } else {
      setEmployees([]);
    }
  }, [formData.task, tasks]);

  const prevImage = (entryId, length) => {
    setSliderIndices(prev => {
      const currentIndex = prev[entryId] ?? 0;
      return {
        ...prev,
        [entryId]: (currentIndex - 1 + length) % length,
      };
    });
  };

  const nextImage = (entryId, length) => {
    setSliderIndices(prev => {
      const currentIndex = prev[entryId] ?? 0;
      return {
        ...prev,
        [entryId]: (currentIndex + 1) % length,
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'task') {
      const selectedTask = tasks.find(t => t.id.toString() === value);
      if (selectedTask) {
        setEmployees(Array.isArray(selectedTask.developers) ? selectedTask.developers : []);
      } else {
        setEmployees([]);
      }
      setFormData(prev => ({
        ...prev,
        assigned_to: []
      }));
    }
  };

  const addDeveloper = (e) => {
    const selectedId = Number(e.target.value);
    if (selectedId && !formData.assigned_to.includes(selectedId)) {
      setFormData(prev => ({
        ...prev,
        assigned_to: [...prev.assigned_to, selectedId]
      }));
    }
    e.target.value = '';
  };

  const handleReset = () => {
    if (initialData) setFormData(initialData);
    setSelectedImages([]);  // Also clear selected images on reset
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('task_id', Number(formData.task));
    data.append('description', formData.description);
    formData.assigned_to.forEach(id => data.append('assigned_to_ids', id));
    data.append('priority', formData.priority);
    data.append('status', formData.status);
    data.append('comments', formData.comments);
    data.append('assigned_by', loggedUser?.id);
    data.append('name', `${loggedUser?.firstName} ${loggedUser?.lastName}`);
    data.append('role', loggedUser?.role || 'unknown');

    selectedImages.forEach(file => {
      data.append('images', file);
    });

    axios.put(`http://127.0.0.1:8000/api/bugs/${bugId}/`, data)
      .then(() => {
        alert('Bug updated successfully!');
        axios.get(`http://127.0.0.1:8000/api/bug-history/?bug=${bugId}&title=${encodeURIComponent(formData.title)}`)
          .then(res => setHistory(res.data));
        setSelectedImages([]); 
      })
      .catch(err => {
        console.error('Error updating bug:', err.response?.data || err.message || err);
        alert('Error updating bug.');
      });
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    <div className="edit-page-container">
      <form id="edit-project-form" onSubmit={handleSubmit}>
        <h2>Edit Bug</h2>

        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />

        <label>Task:</label>
        <select name="task" value={formData.task} onChange={handleInputChange} required>
          <option value="">-- Select Task --</option>
          {tasks.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <label>Images:</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            setSelectedImages(prev => {
              const existingNames = prev.map(f => f.name);
              const filteredNewFiles = newFiles.filter(f => !existingNames.includes(f.name));
              return [...prev, ...filteredNewFiles];
            });
          }}
        />

        <div className="selected-images-preview">
          {selectedImages.map((file, index) => {
            const objectUrl = URL.createObjectURL(file);
            return (
              <div key={index} className="image-preview">
                <img src={objectUrl} alt={`upload-${index}`} style={{ width: 100, height: 80, objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(objectUrl);
                    setSelectedImages(prev => prev.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleInputChange} required />

        <label>Assigned To:</label>
        <select onChange={addDeveloper} value="">
          <option value="">-- Add Developer --</option>
          {employees.filter(emp => !formData.assigned_to.includes(emp.id))
            .map(emp => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
            ))}
        </select>

        <div id="tags-developers">
          {formData.assigned_to.map(devId => {
            const dev = employees.find(e => e.id === devId);
            return dev ? (
              <span key={devId}>{dev.firstName} {dev.lastName}
                <button type="button" onClick={() => setFormData(prev => ({
                  ...prev,
                  assigned_to: prev.assigned_to.filter(id => id !== devId)
                }))}>×</button>
              </span>
            ) : null;
          })}
        </div>

        <label>Priority:</label>
        <select name="priority" value={formData.priority} onChange={handleInputChange} required>
          <option value="">-- Select Priority --</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Critical">Critical</option>
          <option value="Low">Low</option>
        </select>

        <label>Status:</label>
        {isPrivileged ? (
          <select name="status" value={formData.status} onChange={handleInputChange} required>
            <option value="">-- Select Status --</option>
            <option value="Open">Open</option>
            <option value="Reopened">Reopened</option>
            <option value="Closed">Closed</option>
          </select>
        ) : (
          <select name="status" value={formData.status} onChange={handleInputChange} required>
            <option value="">-- Select Status --</option>
            <option value="Resolved">Resolved</option>
          </select>
        )}

        <label>Comments:</label>
        <textarea name="comments" value={formData.comments} onChange={handleInputChange} />

        <div id="button-group">
          <button id="btn-update" type="submit">Update</button>
          <button id="btn-reset" type="button" onClick={handleReset}>Reset</button>
          <button id="btn-cancel" type="button" onClick={() => navigate('/listbugs')}>Cancel</button>
        </div>
      </form>

      <div className="chat-history-container">
        <div className="chat-box">
          <h3>Bug History</h3>
          <div className="chat-messages">
            {history.map(entry => {
              const isLoggedUserTester = loggedUser.role === 'Tester';
              const isEntryTester = entry.role === 'Tester';
              const alignRight = (isLoggedUserTester && isEntryTester) ||
                (!isLoggedUserTester && !isEntryTester);
              const messageClass = alignRight ? 'chat-message right' : 'chat-message left';

              const images = entry.images || [];
              const currentImageIndex = sliderIndices[entry.id] ?? 0;

              return (
                <div key={entry.id} className={messageClass}>
                  <div className={`entry-info-box ${entry.role.toLowerCase()}`}>
                    <span>{entry.name}</span><br />
                    <span>{entry.role}</span>
                  </div>

                  <p><strong>Status:</strong> {entry.status}</p>
                  <p><strong>Comments:</strong> {entry.comments}</p>

                  {images.length > 0 && (
                    <div className="image-slider">
                
                    {images.length > 0 && (
                      <div>
                        <div className="image-slider" style={{ textAlign: 'center' }}>
      {/* Thumbnail View */}
      {!isZoomed && (
        <>
          <button
            onClick={prevImage}
            disabled={images.length <= 1}
            style={{ color: 'black', fontSize: '24px', cursor: 'pointer' }}
          >
            ‹
          </button>

          <img
            src={images[currentImageIndex].image}
            alt={`History image ${currentImageIndex + 1}`}
            style={{
              width: '150px',
              height: 'auto',
              borderRadius: '8px',
              cursor: 'zoom-in',
              margin: '0 15px',
            }}
            onClick={() => setIsZoomed(true)}
          />

          <button
            onClick={nextImage}
            disabled={images.length <= 1}
            style={{ color: 'black', fontSize: '24px', cursor: 'pointer' }}
          >
            ›
          </button>
        </>
      )}

      {/* Zoomed View */}
      {isZoomed && (
        <div
          className="zoomed-image-container"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            gap: '20px',
          }}
          onClick={() => setIsZoomed(false)} // Close zoom on background click
        >
          <button
                    onClick={(e) => {
            e.stopPropagation();
            prevImage(entry.id, images.length);
          }} 
                      style={{
              fontSize: '48px',
              color: 'white',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ‹
          </button>

          <img
            src={images[currentImageIndex].image}
            alt={`History image ${currentImageIndex + 1}`}
            style={{
              maxWidth: '80vw',
              maxHeight: '80vh',
              borderRadius: '12px',
              cursor: 'zoom-out',
              transition: 'transform 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()} // prevent closing zoom on image click
          />

          <button
                onClick={(e) => {
        e.stopPropagation();
        nextImage(entry.id, images.length);
      }} 
            style={{
              fontSize: '48px',
              color: 'white',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
    <div>{currentImageIndex + 1} / {images.length}</div>
    </div>
)}
 {currentImageIndex + 1} / {images.length}
                                          <div>
                       
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
