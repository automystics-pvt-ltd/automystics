import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Maps the icon keys stored on the `products` table (lucide-react icon
 * names, used by the sibling web artifact) to an Ionicons equivalent for
 * the mobile app.
 */
const ICON_MAP: Record<string, IoniconName> = {
  Building2: 'business-outline',
  GraduationCap: 'school-outline',
  Mic: 'mic-outline',
  LineChart: 'trending-up-outline',
  Sun: 'sunny-outline',
  Camera: 'camera-outline',
  Dumbbell: 'barbell-outline',
  Code: 'code-slash-outline',
};

export function productIconName(icon?: string | null): IoniconName {
  if (icon && icon in ICON_MAP) return ICON_MAP[icon];
  return 'cube-outline';
}

export function ProductIcon({
  icon,
  size = 24,
  color,
}: {
  icon?: string | null;
  size?: number;
  color: string;
}) {
  return <Ionicons name={productIconName(icon)} size={size} color={color} />;
}
