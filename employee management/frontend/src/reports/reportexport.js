import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportReportToPDF = (labels, ratings, year) => {
  const doc = new jsPDF();

  // Define columns
  const tableColumn = ["Employee Name", "Rating"];

  // Prepare rows
  const tableRows = labels.map((label, i) => [label, ratings[i]]);

  // Title
  doc.text(`Employee Feedback Report - Year ${year}`, 14, 15);

  // Add table
  autoTable(doc, {
    startY: 20,
    head: [tableColumn],
    body: tableRows,
  });

  // Save file
  doc.save(`employee_feedback_report_${year}.pdf`);
};
