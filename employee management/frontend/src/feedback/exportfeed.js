import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportFeedbackToPDF = (feedbacks) => {
  const doc = new jsPDF();

  const tableColumn = [
    "ID",
    "Employee",
    "Manager Name",
    "Manager Approval",
    "TL Name",
    "TL Approval",
    "Performed By",
    "Rating",
    "Comment",
    "Reason Manager",
    "Reason TL",
    "Year",
    "Month",
    "Last Modified Date",
    "Last Modified Time"
  ];

  const tableRows = feedbacks.map(fb => [
    fb.employee?.id || '-',
    fb.employee ? `${fb.employee.firstName} ${fb.employee.lastName}` : '-',
    fb.manager_name || '-',
    fb.manager_approval || '-',
    fb.tl_name || '-',
    fb.tl_approval || '-',
    fb.performed_by || '-',
    fb.Rating ?? '-', // Use nullish coalescing for null/undefined
    fb.comment || '-',
    fb.ReasonManager || '-',
    fb.ReasonTL || '-',
    fb.year || '-',
    fb.month || '-',
    fb.last_modified_date || '-',
    fb.last_modified_time || '-',
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.text("Feedback List", 14, 15);
  doc.save("feedback_list.pdf");
};

export const exportFeedbackToCSV = (feedbacks) => {
  const headers = [
    "ID",
    "Employee",
    "Manager Name",
    "Manager Approval",
    "TL Name",
    "TL Approval",
    "Performed By",
    "Rating",
    "Comment",
    "Reason Manager",
    "Reason TL",
    "Year",
    "Month",
    "Last Modified Date",
    "Last Modified Time"
  ];

  const rows = feedbacks.map(fb => [
    fb.employee?.id || '-',
    fb.employee ? `${fb.employee.firstName} ${fb.employee.lastName}` : '-',
    fb.manager_name || '-',
    fb.manager_approval || '-',
    fb.tl_name || '-',
    fb.tl_approval || '-',
    fb.performed_by || '-',
    fb.Rating ?? '-',
    fb.comment || '-',
    fb.ReasonManager || '-',
    fb.ReasonTL || '-',
    fb.year || '-',
    fb.month || '-',
    fb.last_modified_date || '-',
    fb.last_modified_time || '-',
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map(row => row.map(item => `"${item}"`).join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "feedback_list.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
