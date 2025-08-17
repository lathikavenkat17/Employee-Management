import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { exportEmployeesToPDF, exportEmployeesToCSV } from './exportemp';
import './emplist.css';

function Emplist() {
  useEffect(() => {
    document.title = 'Employee List';
  }, []);

  const [employees, setEmployees] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const [selectedRole, setSelectedRole] = useState("All"); // <-- filter state
  const employeesPerPage = 10; 
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/employee/')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleEditClick = (employeeId) => {
    navigate(`/edit/${employeeId}`);
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // ✅ Filter employees based on role
  const filteredEmployees =
    selectedRole === "All"
      ? employees
      : employees.filter(emp => emp.role === selectedRole);

  // Pagination calculations (after filtering)
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // ✅ Extract unique roles for dropdown
  const uniqueRoles = ["All", ...new Set(employees.map(emp => emp.role))];

  return (
    <div className='left-align'>
      <div style={{ padding: '20px' }}>
        <div className="header-container">
          <div className="left-title">
            <h2>Employee List</h2>
          </div>
          <div className="right-link">
            <Link to="/addemp" className="addlink">
              <img src="./add.png" alt="Add Icon" />
              <span>Add Employee</span>
            </Link>
          </div>
        </div>

        {/* ✅ Role Filter Dropdown */}
        {/* Export + Filter Row */}
<div className="action-bar">
  <div className="export-buttons">
    <button onClick={() => exportEmployeesToPDF(filteredEmployees)} className="export-button">Export PDF</button>
    <button onClick={() => exportEmployeesToCSV(filteredEmployees)} className="export-button">Export CSV</button>
  </div>

  {/* Small Role Filter Dropdown on Right */}
  <div className="filter-box">
    <select
      value={selectedRole}
      onChange={(e) => {
        setSelectedRole(e.target.value);
        setCurrentPage(1);
      }}
    >
      {uniqueRoles.map(role => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  </div>
</div>


        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th className="hide-on-mobile">Role</th>
                <th className="hide-on-mobile">Gender</th>
                <th className="hide-on-mobile">Birthday</th>
                <th className="hide-on-mobile">Degree</th>
                <th className="hide-on-mobile">Department</th>
                <th className="hide-on-mobile">Phone</th>
                <th className="hide-on-mobile">Email</th>
                <th className="hide-on-mobile">Edit</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map(emp => (
                  <React.Fragment key={emp.id}>
                    <tr
                      className="main-row"
                      onClick={() => toggleExpand(emp.id)}
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          toggleExpand(emp.id);
                        }
                      }}
                    >
                      <td data-label="ID">{emp.id}</td>
                      <td data-label="Name">{emp.firstName}</td>
                      <td className="hide-on-mobile" data-label="Role">{emp.role}</td>
                      <td className="hide-on-mobile" data-label="Gender">{emp.gender}</td>
                      <td className="hide-on-mobile" data-label="Birthday">{emp.birthday}</td>
                      <td className="hide-on-mobile" data-label="Degree">{emp.degree}</td>
                      <td className="hide-on-mobile" data-label="Department">{emp.department}</td>
                      <td className="hide-on-mobile" data-label="Phone">{emp.phone}</td>
                      <td className="hide-on-mobile" data-label="Email">{emp.email}</td>
                      <td className="hide-on-mobile">
                        <button className="view-button" onClick={e => { e.stopPropagation(); handleEditClick(emp.id); }}>Edit</button>
                      </td>
                    </tr>

                    {expandedId === emp.id && (
                      <tr className="expanded-row">
                        <td colSpan="12">
                          <div className="expanded-details">
                            <div><strong>Role:</strong> {emp.role}</div>
                            <div><strong>Gender:</strong> {emp.gender}</div>
                            <div><strong>Birthday:</strong> {emp.birthday}</div>
                            <div><strong>Country:</strong> {emp.country}</div>
                            <div><strong>University:</strong> {emp.university}</div>
                            <div><strong>Degree:</strong> {emp.degree}</div>
                            <div><strong>Department:</strong> {emp.department}</div>
                            <div><strong>Phone:</strong> {emp.phone}</div>
                            <div><strong>Email:</strong> {emp.email}</div>
                            <div>
                              <button className="view-button" onClick={() => handleEditClick(emp.id)}>Edit</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center' }}>Loading or No Employees Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Emplist;
