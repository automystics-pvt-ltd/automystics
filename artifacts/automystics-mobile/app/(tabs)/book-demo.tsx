import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useCreateDemoRequest,
  useGetDemoRequestAvailableSlots,
  useListPublicProducts,
} from '@workspace/api-client-react';

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAYS_AHEAD = 14;

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildUpcomingDays(count: number): { key: string; date: Date }[] {
  const days: { key: string; date: Date }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; days.length < count && i < count * 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;
    days.push({ key: toDateKey(date), date });
  }
  return days;
}

export default function BookDemoScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const upcomingDays = useMemo(() => buildUpcomingDays(DAYS_AHEAD), []);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedSlotIso, setSelectedSlotIso] = useState<string | null>(null);
  const [productInterest, setProductInterest] = useState<string>('');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: productsData } = useListPublicProducts();
  const products = productsData?.products ?? [];

  const slotsQuery = useGetDemoRequestAvailableSlots(
    { date: selectedDateKey ?? '' },
    { query: { enabled: !!selectedDateKey, queryKey: ['demo-slots', selectedDateKey] } },
  );
  const slots = slotsQuery.data?.slots ?? [];
  const timezoneLabel = slotsQuery.data?.timezone ?? 'IST';

  const mutation = useCreateDemoRequest();

  const setField = (key: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSelectDate = (key: string) => {
    setSelectedDateKey(key);
    setSelectedSlotIso(null);
    Haptics.selectionAsync().catch(() => {});
  };

  const onSelectSlot = (iso: string, available: boolean) => {
    if (!available) return;
    setSelectedSlotIso(iso);
    Haptics.selectionAsync().catch(() => {});
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) {
      next.email = 'Enter a valid email address';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!selectedSlotIso) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      return;
    }
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      return;
    }
    try {
      await mutation.mutateAsync({
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          productInterest: productInterest || undefined,
          scheduledAt: selectedSlotIso,
          message: form.message.trim() || undefined,
        },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setSubmitted(true);
      setForm(EMPTY_FORM);
      setProductInterest('');
      setSelectedDateKey(null);
      setSelectedSlotIso(null);
    } catch (err: unknown) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      if ((err as { status?: number } | undefined)?.status === 409) {
        setSelectedSlotIso(null);
        slotsQuery.refetch();
      }
    }
  };

  const inputStyle = (hasError?: boolean) => [
    styles.input,
    {
      backgroundColor: colors.card,
      borderColor: hasError ? colors.destructive : colors.border,
      color: colors.foreground,
      borderRadius: colors.radius,
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollViewCompat
        bottomOffset={32}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: (isWeb ? 67 : insets.top) + 16,
          paddingBottom: (isWeb ? 84 : insets.bottom) + 32,
          paddingHorizontal: 24,
          gap: 24,
        }}
      >
        <View style={styles.headerBlock}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Book a live <Text style={{ color: colors.secondary }}>demo.</Text>
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
            Pick a time and our team will walk you through it live.
          </Text>
        </View>

        {submitted ? (
          <View
            style={[
              styles.successCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <View
              style={[
                styles.successIcon,
                { backgroundColor: colors.accent, borderRadius: colors.radius },
              ]}
            >
              <Feather name="calendar" size={26} color={colors.secondary} />
            </View>
            <Text style={[styles.successTitle, { color: colors.foreground }]}>
              Demo request received
            </Text>
            <Text style={[styles.successBody, { color: colors.mutedForeground }]}>
              A specialist will meet you at your chosen time.
            </Text>
            <Pressable
              onPress={() => setSubmitted(false)}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
              testID="book-demo-another"
            >
              <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>
                Book another demo
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Choose a date</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingVertical: 2 }}
              >
                {upcomingDays.map(({ key, date }) => {
                  const selected = key === selectedDateKey;
                  return (
                    <Pressable
                      key={key}
                      onPress={() => onSelectDate(key)}
                      style={[
                        styles.dayChip,
                        {
                          backgroundColor: selected ? colors.primary : colors.card,
                          borderColor: selected ? colors.primary : colors.border,
                          borderRadius: colors.radius,
                        },
                      ]}
                      testID={`book-demo-date-${key}`}
                    >
                      <Text
                        style={[
                          styles.dayChipWeekday,
                          { color: selected ? colors.primaryForeground : colors.mutedForeground },
                        ]}
                      >
                        {date.toLocaleDateString(undefined, { weekday: 'short' })}
                      </Text>
                      <Text
                        style={[
                          styles.dayChipDate,
                          { color: selected ? colors.primaryForeground : colors.foreground },
                        ]}
                      >
                        {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {selectedDateKey && (
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>
                  Choose a time ({timezoneLabel})
                </Text>
                {slotsQuery.isLoading ? (
                  <View style={styles.slotsLoading}>
                    <ActivityIndicator color={colors.secondary} />
                  </View>
                ) : slots.length === 0 ? (
                  <Text style={[styles.helperText, { color: colors.mutedForeground }]}>
                    No slots left for this day. Please try another date.
                  </Text>
                ) : (
                  <View style={styles.slotsGrid}>
                    {slots.map((slot) => {
                      const selected = slot.iso === selectedSlotIso;
                      return (
                        <Pressable
                          key={slot.iso}
                          disabled={!slot.available}
                          onPress={() => onSelectSlot(slot.iso, slot.available)}
                          style={[
                            styles.slotChip,
                            {
                              backgroundColor: selected ? colors.primary : colors.card,
                              borderColor: selected ? colors.primary : colors.border,
                              borderRadius: colors.radius,
                              opacity: slot.available ? 1 : 0.4,
                            },
                          ]}
                          testID={`book-demo-slot-${slot.hour}`}
                        >
                          <Feather
                            name="clock"
                            size={13}
                            color={selected ? colors.primaryForeground : colors.mutedForeground}
                          />
                          <Text
                            style={[
                              styles.slotChipText,
                              {
                                color: selected ? colors.primaryForeground : colors.foreground,
                                textDecorationLine: slot.available ? 'none' : 'line-through',
                              },
                            ]}
                          >
                            {slot.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Full name</Text>
              <TextInput
                value={form.name}
                onChangeText={setField('name')}
                placeholder="Jane Doe"
                placeholderTextColor={colors.mutedForeground}
                style={inputStyle(!!errors.name)}
                testID="book-demo-name"
              />
              {errors.name && (
                <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Work email</Text>
              <TextInput
                value={form.email}
                onChangeText={setField('email')}
                placeholder="jane@company.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                style={inputStyle(!!errors.email)}
                testID="book-demo-email"
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>
                  Phone <Text style={{ opacity: 0.6 }}>(optional)</Text>
                </Text>
                <TextInput
                  value={form.phone}
                  onChangeText={setField('phone')}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  style={inputStyle()}
                  testID="book-demo-phone"
                />
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>
                  Company <Text style={{ opacity: 0.6 }}>(optional)</Text>
                </Text>
                <TextInput
                  value={form.company}
                  onChangeText={setField('company')}
                  placeholder="Acme Inc."
                  placeholderTextColor={colors.mutedForeground}
                  style={inputStyle()}
                  testID="book-demo-company"
                />
              </View>
            </View>

            {products.length > 0 && (
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>
                  Which product? <Text style={{ opacity: 0.6 }}>(optional)</Text>
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10, paddingVertical: 2 }}
                >
                  {products.map((product) => {
                    const selected = productInterest === product.title;
                    return (
                      <Pressable
                        key={product.id}
                        onPress={() => setProductInterest(selected ? '' : product.title)}
                        style={[
                          styles.productChip,
                          {
                            backgroundColor: selected ? colors.accent : colors.card,
                            borderColor: selected ? colors.secondary : colors.border,
                            borderRadius: colors.radius,
                          },
                        ]}
                        testID={`book-demo-product-${product.id}`}
                      >
                        <Text
                          style={[
                            styles.productChipText,
                            { color: selected ? colors.secondary : colors.foreground },
                          ]}
                        >
                          {product.title}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                What would you like to see? <Text style={{ opacity: 0.6 }}>(optional)</Text>
              </Text>
              <TextInput
                value={form.message}
                onChangeText={setField('message')}
                placeholder="Tell us about your use case or specific questions..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={5}
                style={[inputStyle(), styles.textArea]}
                testID="book-demo-message"
              />
            </View>

            {!selectedSlotIso && (
              <Text style={[styles.helperText, { color: colors.mutedForeground }]}>
                Pick a date and time above before booking.
              </Text>
            )}

            {mutation.isError && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                Something went wrong. Please try again.
              </Text>
            )}

            <Pressable
              onPress={onSubmit}
              disabled={mutation.isPending || !selectedSlotIso}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: colors.primary,
                  opacity: mutation.isPending || !selectedSlotIso ? 0.5 : pressed ? 0.85 : 1,
                },
              ]}
              testID="book-demo-submit"
            >
              <Text style={styles.submitButtonText}>
                {mutation.isPending ? 'Booking…' : 'Book My Demo'}
              </Text>
              {!mutation.isPending && (
                <Feather name="arrow-up-right" size={18} color={colors.primaryForeground} />
              )}
            </Pressable>
          </View>
        )}
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBlock: { gap: 8 },
  headerTitle: { fontSize: 30, fontWeight: '800', letterSpacing: -0.4 },
  headerSubtitle: { fontSize: 14, lineHeight: 20 },
  form: { gap: 18 },
  row: { flexDirection: 'row', gap: 12 },
  field: { gap: 8 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  textArea: { minHeight: 110, textAlignVertical: 'top' },
  errorText: { fontSize: 12, marginTop: 2 },
  helperText: { fontSize: 13, lineHeight: 18 },
  dayChip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 68,
    gap: 2,
  },
  dayChipWeekday: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  dayChipDate: { fontSize: 14, fontWeight: '700' },
  slotsLoading: { paddingVertical: 20, alignItems: 'center' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  slotChipText: { fontSize: 13, fontWeight: '600' },
  productChip: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  productChipText: { fontSize: 13, fontWeight: '600' },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 999,
    marginTop: 4,
  },
  submitButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  successCard: { padding: 28, borderWidth: 1, alignItems: 'center', gap: 8 },
  successIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  successTitle: { fontSize: 18, fontWeight: '700' },
  successBody: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  secondaryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '700' },
});
