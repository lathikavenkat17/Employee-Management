// src/utils/projectExport.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportProjectsToPDF = (projects, employees) => {
  const doc = new jsPDF();

  const tableColumn = [
    "ID", "Name", "Description", "Start", "End", "Team Lead",
    "Manager", "Created By", "Developers", "Testers"
  ];

  const renderEmployee = (empOrId) => {
    if (!empOrId) return '-';
    if (typeof empOrId === 'object' && empOrId.firstName) {
      return `${empOrId.firstName} ${empOrId.lastName} (ID: ${empOrId.id})`;
    }
    const found = employees.find(e => e.id === empOrId);
    return found ? `${found.firstName} ${found.lastName} (ID: ${found.id})` : `ID: ${empOrId}`;
  };

  const renderEmployeeList = (list) => {
    if (!list || list.length === 0) return '-';
    return list.map(empOrId => {
      if (typeof empOrId === 'object' && empOrId.firstName) {
        return `${empOrId.firstName} ${empOrId.lastName} (ID: ${empOrId.id})`;
      } else {
        const found = employees.find(e => e.id === empOrId);
        return found ? `${found.firstName} ${found.lastName} (ID: ${found.id})` : `ID: ${empOrId}`;
      }
    }).join(', ');
  };

  const tableRows = projects.map(project => [
    project.id,
    project.name,
    project.description || '-', // Added description
    project.start_date,
    project.end_date,
    renderEmployee(project.team_lead),
    renderEmployee(project.manager),
    renderEmployee(project.created_by),
    renderEmployeeList(project.developers),
    renderEmployeeList(project.testers),
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.text("Project List", 14, 15);
  doc.save("project_list.pdf");
};

export const exportProjectsToCSV = (projects, employees) => {
  const headers = [
    "ID", "Name", "Description", "Start", "End", "Team Lead",
    "Manager", "Created By", "Developers", "Testers"
  ];

  const renderEmployee = (empOrId) => {
    if (!empOrId) return '-';
    if (typeof empOrId === 'object' && empOrId.firstName) {
      return `${empOrId.firstName} ${empOrId.lastName} (ID: ${empOrId.id})`;
    }
    const found = employees.find(e => e.id === empOrId);
    return found ? `${found.firstName} ${found.lastName} (ID: ${found.id})` : `ID: ${empOrId}`;
  };

  const renderEmployeeList = (list) => {
    if (!list || list.length === 0) return '-';
    return list.map(empOrId => {
      if (typeof empOrId === 'object' && empOrId.firstName) {
        return `${empOrId.firstName} ${empOrId.lastName} (ID: ${empOrId.id})`;
      } else {
        const found = employees.find(e => e.id === empOrId);
        return found ? `${found.firstName} ${found.lastName} (ID: ${found.id})` : `ID: ${empOrId}`;
      }
    }).join(', ');
  };

  const rows = projects.map(project => [
    project.id,
    project.name,
    project.description || '-', // Added description
    project.start_date,
    project.end_date,
    renderEmployee(project.team_lead),
    renderEmployee(project.manager),
    renderEmployee(project.created_by),
    renderEmployeeList(project.developers),
    renderEmployeeList(project.testers),
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "project_list.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
