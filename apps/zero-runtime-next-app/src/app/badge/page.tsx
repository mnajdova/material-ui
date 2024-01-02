import * as React from 'react';
import Badge from '@/components/Badge/Badge';

export default function SimpleBadge() {
  return (
    // @ts-ignore
    <Badge badgeContent={4} color="primary">
      💌
    </Badge>
  );
}
