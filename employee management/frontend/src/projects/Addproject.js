import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './addproject.css';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { Editor } from 'primereact/editor';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


export default function Addproject({ loggedUser }) {
  useEffect(() => {
    document.title = 'Add Project';
  }, []);
 
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [ocrLoading, setOcrLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    developers: [],
    testers: [],
    teamLead: '',
    manager: '',
    createdBy: loggedUser?.id || '',
  });

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/employee/')
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error('Error fetching employees:', err));
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let allHtml = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageHtml = content.items
            .map((item) => `<p>${item.str}</p>`)
            .join(' ');
          allHtml += pageHtml + '<br/><br/>';
        }

        setFormData((prev) => ({ ...prev, description: allHtml }));
      } catch (error) {
        alert('Error reading PDF file.');
        console.error(error);
      }
    } else if (fileType === 'txt') {
      try {
        const text = await file.text();
        const html = `<p>${text.replace(/\n/g, '<br/>')}</p>`;
        setFormData((prev) => ({ ...prev, description: html }));
      } catch (error) {
        alert('Error reading text file.');
        console.error(error);
      }
    } else if (file.type.startsWith('image/')) {
      setOcrLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        Tesseract.recognize(reader.result, 'eng', {
          logger: (m) => console.log(m),
        })
          .then(({ data: { text } }) => {
            const newDescription = formData.description + `<p>${text.replace(/\n/g, '<br/>')}</p>`;
            setFormData((prev) => ({ ...prev, description: newDescription }));
            setOcrLoading(false);
          })
          .catch((err) => {
            console.error('OCR Error:', err);
            setOcrLoading(false);
          });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Unsupported file type. Upload PDF, TXT or image files.');
    }

    e.target.value = '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = (type, selectedId) => {
    if (!selectedId) return;
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], Number(selectedId)],
    }));
  };

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
      created_by: Number(formData.createdBy),
    };

    axios
      .post('http://127.0.0.1:8000/api/projects/', payload)
      .then(() => {
        alert('Project created successfully!');
        setFormData({
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          developers: [],
          testers: [],
          teamLead: '',
          manager: '',
          createdBy: loggedUser?.id || '',
        });
        navigate('/listproject');
      })
      .catch((err) => {
        console.error('Error creating project:', err.response);
        alert('Error creating project.');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="heads">Create Project</h2>

      <label className="form-label">
        Project Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="text-input"
          required
        />
      </label>

      <label className="form-label">
        Upload file or image:
        <input
          type="file"
          accept=".pdf,.txt,image/*"
          onChange={handleFileUpload}
          className="text-input"
        />
        {ocrLoading && (
          <div className="mt-2 text-info">Extracting text from image...</div>
        )}
      </label>

      <label className="form-label">
        Description:
        <Editor
          value={formData.description}
          onTextChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.htmlValue }))
          }
          style={{ height: '300px' }}
        />
      </label>

      <label className="form-label">
        Start Date:
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleInputChange}
          className="date-input"
          required
        />
      </label>

      <label className="form-label">
        End Date:
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleInputChange}
          className="date-input"
          required
        />
      </label>

      <label className="form-label">
        Developers:
        <select
          className="select-input"
          value=""
          onChange={(e) => handleAddMember('developers', e.target.value)}
        >
          <option value="">-- Add Developer --</option>
          {employees
            .filter((emp) => !formData.developers.includes(emp.id))
            .filter(
              (emp) =>
                !['Manager', 'Team Lead', 'Tester', 'HR'].includes(emp.role)
            )
            .map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
        </select>
        <div className="selected-tags">
          {formData.developers.map((devId) => {
            const dev = employees.find((e) => e.id === devId);
            if (!dev) return null;
            return (
              <span key={devId} className="tag">
                {dev.firstName} {dev.lastName}
                <button
                  type="button"
                  className="remove-tag"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      developers: prev.developers.filter((id) => id !== devId),
                    }))
                  }
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </label>

      <label className="form-label">
        Testers:
        <select
          className="select-input"
          value=""
          onChange={(e) => handleAddMember('testers', e.target.value)}
        >
          <option value="">-- Add Tester --</option>
          {employees
            .filter((emp) => !formData.testers.includes(emp.id))
            .filter((emp) => emp.role === 'Tester')
            .map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
        </select>
        <div className="selected-tags">
          {formData.testers.map((testerId) => {
            const tester = employees.find((e) => e.id === testerId);
            if (!tester) return null;
            return (
              <span key={testerId} className="tag">
                {tester.firstName} {tester.lastName}
                <button
                  type="button"
                  className="remove-tag"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      testers: prev.testers.filter((id) => id !== testerId),
                    }))
                  }
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </label>

      <label className="form-label">
        Team Lead:
        <select
          name="teamLead"
          value={formData.teamLead}
          onChange={handleInputChange}
          className="select-input"
          required
        >
          <option value="">-- Select Team Lead --</option>
          {employees
            .filter((emp) => emp.role === 'Team Lead')
            .map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
        </select>
      </label>

      <label className="form-label">
        Manager:
        <select
          name="manager"
          value={formData.manager}
          onChange={handleInputChange}
          className="select-input"
          required
        >
          <option value="">-- Select Manager --</option>
          {employees
            .filter((emp) => emp.role === 'Manager')
            .map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
        </select>
      </label>

      <label className="form-label">
        Created By:
        <input
          type="text"
          className="text-input"
          value={`${loggedUser?.id || ''} - ${loggedUser?.firstName || ''} ${
            loggedUser?.lastName || ''
          }`}
          readOnly
        />
      </label>

      <div className="button-container">
        <button type="submit" className="submit-btn">
          Create Project
        </button>
        <button
          type="button"
          onClick={() => navigate('/listproject')}
          className="cancel-btn"
        >
          Cancel
        </button>
      </div>

    </form>
  );
}
