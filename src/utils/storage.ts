import { Gain } from '@/types/Gain';

const STORAGE_KEY = 'ganhos-mensais';

export function saveGains(gains: Gain[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gains));
}

export function loadGains(): Gain[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
