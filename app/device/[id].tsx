import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getDevice, deleteDevice } from '../../services/devices';
import { getClaimsByDevice, deleteClaim } from '../../services/claims';
import { Device, Claim } from '../../types';
import { COLORS } from '../../constants';
import { getWarrantyStatus, formatDate, formatPrice } from '../../utils/warranty';
import WarrantyBadge from '../../components/WarrantyBadge';
import ClaimCard from '../../components/ClaimCard';

export default function DeviceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadData = useCallback(async () => {
    try {
      const [deviceData, claimsData] = await Promise.all([
        getDevice(id!),
        getClaimsByDevice(id!),
      ]);
      setDevice(deviceData);
      setClaims(claimsData);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'appareil.');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = () => {
    Alert.alert(
      'Supprimer l\'appareil',
      `Êtes-vous sûr de vouloir supprimer "${device?.name}" ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDevice(id!);
              router.back();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer l\'appareil.');
            }
          },
        },
      ],
    );
  };

  const handleDeleteClaim = (claimId: string) => {
    Alert.alert(
      'Supprimer la déclaration',
      'Êtes-vous sûr de vouloir supprimer cette déclaration de sinistre ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClaim(claimId);
              setClaims(prev => prev.filter(c => c.id !== claimId));
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer.');
            }
          },
        },
      ],
    );
  };

  if (loading || !device) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  const warrantyStatus = getWarrantyStatus(device.warranty_end);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceType}>
          {device.brand}{device.model ? ` ${device.model}` : ''} · {device.type}
        </Text>
      </View>

      {/* Infos appareil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.card}>
          <InfoRow label="Type" value={device.type} />
          <InfoRow label="Marque" value={device.brand || '—'} />
          <InfoRow label="Modèle" value={device.model || '—'} />
          <InfoRow label="Date d'achat" value={formatDate(device.purchase_date)} />
          <InfoRow label="Prix d'achat" value={formatPrice(device.purchase_price)} />
          {device.notes ? <InfoRow label="Notes" value={device.notes} /> : null}
        </View>
      </View>

      {/* Bloc Garantie */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Garantie</Text>
        <View style={[styles.card, warrantyStatus === 'active' && styles.cardActive, warrantyStatus === 'expired' && styles.cardExpired]}>
          {warrantyStatus === 'none' ? (
            <Text style={styles.noWarranty}>Aucune garantie renseignée</Text>
          ) : (
            <>
              <View style={styles.warrantyHeader}>
                <Text style={styles.warrantyType}>{device.warranty_type}</Text>
                <WarrantyBadge status={warrantyStatus} />
              </View>
              <InfoRow label="Début" value={formatDate(device.warranty_start)} />
              <InfoRow label="Fin" value={formatDate(device.warranty_end)} />
            </>
          )}
        </View>
      </View>

      {/* Sinistres */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sinistres</Text>
          <TouchableOpacity
            style={styles.claimButton}
            onPress={() => router.push({
              pathname: '/device/claim-form',
              params: { deviceId: device.id, deviceName: device.name },
            })}
          >
            <Ionicons name="warning-outline" size={16} color="#FFF" />
            <Text style={styles.claimButtonText}>Déclarer</Text>
          </TouchableOpacity>
        </View>

        {claims.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.noClaims}>Aucun sinistre déclaré</Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {claims.map(claim => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                onDelete={() => handleDeleteClaim(claim.id)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push({ pathname: '/device/form', params: { id: device.id } })}
        >
          <Ionicons name="create-outline" size={18} color="#FFF" />
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  deviceName: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  deviceType: { fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 0 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  cardActive: { borderColor: COLORS.success, borderWidth: 1.5 },
  cardExpired: { borderColor: COLORS.danger, borderWidth: 1.5 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  infoLabel: { fontSize: 14, color: COLORS.textSecondary, flex: 1 },
  infoValue: { fontSize: 14, color: COLORS.text, fontWeight: '500', flex: 2, textAlign: 'right' },
  warrantyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  warrantyType: { fontSize: 16, fontWeight: '600', color: COLORS.text, textTransform: 'capitalize' },
  noWarranty: { fontSize: 14, color: COLORS.textTertiary, textAlign: 'center', paddingVertical: 8 },
  noClaims: { fontSize: 14, color: COLORS.textTertiary, textAlign: 'center', paddingVertical: 8 },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  claimButtonText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  editButtonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  deleteButtonText: { color: COLORS.danger, fontSize: 15, fontWeight: '600' },
});
