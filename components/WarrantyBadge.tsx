import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarrantyStatus } from '../types';
import { COLORS } from '../constants';

interface Props {
  status: WarrantyStatus;
  size?: 'small' | 'normal';
}

export default function WarrantyBadge({ status, size = 'normal' }: Props) {
  if (status === 'none') return null;

  const isActive = status === 'active';
  const label = isActive ? 'Active' : 'Expirée';
  const bgColor = isActive ? '#DCFCE7' : '#FEE2E2';
  const textColor = isActive ? COLORS.success : COLORS.danger;
  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, isSmall && styles.badgeSmall]}>
      <View style={[styles.dot, { backgroundColor: textColor }]} />
      <Text style={[styles.label, { color: textColor }, isSmall && styles.labelSmall]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: 11,
  },
});
