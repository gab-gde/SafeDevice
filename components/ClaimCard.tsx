import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Claim } from '../types';
import { COLORS } from '../constants';
import { formatDate } from '../utils/warranty';
import ClaimStatusBadge from './ClaimStatusBadge';

const CLAIM_ICONS: Record<string, string> = {
  casse: 'hammer-outline',
  oxydation: 'water-outline',
  vol: 'lock-open-outline',
};

const CLAIM_LABELS: Record<string, string> = {
  casse: 'Casse',
  oxydation: 'Oxydation',
  vol: 'Vol',
};

interface Props {
  claim: Claim;
  onDelete: () => void;
}

export default function ClaimCard({ claim, onDelete }: Props) {
  const iconName = CLAIM_ICONS[claim.type] || 'alert-circle-outline';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.typeRow}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName as any} size={18} color={COLORS.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.type}>{CLAIM_LABELS[claim.type] || claim.type}</Text>
            <Text style={styles.date}>{formatDate(claim.created_at)}</Text>
          </View>
          <ClaimStatusBadge status={claim.status} />
        </View>
      </View>

      {claim.description ? (
        <Text style={styles.description}>{claim.description}</Text>
      ) : null}

      {claim.photo_url ? (
        <Image source={{ uri: claim.photo_url }} style={styles.photo} resizeMode="cover" />
      ) : null}

      <TouchableOpacity style={styles.deleteRow} onPress={onDelete}>
        <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  header: {},
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  type: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  date: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  deleteText: {
    fontSize: 12,
    color: COLORS.danger,
  },
});
