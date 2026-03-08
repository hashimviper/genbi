/**
 * Data Transformation Layer
 * Column renaming, type casting, calculated columns, pivot, group-by
 */

import { DataColumn } from '@/types/dashboard';

export interface TransformOperation {
  type: 'rename' | 'cast' | 'calculated' | 'filter' | 'groupBy' | 'sort';
  params: Record<string, unknown>;
}

// Rename a column
export function renameColumn(
  data: Record<string, unknown>[],
  columns: DataColumn[],
  oldName: string,
  newName: string
): { data: Record<string, unknown>[]; columns: DataColumn[] } {
  const newData = data.map(row => {
    const newRow = { ...row };
    if (oldName in newRow) {
      newRow[newName] = newRow[oldName];
      delete newRow[oldName];
    }
    return newRow;
  });
  const newColumns = columns.map(c => c.name === oldName ? { ...c, name: newName } : c);
  return { data: newData, columns: newColumns };
}

// Cast column type
export function castColumn(
  data: Record<string, unknown>[],
  columns: DataColumn[],
  columnName: string,
  targetType: 'string' | 'number' | 'date'
): { data: Record<string, unknown>[]; columns: DataColumn[] } {
  const newData = data.map(row => {
    const val = row[columnName];
    let converted: unknown = val;
    switch (targetType) {
      case 'number': converted = Number(val) || 0; break;
      case 'string': converted = String(val ?? ''); break;
      case 'date': converted = val; break;
    }
    return { ...row, [columnName]: converted };
  });
  const newColumns = columns.map(c => c.name === columnName ? { ...c, type: targetType } : c);
  return { data: newData, columns: newColumns };
}

// Add calculated column with expression
export function addCalculatedColumn(
  data: Record<string, unknown>[],
  columns: DataColumn[],
  newColumnName: string,
  expression: string // e.g., "Revenue - Cost" or "Price * Quantity"
): { data: Record<string, unknown>[]; columns: DataColumn[] } {
  // Parse simple arithmetic expressions: Field1 OP Field2
  const ops = ['+', '-', '*', '/'];
  let operator = '';
  let leftField = '';
  let rightField = '';

  for (const op of ops) {
    const parts = expression.split(op).map(s => s.trim());
    if (parts.length === 2 && parts[0] && parts[1]) {
      operator = op;
      leftField = parts[0];
      rightField = parts[1];
      break;
    }
  }

  if (!operator) {
    // Try single field reference or constant
    const trimmed = expression.trim();
    const isNumber = !isNaN(Number(trimmed));
    const newData = data.map(row => ({
      ...row,
      [newColumnName]: isNumber ? Number(trimmed) : (row[trimmed] ?? 0),
    }));
    return {
      data: newData,
      columns: [...columns, { name: newColumnName, type: 'number' }],
    };
  }

  const newData = data.map(row => {
    const left = Number(row[leftField]) || 0;
    const right = Number(row[rightField]) || 0;
    let result = 0;
    switch (operator) {
      case '+': result = left + right; break;
      case '-': result = left - right; break;
      case '*': result = left * right; break;
      case '/': result = right !== 0 ? left / right : 0; break;
    }
    return { ...row, [newColumnName]: Math.round(result * 100) / 100 };
  });

  return {
    data: newData,
    columns: [...columns, { name: newColumnName, type: 'number' }],
  };
}

// Group-by with aggregation
export function groupByColumn(
  data: Record<string, unknown>[],
  groupField: string,
  measureField: string,
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' = 'sum'
): Record<string, unknown>[] {
  const groups = new Map<string, number[]>();
  for (const row of data) {
    const key = String(row[groupField] ?? 'Unknown');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(Number(row[measureField]) || 0);
  }

  return Array.from(groups).map(([key, values]) => {
    let result: number;
    switch (aggregation) {
      case 'sum': result = values.reduce((a, b) => a + b, 0); break;
      case 'avg': result = values.reduce((a, b) => a + b, 0) / values.length; break;
      case 'count': result = values.length; break;
      case 'min': result = Math.min(...values); break;
      case 'max': result = Math.max(...values); break;
      default: result = values.reduce((a, b) => a + b, 0);
    }
    return { [groupField]: key, [measureField]: Math.round(result * 100) / 100 };
  });
}

// Simple left join
export function leftJoin(
  leftData: Record<string, unknown>[],
  rightData: Record<string, unknown>[],
  leftKey: string,
  rightKey: string
): Record<string, unknown>[] {
  const rightMap = new Map<string, Record<string, unknown>>();
  for (const row of rightData) {
    const key = String(row[rightKey] ?? '');
    if (!rightMap.has(key)) rightMap.set(key, row);
  }

  return leftData.map(leftRow => {
    const key = String(leftRow[leftKey] ?? '');
    const rightRow = rightMap.get(key);
    if (rightRow) {
      // Merge, prefixing right columns that conflict
      const merged = { ...leftRow };
      for (const [k, v] of Object.entries(rightRow)) {
        if (k === rightKey) continue; // skip join key duplicate
        merged[k in leftRow ? `${k}_joined` : k] = v;
      }
      return merged;
    }
    return { ...leftRow };
  });
}

// Sort data
export function sortData(
  data: Record<string, unknown>[],
  field: string,
  direction: 'asc' | 'desc' = 'asc'
): Record<string, unknown>[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    let cmp = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') cmp = aVal - bVal;
    else cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''));
    return direction === 'asc' ? cmp : -cmp;
  });
}

// Filter rows
export function filterRows(
  data: Record<string, unknown>[],
  field: string,
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains',
  value: string | number
): Record<string, unknown>[] {
  return data.filter(row => {
    const rowVal = row[field];
    switch (operator) {
      case 'eq': return rowVal == value;
      case 'neq': return rowVal != value;
      case 'gt': return Number(rowVal) > Number(value);
      case 'lt': return Number(rowVal) < Number(value);
      case 'gte': return Number(rowVal) >= Number(value);
      case 'lte': return Number(rowVal) <= Number(value);
      case 'contains': return String(rowVal ?? '').toLowerCase().includes(String(value).toLowerCase());
      default: return true;
    }
  });
}
