import { useColors } from '@/hooks/useColors';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useListPublicProducts } from '@workspace/api-client-react';
import { productIconName } from '@/components/ProductIcon';

const PILLARS = [
  {
    icon: 'flash-outline' as const,
    title: 'Unprecedented speed',
    body: 'From scoping to shipping, we compress delivery timelines without cutting corners on quality.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Enterprise-grade security',
    body: 'Regulatory-compliant, audited architecture for fintech, education, and industrial systems.',
  },
  {
    icon: 'layers-outline' as const,
    title: 'Built to scale',
    body: 'Cloud-native platforms engineered to grow from first customer to enterprise rollout.',
  },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const { data } = useListPublicProducts();
  const previewProducts = useMemo(() => (data?.products ?? []).slice(0, 4), [data]);

  const goTo = (path: '/services' | '/contact') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(path);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: (isWeb ? 84 : insets.bottom) + 32,
        }}
      >
        <View style={[styles.hero, { paddingTop: (isWeb ? 67 : insets.top) + 24 }]}>
          <Image
            source={require('@/assets/images/hero-bg.png')}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(5,8,15,0.55)', 'rgba(5,8,15,0.88)', colors.background]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroContent}>
            <Image
              source={require('@/assets/images/logo-icon.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <View style={[styles.badge, { borderColor: colors.secondary }]}>
              <View style={[styles.badgeDot, { backgroundColor: colors.secondary }]} />
              <Text style={[styles.badgeText, { color: colors.secondary }]}>
                AI AUTOMATION COMPANY
              </Text>
            </View>
            <Text style={[styles.heroTitle, { color: colors.foreground }]}>
              Automate the{' '}
              <Text style={{ color: colors.secondary }}>Future,</Text> Faster
              Than Anyone.
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.mutedForeground }]}>
              Precision-engineered AI, fintech, and industrial systems —
              delivered with unprecedented speed.
            </Text>
            <View style={styles.heroActions}>
              <Pressable
                onPress={() => goTo('/services')}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                ]}
                testID="home-explore-services"
              >
                <Text style={styles.primaryButtonText}>Explore Services</Text>
                <Feather name="arrow-up-right" size={18} color={colors.primaryForeground} />
              </Pressable>
              <Pressable
                onPress={() => goTo('/contact')}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                ]}
                testID="home-get-in-touch"
              >
                <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>
                  Get in Touch
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {PILLARS.map((pillar) => (
            <View
              key={pillar.title}
              style={[
                styles.pillarCard,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
              ]}
            >
              <View
                style={[
                  styles.pillarIcon,
                  { backgroundColor: colors.accent, borderRadius: colors.radius },
                ]}
              >
                <Ionicons name={pillar.icon} size={20} color={colors.secondary} />
              </View>
              <View style={styles.pillarTextWrap}>
                <Text style={[styles.pillarTitle, { color: colors.foreground }]}>
                  {pillar.title}
                </Text>
                <Text style={[styles.pillarBody, { color: colors.mutedForeground }]}>
                  {pillar.body}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {previewProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                What we build
              </Text>
              <Pressable onPress={() => goTo('/services')} testID="home-see-all">
                <Text style={[styles.sectionLink, { color: colors.secondary }]}>See all</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productRow}
            >
              {previewProducts.map((product) => (
                <View
                  key={product.id}
                  style={[
                    styles.productPreviewCard,
                    { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
                  ]}
                >
                  <View
                    style={[
                      styles.pillarIcon,
                      { backgroundColor: colors.accent, borderRadius: colors.radius },
                    ]}
                  >
                    <Ionicons
                      name={productIconName(product.icon)}
                      size={20}
                      color={colors.secondary}
                    />
                  </View>
                  <Text
                    style={[styles.productPreviewTitle, { color: colors.foreground }]}
                    numberOfLines={2}
                  >
                    {product.title}
                  </Text>
                  {product.category && (
                    <Text
                      style={[styles.productPreviewCategory, { color: colors.mutedForeground }]}
                      numberOfLines={1}
                    >
                      {product.category}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={[styles.section, styles.ctaSection]}>
          <View
            style={[
              styles.ctaCard,
              { backgroundColor: colors.accent, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <Text style={[styles.ctaTitle, { color: colors.foreground }]}>
              Have a project in mind?
            </Text>
            <Text style={[styles.ctaBody, { color: colors.mutedForeground }]}>
              Talk to our engineering team about custom software, AI
              integration, or a live product demo.
            </Text>
            <Pressable
              onPress={() => goTo('/contact')}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.ctaButton,
                { backgroundColor: colors.secondary, opacity: pressed ? 0.85 : 1 },
              ]}
              testID="home-cta-contact"
            >
              <Text style={[styles.primaryButtonText, { color: colors.secondaryForeground }]}>
                Contact Us
              </Text>
              <Feather name="arrow-up-right" size={18} color={colors.secondaryForeground} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    minHeight: 520,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroContent: { gap: 16 },
  logo: { width: 44, height: 40, marginBottom: 4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  heroTitle: { fontSize: 38, fontWeight: '800', lineHeight: 44, letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 16, lineHeight: 23 },
  heroActions: { flexDirection: 'row', gap: 12, marginTop: 8, flexWrap: 'wrap' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
  },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  secondaryButtonText: { fontSize: 15, fontWeight: '700' },
  section: { paddingHorizontal: 24, marginTop: 32, gap: 12 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  sectionLink: { fontSize: 14, fontWeight: '600' },
  pillarCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  pillarIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTextWrap: { flex: 1, gap: 4 },
  pillarTitle: { fontSize: 15, fontWeight: '700' },
  pillarBody: { fontSize: 13, lineHeight: 19 },
  productRow: { gap: 12, paddingRight: 12 },
  productPreviewCard: {
    width: 160,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  productPreviewTitle: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
  productPreviewCategory: { fontSize: 11, fontWeight: '600' },
  ctaSection: { marginTop: 8 },
  ctaCard: { padding: 24, borderWidth: 1, gap: 8 },
  ctaTitle: { fontSize: 20, fontWeight: '700' },
  ctaBody: { fontSize: 14, lineHeight: 20 },
  ctaButton: { alignSelf: 'flex-start', marginTop: 12 },
});
