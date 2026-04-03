export const DEVICE_TYPES = [
  { label: 'Mobile', value: 'mobile' },
  { label: 'PC', value: 'PC' },
  { label: 'Tablette', value: 'tablette' },
  { label: 'Montre connectée', value: 'montre' },
  { label: 'Montre connectée', value: 'montre' },
  { label: 'Autre', value: 'autre' },
] as const;

export const WARRANTY_TYPES = [
  { label: 'Aucune', value: '' },
  { label: 'Garantie légale', value: 'légale' },
  { label: 'Garantie constructeur', value: 'constructeur' },
  { label: 'Extension de garantie', value: 'extension' },
  { label: 'Montre connectée', value: 'montre' },
  { label: 'Montre connectée', value: 'montre' },
  { label: 'Autre', value: 'autre' },
] as const;

export const CLAIM_TYPES = [
  { label: 'Casse', value: 'casse', icon: 'hammer-outline' },
  { label: 'Oxydation', value: 'oxydation', icon: 'water-outline' },
  { label: 'Vol', value: 'vol', icon: 'lock-open-outline' },
] as const;

export const CLAIM_STATUSES = {
  'déclaré': { label: 'Déclaré', color: '#F59E0B', bg: '#FEF3C7' },
  'en_cours': { label: 'En cours', color: '#3B82F6', bg: '#DBEAFE' },
  'traité': { label: 'Traité', color: '#16A34A', bg: '#DCFCE7' },
} as const;

export const COLORS = {
  primary: '#1B2A4A',
  primaryLight: '#2C4A7C',
  accent: '#3B82F6',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  text: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  border: '#E2E8F0',
  borderFocus: '#3B82F6',
} as const;
