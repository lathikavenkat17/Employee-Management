// src/utils/taskexport.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

export const exportTasksToPDF = (tasks, renderProjectName, renderEmployee, renderEmployeeList) => {
  const doc = new jsPDF();

  const tableColumn = [
    "ID",
    "Task Name",
    "Project",
    "Start",
    "End",
    "Description",
    "Created By",
    "Developers",
    "Testers"
  ];

  const tableRows = tasks.map(task => [
    task.id,
    task.name,
    renderProjectName(task.project_name),
    task.start_date,
    task.end_date,
    task.description || '-', // Add description
    renderEmployee(task.created_by),
    renderEmployeeList(task.developers),
    renderEmployeeList(task.testers),
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.text("Task List", 14, 15);
  doc.save("task_list.pdf");
};

export const exportTasksToCSV = (tasks, renderProjectName, renderEmployee, renderEmployeeList) => {
  const csvData = tasks.map(task => ({
    ID: task.id,
    TaskName: task.name,
    Project: renderProjectName(task.project_name),
    Start: task.start_date,
    End: task.end_date,
    Description: task.description || '-', // Add description
    CreatedBy: renderEmployee(task.created_by),
    Developers: renderEmployeeList(task.developers),
    Testers: renderEmployeeList(task.testers),
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'task_list.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
