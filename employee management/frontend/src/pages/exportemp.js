// src/utils/employeeExport.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportEmployeesToPDF = (employees) => {
  const doc = new jsPDF();

  const tableColumn = [
    "ID", "Name", "Role", "Gender", "Birthday",
    "Country", "University", "Degree", "Department", "Phone", "Email"
  ];

  const tableRows = employees.map(emp => [
    emp.id,
    emp.firstName,
    emp.role,
    emp.gender,
    emp.birthday,
    emp.country,
    emp.university,
    emp.degree,
    emp.department,
    emp.phone,
    emp.email
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.text("Employee List", 14, 15);
  doc.save("employee_list.pdf");
};

export const exportEmployeesToCSV = (employees) => {
  const headers = [
    "ID", "Name", "Role", "Gender", "Birthday",
    "Country", "University", "Degree", "Department", "Phone", "Email"
  ];

  const rows = employees.map(emp => [
    emp.id,
    emp.firstName,
    emp.role,
    emp.gender,
    emp.birthday,
    emp.country,
    emp.university,
    emp.degree,
    emp.department,
    emp.phone,
    emp.email
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "employee_list.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
