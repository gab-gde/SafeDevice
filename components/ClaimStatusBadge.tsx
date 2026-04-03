import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClaimStatus } from '../types';
import { CLAIM_STATUSES } from '../constants';

interface Props {
  status: ClaimStatus;
}

export default function ClaimStatusBadge({ status }: Props) {
  const config = CLAIM_STATUSES[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
