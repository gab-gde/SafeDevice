import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProfile, updateProfile, signOut } from '../../services/auth';
import { Profile } from '../../types';
import { COLORS } from '../../constants';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pseudo, setPseudo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      if (data) {
        setProfile(data);
        setPseudo(data.pseudo);
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!pseudo.trim()) {
      Alert.alert('Erreur', 'Le pseudo ne peut pas être vide.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile(pseudo.trim());
      setProfile(updated);
      setEdited(false);
      Alert.alert('Succès', 'Profil mis à jour.');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de sauvegarder.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('Erreur déconnexion:', error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(profile?.pseudo || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Pseudo / Nom</Text>
          <TextInput
            style={styles.input}
            value={pseudo}
            onChangeText={(text) => {
              setPseudo(text);
              setEdited(text !== profile?.pseudo);
            }}
            placeholder="Votre pseudo"
            placeholderTextColor={COLORS.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>{profile?.email}</Text>
            <Ionicons name="lock-closed-outline" size={16} color={COLORS.textTertiary} />
          </View>
        </View>

        {edited && (
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarSection: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#FFF' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    gap: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  input: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  readOnlyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  readOnlyText: { fontSize: 16, color: COLORS.textSecondary },
  saveButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingVertical: 14,
    gap: 8,
  },
  logoutText: { fontSize: 16, color: COLORS.danger, fontWeight: '500' },
});
