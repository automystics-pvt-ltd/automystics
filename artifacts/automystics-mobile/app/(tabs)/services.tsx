import { useColors } from '@/hooks/useColors';
import { ProductIcon } from '@/components/ProductIcon';
import { Feather } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useListPublicProducts,
  type Product,
} from '@workspace/api-client-react';

function ProductCard({ product }: { product: Product }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
      ]}
      testID={`product-card-${product.id}`}
    >
      <View style={styles.cardHeader}>
        <View
          style={[styles.iconWrap, { backgroundColor: colors.accent, borderRadius: colors.radius }]}
        >
          <ProductIcon icon={product.icon} color={colors.secondary} size={22} />
        </View>
        <View style={styles.cardTitleWrap}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{product.title}</Text>
          {product.category && (
            <Text style={[styles.cardCategory, { color: colors.secondary }]}>
              {product.category}
            </Text>
          )}
        </View>
      </View>
      {product.description && (
        <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>
          {product.description}
        </Text>
      )}
      {product.features.length > 0 && (
        <View style={styles.featureList}>
          {product.features.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <Feather name="check-circle" size={14} color={colors.secondary} />
              <Text style={[styles.featureText, { color: colors.foreground }]}>{feature}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { data, isLoading, isError, refetch, isRefetching } = useListPublicProducts();
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setManualRefreshing(false);
    }
  }, [refetch]);

  const products = data?.products ?? [];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: (isWeb ? 67 : insets.top) + 16, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Services & Products</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Enterprise software, AI, and industrial systems we've built and maintain.
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={colors.secondary} />
        </View>
      ) : isError ? (
        <View style={styles.centerFill}>
          <Feather name="alert-circle" size={28} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Couldn't load services
          </Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
            Check your connection and try again.
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
            testID="services-retry"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centerFill}>
          <Feather name="package" size={28} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No services yet</Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
            Check back soon for our product catalog.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: (isWeb ? 84 : insets.bottom) + 24 },
          ]}
          scrollEnabled={products.length > 0}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching || manualRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.secondary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 16, gap: 6, borderBottomWidth: 1 },
  headerTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 14, lineHeight: 20 },
  listContent: { padding: 24, gap: 16 },
  card: { borderWidth: 1, padding: 18, gap: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  cardTitleWrap: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardCategory: { fontSize: 12, fontWeight: '600' },
  cardDescription: { fontSize: 13.5, lineHeight: 20 },
  featureList: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, flex: 1 },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  emptyBody: { fontSize: 13, textAlign: 'center' },
  retryButton: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 999 },
  retryButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
});
