/**
 * ============================================================================
 *  Sheet — Vexoo Mobile
 * ============================================================================
 *  The bottom sheet every portal opens for detail, edit and support flows.
 *
 *  Upgrades over the previous modal:
 *    - A grabber, so it reads as draggable furniture rather than a page.
 *    - A dimmed, blurred-feeling scrim that fades in rather than appearing.
 *    - A real close button instead of the letter "X".
 *    - Bottom safe-area padding, so actions clear the home indicator.
 *    - A sticky footer slot, so primary actions stay reachable in long forms
 *      instead of being stranded below the fold.
 * ============================================================================
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { T, elevation } from '../theme';
import { IconButton } from './Button';

export interface SheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Pinned action bar at the bottom. */
  footer?: React.ReactNode;
  /** Fraction of the screen the sheet may occupy. */
  maxHeight?: `${number}%`;
  /** Content is laid out by the caller (e.g. a FlatList) — skip the ScrollView. */
  scroll?: boolean;
}

export function Sheet({
  visible,
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxHeight = '90%',
  scroll = true,
}: SheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      // Deliberately NOT statusBarTranslucent. That flag puts the modal window
      // into FLAG_LAYOUT_NO_LIMITS, which cancels the activity's adjustResize —
      // so the keyboard covered the sheet's pinned footer and you could not see
      // what you were typing in the chat composer. Letting the window resize is
      // worth more than extending the scrim over the status bar.
      onRequestClose={onClose}
    >
      {/*
        A nested SafeAreaProvider is required, not optional. A RN Modal is its
        own window, and `useSafeAreaInsets()` read from the app-level provider
        reports the APP window's insets — which are zero at the bottom, because
        the app itself is not edge-to-edge. Combined with statusBarTranslucent
        that laid the pinned footer out underneath the gesture bar, leaving its
        buttons unreachable. This provider measures the modal window itself.
      */}
      <SafeAreaProvider>
        <SheetContent
          title={title}
          subtitle={subtitle}
          onClose={onClose}
          footer={footer}
          maxHeight={maxHeight}
          scroll={scroll}
          visible={visible}
        >
          {children}
        </SheetContent>
      </SafeAreaProvider>
    </Modal>
  );
}

function SheetContent({
  visible,
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxHeight,
  scroll,
}: Omit<SheetProps, 'maxHeight' | 'scroll'> & { maxHeight: `${number}%`; scroll: boolean }) {
  const { theme, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: visible ? 1 : 0,
      duration: visible ? 220 : 140,
      useNativeDriver: true,
    }).start();
  }, [visible, fade]);

  const bodyPadding = footer ? spacing.xl : spacing.xl + insets.bottom;

  return (
    <>
      <View style={styles.root}>
        <Animated.View style={[styles.scrimWrap, { opacity: fade }]}>
          <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Dismiss" />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.lift}
        >
          <View
            style={[
              styles.sheet,
              elevation('xl', mode),
              { backgroundColor: theme.card, maxHeight, borderColor: theme.hairline },
              // When the caller supplies its own scroller (the chat thread),
              // give the sheet a definite height. Otherwise the body's `flex: 1`
              // resolves against an auto-height parent and collapses to zero,
              // so the thread renders blank between header and composer.
              !scroll && { height: maxHeight },
            ]}
          >
            <View style={styles.grabWrap}>
              <View style={[styles.grab, { backgroundColor: theme.borderStrong }]} />
            </View>

            <View style={[styles.head, { borderBottomColor: theme.hairline }]}>
              <View style={styles.headText}>
                <Text style={[T.h3, { color: theme.text }]} numberOfLines={2}>
                  {title}
                </Text>
                {subtitle ? (
                  <Text style={[T.small, { color: theme.textMuted, marginTop: 3 }]} numberOfLines={3}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>
              <IconButton name="close" onPress={onClose} size={38} accessibilityLabel="Close" />
            </View>

            {scroll ? (
              <ScrollView
                // Must be allowed to shrink: inside a maxHeight sheet an
                // unconstrained ScrollView grows to its content height and
                // pushes the pinned footer off the bottom of the screen.
                style={styles.scrollArea}
                contentContainerStyle={[styles.body, { paddingBottom: bodyPadding }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            ) : (
              <View style={[styles.body, styles.flex]}>{children}</View>
            )}

            {footer ? (
              <View
                style={[
                  styles.footer,
                  {
                    backgroundColor: theme.card,
                    borderTopColor: theme.hairline,
                    paddingBottom: spacing.lg + insets.bottom,
                  },
                ]}
              >
                {footer}
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

/** The standard two-button footer: a ghost dismiss beside a primary action. */
export function SheetActions({ children }: { children: React.ReactNode }) {
  return <View style={styles.actions}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrimWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  scrim: {
    backgroundColor: 'rgba(6,12,11,0.55)',
    flex: 1,
  },
  lift: {
    // `flex: 1` is load-bearing. Without a definite height here the sheet's
    // `maxHeight: '90%'` has nothing to resolve against, so a long form grows
    // past the bottom of the screen and takes the pinned footer with it.
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    overflow: 'hidden',
  },
  grabWrap: {
    alignItems: 'center',
    paddingBottom: spacing.xs,
    paddingTop: spacing.md,
  },
  grab: {
    borderRadius: radius.pill,
    height: 4,
    opacity: 0.5,
    width: 38,
  },
  head: {
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  headText: {
    flex: 1,
    minWidth: 0,
  },
  scrollArea: {
    flexGrow: 0,
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  flex: {
    flex: 1,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
