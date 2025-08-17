import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportAbsentToPDF = (labels, dataValues) => {
  const doc = new jsPDF();

  const tableColumn = ['Employee Name', 'Total Leave Days'];
  const tableRows = labels.map((label, i) => [label, dataValues[i]]);

  doc.text('Leave Records by Employee', 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [tableColumn],
    body: tableRows,
  });

  doc.save('leave_records_report.pdf');
};
