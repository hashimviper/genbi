/**
 * IndexedDB wrapper for large dataset storage.
 * Uses idb-keyval for simplicity. Datasets too large for localStorage go here.
 */
import { get, set, del, keys, clear } from 'idb-keyval';
import { DataSet } from '@/types/dashboard';

const DS_PREFIX = 'dataset:';

export async function saveDatasetToIDB(dataset: DataSet): Promise<void> {
  await set(`${DS_PREFIX}${dataset.id}`, dataset);
}

export async function getDatasetFromIDB(id: string): Promise<DataSet | undefined> {
  return await get(`${DS_PREFIX}${id}`);
}

export async function deleteDatasetFromIDB(id: string): Promise<void> {
  await del(`${DS_PREFIX}${id}`);
}

export async function getAllDatasetsFromIDB(): Promise<DataSet[]> {
  const allKeys = await keys();
  const dsKeys = allKeys.filter(k => String(k).startsWith(DS_PREFIX));
  const datasets: DataSet[] = [];
  for (const key of dsKeys) {
    const ds = await get(key);
    if (ds) datasets.push(ds as DataSet);
  }
  return datasets;
}

export async function clearAllDatasetsFromIDB(): Promise<void> {
  const allKeys = await keys();
  for (const key of allKeys) {
    if (String(key).startsWith(DS_PREFIX)) {
      await del(key);
    }
  }
}

/**
 * Estimate size of a dataset in bytes
 */
export function estimateDatasetSize(dataset: Omit<DataSet, 'id' | 'createdAt'>): number {
  try {
    return new Blob([JSON.stringify(dataset.data)]).size;
  } catch {
    return dataset.data.length * 200; // rough estimate
  }
}

// Threshold: datasets larger than 2MB should use IndexedDB
export const IDB_THRESHOLD_BYTES = 2 * 1024 * 1024;
