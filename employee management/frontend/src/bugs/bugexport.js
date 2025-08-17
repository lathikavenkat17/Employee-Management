// src/utils/bugexport.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

export const exportBugsToPDF = (bugs, renderTaskName, renderEmployeeList, renderEmployee) => {
  const doc = new jsPDF();

  const tableColumn = [
    "ID",
    "Title",
    "Task",
    "Description",
    "Priority",
    "Status",
    "Assigned To",
    "Assigned By",
    "Comments"
  ];

  const tableRows = bugs.map(bug => [
    bug.id,
    bug.title,
    renderTaskName(bug.task),
    bug.description,
    bug.priority,
    bug.status,
    renderEmployeeList(bug.assigned_to),
    renderEmployee(bug.assigned_by),
    bug.comments
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.text("Bug List", 14, 15);
  doc.save("bug_list.pdf");
};

export const exportBugsToCSV = (bugs, renderTaskName, renderEmployeeList, renderEmployee) => {
  const csvData = bugs.map(bug => ({
    ID: bug.id,
    Title: bug.title,
    Task: renderTaskName(bug.task),
    Description: bug.description,
    Priority: bug.priority,
    Status: bug.status,
    AssignedTo: renderEmployeeList(bug.assigned_to),
    AssignedBy: renderEmployee(bug.assigned_by),
    Comments: bug.comments,
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'bug_list.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
