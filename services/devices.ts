import { supabase } from './supabase';
import { Device, DeviceFormData } from '../types';

export async function getDevices(): Promise<Device[]> {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getDevice(id: string): Promise<Device> {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createDevice(form: DeviceFormData): Promise<Device> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non connecté');

  const payload = {
    user_id: user.id,
    name: form.name.trim(),
    type: form.type,
    brand: form.brand.trim(),
    model: form.model.trim(),
    purchase_date: form.purchase_date || null,
    purchase_price: form.purchase_price ? parseFloat(form.purchase_price) : null,
    notes: form.notes.trim(),
    warranty_type: form.warranty_type || '',
    warranty_start: form.warranty_start || null,
    warranty_end: form.warranty_end || null,
  };

  const { data, error } = await supabase
    .from('devices')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDevice(id: string, form: DeviceFormData): Promise<Device> {
  const payload = {
    name: form.name.trim(),
    type: form.type,
    brand: form.brand.trim(),
    model: form.model.trim(),
    purchase_date: form.purchase_date || null,
    purchase_price: form.purchase_price ? parseFloat(form.purchase_price) : null,
    notes: form.notes.trim(),
    warranty_type: form.warranty_type || '',
    warranty_start: form.warranty_start || null,
    warranty_end: form.warranty_end || null,
  };

  const { data, error } = await supabase
    .from('devices')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDevice(id: string): Promise<void> {
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
