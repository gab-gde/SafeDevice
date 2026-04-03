import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createClaim } from '../../services/claims';
import { ClaimType, ClaimFormData } from '../../types';
import { COLORS, CLAIM_TYPES } from '../../constants';

export default function ClaimFormScreen() {
  const { deviceId, deviceName } = useLocalSearchParams<{ deviceId: string; deviceName: string }>();
  const router = useRouter();

  const [form, setForm] = useState<ClaimFormData>({
    type: 'casse',
    description: '',
  });
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'L\'accès à la galerie est nécessaire pour ajouter une photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'L\'accès à la caméra est nécessaire pour prendre une photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!form.description.trim()) {
      Alert.alert('Erreur', 'Veuillez décrire le sinistre.');
      return;
    }
    setSaving(true);
    try {
      await createClaim(deviceId!, form, photoUri || undefined);
      Alert.alert('Sinistre déclaré', 'Votre déclaration a bien été enregistrée.');
      router.back();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de déclarer le sinistre.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Ionicons name="warning-outline" size={24} color="#FCD34D" />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Déclarer un sinistre</Text>
          <Text style={styles.headerSubtitle}>{deviceName || 'Appareil'}</Text>
        </View>
      </View>

      {/* Type de sinistre */}
      <Text style={styles.sectionTitle}>Type de sinistre</Text>
      <View style={styles.typeGrid}>
        {CLAIM_TYPES.map(({ label, value, icon }) => {
          const isSelected = form.type === value;
          return (
            <TouchableOpacity
              key={value}
              style={[styles.typeCard, isSelected && styles.typeCardActive]}
              onPress={() => setForm(prev => ({ ...prev, type: value as ClaimType }))}
            >
              <Ionicons
                name={icon as any}
                size={28}
                color={isSelected ? '#FFF' : COLORS.textSecondary}
              />
              <Text style={[styles.typeLabel, isSelected && styles.typeLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <TextInput
        style={styles.textArea}
        value={form.description}
        onChangeText={(v) => setForm(prev => ({ ...prev, description: v }))}
        placeholder="Décrivez ce qui s'est passé..."
        placeholderTextColor={COLORS.textTertiary}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Photo */}
      <Text style={styles.sectionTitle}>Photo / justificatif</Text>
      {photoUri ? (
        <View style={styles.photoPreview}>
          <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
          <TouchableOpacity style={styles.removePhoto} onPress={() => setPhotoUri(null)}>
            <Ionicons name="close-circle" size={28} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={24} color={COLORS.accent} />
            <Text style={styles.photoButtonText}>Prendre une photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color={COLORS.accent} />
            <Text style={styles.photoButtonText}>Galerie</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, saving && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Ionicons name="shield-checkmark-outline" size={20} color="#FFF" />
            <Text style={styles.submitText}>Déclarer le sinistre</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#7C2D12',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  typeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 8,
  },
  typeCardActive: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  typeLabelActive: { color: '#FFF' },
  textArea: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 100,
    marginBottom: 16,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.accent,
  },
  photoPreview: {
    position: 'relative',
    marginBottom: 24,
  },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 14,
  },
  removePhoto: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
