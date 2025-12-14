import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataColumn } from '@/types/dashboard';

function inferColumnType(values: unknown[]): 'string' | 'number' | 'date' {
  const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'string';
  
  const sample = nonNullValues.slice(0, 100);
  
  // Check if all values are numbers
  const allNumbers = sample.every((v) => {
    const num = Number(v);
    return !isNaN(num) && typeof v !== 'boolean';
  });
  
  if (allNumbers) return 'number';
  
  // Check if values look like dates
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,
    /^\d{2}\/\d{2}\/\d{4}$/,
    /^\d{2}-\d{2}-\d{4}$/,
  ];
  
  const allDates = sample.every((v) => {
    const str = String(v);
    return datePatterns.some((p) => p.test(str)) || !isNaN(Date.parse(str));
  });
  
  if (allDates) return 'date';
  
  return 'string';
}

export async function parseCSV(file: File): Promise<{ columns: DataColumn[]; data: Record<string, unknown>[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, unknown>[];
        const columnNames = Object.keys(data[0] || {});
        
        const columns: DataColumn[] = columnNames.map((name) => ({
          name,
          type: inferColumnType(data.map((row) => row[name])),
        }));
        
        // Convert numeric columns
        const processedData = data.map((row) => {
          const newRow: Record<string, unknown> = {};
          columns.forEach((col) => {
            if (col.type === 'number') {
              newRow[col.name] = Number(row[col.name]) || 0;
            } else {
              newRow[col.name] = row[col.name];
            }
          });
          return newRow;
        });
        
        resolve({ columns, data: processedData });
      },
      error: (error) => reject(error),
    });
  });
}

export async function parseExcel(file: File): Promise<{ columns: DataColumn[]; data: Record<string, unknown>[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet) as Record<string, unknown>[];
        
        if (jsonData.length === 0) {
          resolve({ columns: [], data: [] });
          return;
        }
        
        const columnNames = Object.keys(jsonData[0]);
        const columns: DataColumn[] = columnNames.map((name) => ({
          name,
          type: inferColumnType(jsonData.map((row) => row[name])),
        }));
        
        resolve({ columns, data: jsonData });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export async function parseFile(file: File): Promise<{ columns: DataColumn[]; data: Record<string, unknown>[] }> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'csv') {
    return parseCSV(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcel(file);
  }
  
  throw new Error(`Unsupported file type: ${extension}`);
}
