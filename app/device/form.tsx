import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDevice, createDevice, updateDevice } from '../../services/devices';
import { DeviceFormData, DeviceType, WarrantyType } from '../../types';
import { COLORS, DEVICE_TYPES, WARRANTY_TYPES } from '../../constants';

const EMPTY_FORM: DeviceFormData = {
  name: '',
  type: 'mobile',
  brand: '',
  model: '',
  purchase_date: null,
  purchase_price: '',
  notes: '',
  warranty_type: '',
  warranty_start: null,
  warranty_end: null,
};

export default function DeviceFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const router = useRouter();

  const [form, setForm] = useState<DeviceFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState<'purchase_date' | 'warranty_start' | 'warranty_end'>('purchase_date');

  useEffect(() => {
    if (isEditing) {
      loadDevice();
    }
  }, [id]);

  const loadDevice = async () => {
    try {
      const device = await getDevice(id!);
      setForm({
        name: device.name,
        type: device.type,
        brand: device.brand,
        model: device.model,
        purchase_date: device.purchase_date,
        purchase_price: device.purchase_price?.toString() || '',
        notes: device.notes,
        warranty_type: device.warranty_type,
        warranty_start: device.warranty_start,
        warranty_end: device.warranty_end,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'appareil.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof DeviceFormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const openDatePicker = (field: 'purchase_date' | 'warranty_start' | 'warranty_end') => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      update(dateField, dateStr);
    }
  };

  const formatDisplayDate = (date: string | null) => {
    if (!date) return 'Sélectionner';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert('Erreur', 'Le nom de l\'appareil est obligatoire.');
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        await updateDevice(id!, form);
      } else {
        await createDevice(form);
      }
      router.back();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de sauvegarder.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Infos appareil */}
      <Text style={styles.sectionTitle}>Appareil</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nom de l'appareil *</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(v) => update('name', v)}
          placeholder="Ex : iPhone de Mohamed"
          placeholderTextColor={COLORS.textTertiary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Type d'appareil</Text>
        <View style={styles.chipRow}>
          {DEVICE_TYPES.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={[styles.chip, form.type === value && styles.chipActive]}
              onPress={() => update('type', value as DeviceType)}
            >
              <Text style={[styles.chipText, form.type === value && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Marque</Text>
          <TextInput
            style={styles.input}
            value={form.brand}
            onChangeText={(v) => update('brand', v)}
            placeholder="Ex : Apple"
            placeholderTextColor={COLORS.textTertiary}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Modèle</Text>
          <TextInput
            style={styles.input}
            value={form.model}
            onChangeText={(v) => update('model', v)}
            placeholder="Ex : iPhone 15"
            placeholderTextColor={COLORS.textTertiary}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Date d'achat</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => openDatePicker('purchase_date')}>
            <Text style={[styles.dateText, !form.purchase_date && styles.placeholder]}>
              {formatDisplayDate(form.purchase_date)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Prix d'achat (€)</Text>
          <TextInput
            style={styles.input}
            value={form.purchase_price}
            onChangeText={(v) => update('purchase_price', v)}
            placeholder="0.00"
            placeholderTextColor={COLORS.textTertiary}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes / identifiant</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.notes}
          onChangeText={(v) => update('notes', v)}
          placeholder="N° de série, IMEI, infos utiles..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Garantie */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Garantie</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Type de garantie</Text>
        <View style={styles.chipRow}>
          {WARRANTY_TYPES.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={[styles.chip, form.warranty_type === value && styles.chipActive]}
              onPress={() => update('warranty_type', value as WarrantyType)}
            >
              <Text style={[styles.chipText, form.warranty_type === value && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {form.warranty_type !== '' && (
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Début garantie</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => openDatePicker('warranty_start')}>
              <Text style={[styles.dateText, !form.warranty_start && styles.placeholder]}>
                {formatDisplayDate(form.warranty_start)}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Fin garantie</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => openDatePicker('warranty_end')}>
              <Text style={[styles.dateText, !form.warranty_end && styles.placeholder]}>
                {formatDisplayDate(form.warranty_end)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={form[dateField] ? new Date(form[dateField]!) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
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
          <Text style={styles.submitButtonText}>
            {isEditing ? 'Enregistrer les modifications' : 'Ajouter l\'appareil'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 14,
  },
  inputGroup: { marginBottom: 14, gap: 6 },
  label: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: { minHeight: 80, paddingTop: 12 },
  row: { flexDirection: 'row', gap: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#FFF' },
  dateButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dateText: { fontSize: 15, color: COLORS.text },
  placeholder: { color: COLORS.textTertiary },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
