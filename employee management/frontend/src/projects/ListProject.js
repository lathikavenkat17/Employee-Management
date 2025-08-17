import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { exportProjectsToPDF, exportProjectsToCSV } from "./exportpro";
import "./listproject.css";

export default function ListProject() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Projects";

    axios
      .get("http://127.0.0.1:8000/api/projects/")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));

    axios
      .get("http://127.0.0.1:8000/api/employee/")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const renderEmployee = (empOrId) => {
    if (!empOrId) return "-";
    if (typeof empOrId === "object" && empOrId.firstName) {
      return `${empOrId.firstName} ${empOrId.lastName} (ID: ${empOrId.id})`;
    }
    const found = employees.find((e) => e.id === empOrId);
    return found
      ? `${found.firstName} ${found.lastName} (ID: ${found.id})`
      : `ID: ${empOrId}`;
  };

  const renderEmployeeList = (list) => {
    if (!list || list.length === 0) return "-";
    return list
      .map((empOrId) => {
        if (typeof empOrId === "object" && empOrId.firstName) {
          return `${empOrId.firstName} ${empOrId.lastName} (ID: ${empOrId.id})`;
        } else {
          const found = employees.find((e) => e.id === empOrId);
          return found
            ? `${found.firstName} ${found.lastName} (ID: ${found.id})`
            : `ID: ${empOrId}`;
        }
      })
      .join(", ");
  };

  const toggleExpandRow = (projectId) => {
    setExpandedRow((prev) => (prev === projectId ? null : projectId));
  };

  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  return (
    <div className="left-align">
      <div style={{ padding: "20px" }}>
        <div className="header-container">
          <div className="left-title">
            <h2>Project List</h2>
          </div>
          <div className="right-link">
            <Link to="/addproject" className="addlink">
              <img src="./project.png" alt="Add Icon" />
              <span>Add Project</span>
            </Link>
          </div>
        </div>

        <div className="export-buttons">
          <button
            onClick={() => exportProjectsToPDF(projects, employees)}
            className="export-button"
          >
            Export PDF
          </button>
          <button
            onClick={() => exportProjectsToCSV(projects, employees)}
            className="export-button"
          >
            Export CSV
          </button>
        </div>

        <div className="table-responsive">
          <table id="project-table">
            <thead id="project-thead">
              <tr id="project-header-row">
                <th id="th-id">ID</th>
                <th id="th-name">Name</th>
                <th className="hide-on-mobile">Team Lead</th>
                <th className="hide-on-mobile">Manager</th>
                <th className="hide-on-mobile">Developers</th>
                <th className="hide-on-mobile">Testers</th>
                <th id="th-action">Action</th>
              </tr>
            </thead>
            <tbody id="project-tbody">
              {currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                  <React.Fragment key={project.id}>
                    <tr
                      className="main-row"
                      onClick={() => toggleExpandRow(project.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          toggleExpandRow(project.id);
                        }
                      }}
                    >
                      <td data-label="ID">{project.id}</td>
                      <td data-label="Name">{project.name}</td>
                   
                      <td className="hide-on-mobile" data-label="Team Lead">
                        {renderEmployee(project.team_lead)}
                      </td>
                      <td className="hide-on-mobile" data-label="Manager">
                        {renderEmployee(project.manager)}
                      </td>
                    
                      <td className="hide-on-mobile" data-label="Developers">
                        {renderEmployeeList(project.developers)}
                      </td>
                      <td className="hide-on-mobile" data-label="Testers">
                        {renderEmployeeList(project.testers)}
                      </td>
                      <td data-label="Action">
                        <button
                          className="view-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-project/${project.id}`);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    {expandedRow === project.id && (
                      <tr className="expanded-row">
                        <td colSpan="10">
                          <div className="expanded-details">
                            <div>
                              <strong>Start:</strong> {project.start_date}
                            </div>
                            <div>
                              <strong>End:</strong> {project.end_date}
                            </div>
                            <div>
                              <strong>Team Lead:</strong>{" "}
                              {renderEmployee(project.team_lead)}
                            </div>
                            <div>
                              <strong>Manager:</strong>{" "}
                              {renderEmployee(project.manager)}
                            </div>
                            <div>
                              <strong>Created By:</strong>{" "}
                              {renderEmployee(project.created_by)}
                            </div>
                            <div>
                              <strong>Developers:</strong>{" "}
                              {renderEmployeeList(project.developers)}
                            </div>
                            <div>
                              <strong>Testers:</strong>{" "}
                              {renderEmployeeList(project.testers)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center" }}>
                    Loading or No Projects Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
