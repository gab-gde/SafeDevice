export type DeviceType = 'mobile' | 'PC' | 'tablette' | 'autre';

export type WarrantyType = 'légale' | 'constructeur' | 'extension' | 'autre' | '';

export type WarrantyStatus = 'active' | 'expired' | 'none';

export type ClaimType = 'casse' | 'oxydation' | 'vol';

export type ClaimStatus = 'déclaré' | 'en_cours' | 'traité';

export interface Profile {
  id: string;
  pseudo: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  user_id: string;
  name: string;
  type: DeviceType;
  brand: string;
  model: string;
  purchase_date: string | null;
  purchase_price: number | null;
  notes: string;
  warranty_type: WarrantyType;
  warranty_start: string | null;
  warranty_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceFormData {
  name: string;
  type: DeviceType;
  brand: string;
  model: string;
  purchase_date: string | null;
  purchase_price: string;
  notes: string;
  warranty_type: WarrantyType;
  warranty_start: string | null;
  warranty_end: string | null;
}

export interface Claim {
  id: string;
  user_id: string;
  device_id: string;
  type: ClaimType;
  description: string;
  photo_url: string;
  status: ClaimStatus;
  created_at: string;
  updated_at: string;
}

export interface ClaimFormData {
  type: ClaimType;
  description: string;
}
