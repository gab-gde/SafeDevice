import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Device } from '../types';
import { COLORS } from '../constants';
import { getWarrantyStatus } from '../utils/warranty';
import WarrantyBadge from './WarrantyBadge';

const DEVICE_ICONS: Record<string, string> = {
  mobile: 'phone-portrait-outline',
  PC: 'desktop-outline',
  tablette: 'tablet-portrait-outline',
  montre: 'watch-outline',
  montre: 'watch-outline',
  autre: 'hardware-chip-outline',
};

interface Props {
  device: Device;
  onPress: () => void;
}

export default function DeviceCard({ device, onPress }: Props) {
  const warrantyStatus = getWarrantyStatus(device.warranty_end);
  const iconName = DEVICE_ICONS[device.type] || 'hardware-chip-outline';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName as any} size={24} color={COLORS.primaryLight} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{device.name}</Text>
        <Text style={styles.detail} numberOfLines={1}>
          {device.brand}{device.model ? ` ${device.model}` : ''} · {device.type}
        </Text>
        <WarrantyBadge status={warrantyStatus} size="small" />
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  detail: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
