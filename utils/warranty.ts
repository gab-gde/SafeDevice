import { WarrantyStatus } from '../types';

export function getWarrantyStatus(warrantyEnd: string | null): WarrantyStatus {
  if (!warrantyEnd) return 'none';
  const end = new Date(warrantyEnd);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return end >= today ? 'active' : 'expired';
}

export function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return '—';
  return `${price.toFixed(2)} €`;
}
