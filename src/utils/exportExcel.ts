import * as XLSX from 'xlsx';
import { WaitlistEntry } from './mockApi';

export const exportToExcel = (entries: WaitlistEntry[], filename = 'waitlist.xlsx') => {
  const data = entries.map((entry) => ({
    Position: entry.position,
    Name: entry.name,
    Email: entry.email,
    'Signup Date': new Date(entry.createdAt).toLocaleDateString(),
    Status: entry.status || 'active',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Waitlist');

  worksheet['!cols'] = [
    { wch: 10 },
    { wch: 25 },
    { wch: 30 },
    { wch: 15 },
    { wch: 12 },
  ];

  XLSX.writeFile(workbook, filename);
};
