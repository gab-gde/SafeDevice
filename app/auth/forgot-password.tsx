import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { resetPassword } from '../../services/auth';
import { COLORS } from '../../constants';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse email.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible d\'envoyer l\'email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.logo}>SafeDevice</Text>
          <Text style={styles.subtitle}>Réinitialiser votre mot de passe</Text>
        </View>

        {sent ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Email envoyé !</Text>
            <Text style={styles.successText}>
              Un lien de réinitialisation a été envoyé à {email}. Vérifiez votre boîte de réception.
            </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Retour à la connexion</Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                placeholderTextColor={COLORS.textTertiary}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleReset}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Envoyer le lien</Text>
              )}
            </TouchableOpacity>

            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.backLink}>← Retour à la connexion</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 32, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  backLink: { fontSize: 14, color: COLORS.accent, textAlign: 'center', fontWeight: '500', marginTop: 8 },
  successBox: { backgroundColor: '#DCFCE7', padding: 24, borderRadius: 16, gap: 12 },
  successTitle: { fontSize: 18, fontWeight: '600', color: COLORS.success },
  successText: { fontSize: 14, color: '#166534', lineHeight: 20 },
});
