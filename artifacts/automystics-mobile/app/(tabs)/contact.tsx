import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useCreateEnquiry,
  useGetPublicSiteSettings,
} from '@workspace/api-client-react';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { data: siteData } = useGetPublicSiteSettings();
  const site = siteData?.settings;
  const mutation = useCreateEnquiry();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = (key: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.lastName.trim()) next.lastName = 'Last name is required';
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) {
      next.email = 'Enter a valid email address';
    }
    if (form.message.trim().length < 5) next.message = 'Tell us a bit more (min 5 characters)';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      return;
    }
    try {
      await mutation.mutateAsync({
        data: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          message: form.message.trim(),
        },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
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
            Let's build the <Text style={{ color: colors.secondary }}>future.</Text>
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
            Tell us about your project and our team will respond within 24 hours.
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
              <Feather name="check" size={26} color={colors.secondary} />
            </View>
            <Text style={[styles.successTitle, { color: colors.foreground }]}>
              Message received
            </Text>
            <Text style={[styles.successBody, { color: colors.mutedForeground }]}>
              Our team will get back to you within 24 hours.
            </Text>
            <Pressable
              onPress={() => setSubmitted(false)}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
              testID="contact-send-another"
            >
              <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>
                Send another message
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>First name</Text>
                <TextInput
                  value={form.firstName}
                  onChangeText={setField('firstName')}
                  placeholder="Jane"
                  placeholderTextColor={colors.mutedForeground}
                  style={inputStyle(!!errors.firstName)}
                  testID="contact-first-name"
                />
                {errors.firstName && (
                  <Text style={[styles.errorText, { color: colors.destructive }]}>
                    {errors.firstName}
                  </Text>
                )}
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>Last name</Text>
                <TextInput
                  value={form.lastName}
                  onChangeText={setField('lastName')}
                  placeholder="Doe"
                  placeholderTextColor={colors.mutedForeground}
                  style={inputStyle(!!errors.lastName)}
                  testID="contact-last-name"
                />
                {errors.lastName && (
                  <Text style={[styles.errorText, { color: colors.destructive }]}>
                    {errors.lastName}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Email</Text>
              <TextInput
                value={form.email}
                onChangeText={setField('email')}
                placeholder="jane@company.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                style={inputStyle(!!errors.email)}
                testID="contact-email"
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.email}</Text>
              )}
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
                testID="contact-company"
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Message</Text>
              <TextInput
                value={form.message}
                onChangeText={setField('message')}
                placeholder="Tell us about your project..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={5}
                style={[inputStyle(!!errors.message), styles.textArea]}
                testID="contact-message"
              />
              {errors.message && (
                <Text style={[styles.errorText, { color: colors.destructive }]}>
                  {errors.message}
                </Text>
              )}
            </View>

            {mutation.isError && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                Something went wrong. Please try again{site?.primaryEmail ? ` or email us at ${site.primaryEmail}.` : '.'}
              </Text>
            )}

            <Pressable
              onPress={onSubmit}
              disabled={mutation.isPending}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: colors.primary,
                  opacity: mutation.isPending ? 0.7 : pressed ? 0.85 : 1,
                },
              ]}
              testID="contact-submit"
            >
              <Text style={styles.submitButtonText}>
                {mutation.isPending ? 'Sending…' : 'Send Message'}
              </Text>
              {!mutation.isPending && (
                <Feather name="arrow-up-right" size={18} color={colors.primaryForeground} />
              )}
            </Pressable>
          </View>
        )}

        <View
          style={[
            styles.contactInfoCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.contactInfoTitle, { color: colors.foreground }]}>
            Prefer to reach out directly?
          </Text>
          {site?.primaryPhone && (
            <Pressable
              style={styles.contactRow}
              onPress={() => Linking.openURL(`tel:${site.primaryPhone!.replace(/[^+\d]/g, '')}`)}
              testID="contact-call"
            >
              <View
                style={[styles.contactIcon, { backgroundColor: colors.accent, borderRadius: colors.radius }]}
              >
                <Feather name="phone" size={16} color={colors.secondary} />
              </View>
              <Text style={[styles.contactRowText, { color: colors.foreground }]}>
                {site.primaryPhone}
              </Text>
            </Pressable>
          )}
          {site?.primaryEmail && (
            <Pressable
              style={styles.contactRow}
              onPress={() => Linking.openURL(`mailto:${site.primaryEmail}`)}
              testID="contact-email-link"
            >
              <View
                style={[styles.contactIcon, { backgroundColor: colors.accent, borderRadius: colors.radius }]}
              >
                <Feather name="mail" size={16} color={colors.secondary} />
              </View>
              <Text style={[styles.contactRowText, { color: colors.foreground }]}>
                {site.primaryEmail}
              </Text>
            </Pressable>
          )}
          {(site?.city || site?.state || site?.country) && (
            <View style={styles.contactRow}>
              <View
                style={[styles.contactIcon, { backgroundColor: colors.accent, borderRadius: colors.radius }]}
              >
                <Feather name="map-pin" size={16} color={colors.secondary} />
              </View>
              <Text style={[styles.contactRowText, { color: colors.foreground }]}>
                {[site?.city, site?.state, site?.country].filter(Boolean).join(', ')}
              </Text>
            </View>
          )}
        </View>
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
  field: { flex: 1, gap: 6 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  textArea: { minHeight: 110, textAlignVertical: 'top' },
  errorText: { fontSize: 12, marginTop: 2 },
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
  contactInfoCard: { padding: 20, borderWidth: 1, gap: 14 },
  contactInfoTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  contactRowText: { fontSize: 14, fontWeight: '600', flex: 1 },
});
