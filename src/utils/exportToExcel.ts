import * as XLSX from 'xlsx';
import { WaitlistEntry } from './mockApi';

export const exportToExcel = (entries: WaitlistEntry[], filename: string = 'waitlist-export.xlsx') => {
  // Prepare data for Excel
  const data = entries.map(entry => ({
    Position: entry.position,
    Name: entry.name,
    Email: entry.email,
    'Signup Date': new Date(entry.createdAt).toLocaleDateString(),
    Status: entry.status || 'active',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const columnWidths = [
    { wch: 10 }, // Position
    { wch: 25 }, // Name
    { wch: 30 }, // Email
    { wch: 15 }, // Signup Date
    { wch: 12 }, // Status
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Waitlist');

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
};
