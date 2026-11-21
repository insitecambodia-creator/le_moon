// Shared rules for the booking forms. The Worker (worker/index.ts) enforces the
// same limits, so keep both in step.
export type FormType = 'table' | 'birthday' | 'groups';

export const limits = {
  table: { minGuests: 1, maxGuests: 6, firstSlot: '17:00', lastSlot: '22:00' },
  birthday: { minGuests: 2, maxGuests: 20, firstSlot: '17:00', lastSlot: '21:30' },
  groups: { minGuests: 20, maxGuests: 200, firstSlot: '17:00', lastSlot: '22:00' },
} as const;

export function timeSlots(first: string, last: string, stepMinutes = 30): string[] {
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  const out: string[] = [];
  for (let m = toMin(first); m <= toMin(last); m += stepMinutes) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
}

export function slotLabel(t: string): string {
  const h = Number(t.slice(0, 2));
  const m = t.slice(3);
  return `${((h + 11) % 12) + 1}:${m} ${h < 12 ? 'am' : 'pm'}`;
}

export const sources = ['Google search', 'Facebook or Instagram', 'Friends or colleagues', 'Hotel or guesthouse', 'Other'];

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
