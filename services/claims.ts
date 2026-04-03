import { supabase } from './supabase';
import { Claim, ClaimFormData } from '../types';

export async function getClaimsByDevice(deviceId: string): Promise<Claim[]> {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createClaim(
  deviceId: string,
  form: ClaimFormData,
  photoUri?: string
): Promise<Claim> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non connecté');

  let photoUrl = '';

  // Upload photo si fournie
  if (photoUri) {
    const fileName = `${user.id}/${deviceId}_${Date.now()}.jpg`;
    const response = await fetch(photoUri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from('claims')
      .upload(fileName, blob, { contentType: 'image/jpeg' });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('claims')
      .getPublicUrl(fileName);

    photoUrl = urlData.publicUrl;
  }

  const payload = {
    user_id: user.id,
    device_id: deviceId,
    type: form.type,
    description: form.description.trim(),
    photo_url: photoUrl,
    status: 'déclaré',
  };

  const { data, error } = await supabase
    .from('claims')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClaim(id: string): Promise<void> {
  const { error } = await supabase
    .from('claims')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
