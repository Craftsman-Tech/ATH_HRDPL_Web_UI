/**
 * ============================================================================
 *  NavDrawer — Vexoo Mobile
 * ============================================================================
 *  The portal navigation, ported from the web sidebar rather than reinvented:
 *  ink ground, grid texture, mineral glow, and an active item marked by a
 *  tinted fill plus a 3pt bright rail on its leading edge —
 *
 *    .dr-nav-btn.active         { background: rgba(14,124,102,.20); }
 *    .dr-nav-btn.active::before { width: 3px; background: #1FBFA0; }
 *
 *  It slides in rather than cross-fading, and the scrim fades with it, so the
 *  panel reads as a physical layer over the screen.
 * ============================================================================
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing } from '@vexoo/shared';
import { T, alpha } from '../theme';
import { Avatar } from './Avatar';
import { Badge } from './Chip';
import { Icon, type IconName } from './Icon';
import { InkPanel } from './InkPanel';
import { Touchable } from './Touchable';

const PAPER = '#FAFAF7';
const WIDTH = Math.min(310, Dimensions.get('window').width * 0.84);

export interface NavItem<T extends string> {
  id: T;
  label: string;
  icon: IconName;
  badge?: number;
}

export function NavDrawer<T extends string>({
  visible,
  items,
  active,
  accent,
  roleLabel,
  userName,
  userEmail,
  onClose,
  onSelect,
  onProfile,
  onHelp,
  onSignOut,
}: {
  visible: boolean;
  items: NavItem<T>[];
  active: T;
  accent: string;
  roleLabel: string;
  userName: string;
  userEmail?: string;
  onClose: () => void;
  onSelect: (id: T) => void;
  onProfile?: () => void;
  onHelp?: () => void;
  onSignOut: () => void;
}) {
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 1 : 0,
      duration: visible ? 260 : 180,
      useNativeDriver: true,
    }).start();
  }, [visible, slide]);

  const translateX = slide.interpolate({ inputRange: [0, 1], outputRange: [-WIDTH, 0] });

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: slide }]}>
          <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close menu" />
        </Animated.View>

        <Animated.View style={[styles.panelWrap, { transform: [{ translateX }] }]}>
          <InkPanel accent={accent} glowPosition="corner" height={760} fill style={styles.panel}>
            {/* Identity */}
            <Touchable
              press="sm"
              onPress={() => { onClose(); onProfile?.(); }}
              style={[styles.identity, { marginTop: insets.top + spacing.md }]}
            >
              <Avatar name={userName} size={44} color={accent} solid />
              <View style={styles.identityText}>
                <Text style={[T.titleSm, { color: PAPER }]} numberOfLines={1}>
                  {userName}
                </Text>
                <Text style={[T.caption, { color: alpha(PAPER, 0.55) }]} numberOfLines={1}>
                  {userEmail ?? roleLabel}
                </Text>
              </View>
              {onProfile ? (
                <Icon name="chevronRight" size={16} color={alpha(PAPER, 0.4)} strokeWidth={2.2} />
              ) : null}
            </Touchable>

            <Text style={[T.eyebrow, styles.navEyebrow, { color: alpha(PAPER, 0.38) }]}>
              {roleLabel}
            </Text>

            {/* Nav */}
            <ScrollView
              style={styles.navScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.navList}
            >
              {items.map((item) => {
                const selected = item.id === active;
                return (
                  <Touchable
                    key={item.id}
                    press="none"
                    onPress={() => { onSelect(item.id); onClose(); }}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={[
                      styles.navItem,
                      selected && { backgroundColor: alpha(accent, 0.22) },
                    ]}
                  >
                    {selected ? <View style={[styles.rail, { backgroundColor: '#1FBFA0' }]} /> : null}
                    <Icon
                      name={item.icon}
                      size={18}
                      color={selected ? PAPER : alpha(PAPER, 0.6)}
                      strokeWidth={selected ? 2.2 : 1.8}
                    />
                    <Text
                      style={[
                        selected ? T.bodyStrong : T.subtitle,
                        styles.navLabel,
                        { color: selected ? PAPER : alpha(PAPER, 0.66) },
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    {item.badge ? <Badge value={item.badge} color={selected ? '#1FBFA0' : undefined} /> : null}
                  </Touchable>
                );
              })}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
              {onHelp ? (
                <Touchable press="sm" onPress={() => { onClose(); onHelp(); }} style={styles.footerBtn}>
                  <Icon name="help" size={17} color={alpha(PAPER, 0.7)} strokeWidth={2} />
                  <Text style={[T.smallStrong, styles.footerText, { color: alpha(PAPER, 0.8) }]}>
                    Help & Support
                  </Text>
                </Touchable>
              ) : null}
              <Touchable press="sm" onPress={() => { onClose(); onSignOut(); }} style={styles.footerBtn}>
                <Icon name="logout" size={17} color="#E27463" strokeWidth={2} />
                <Text style={[T.smallStrong, styles.footerText, { color: '#E27463' }]}>Sign out</Text>
              </Touchable>
            </View>
          </InkPanel>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  scrim: {
    backgroundColor: 'rgba(6,12,11,0.58)',
    flex: 1,
  },
  panelWrap: {
    height: '100%',
    width: WIDTH,
  },
  panel: {
    flex: 1,
    paddingHorizontal: spacing.md + 2,
  },
  identity: {
    alignItems: 'center',
    backgroundColor: 'rgba(250,250,247,0.06)',
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  identityText: {
    flex: 1,
    minWidth: 0,
  },
  navEyebrow: {
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
    marginTop: spacing.xl,
  },
  navScroll: {
    // Takes the slack between the identity card and the footer, which is what
    // pins Help & Sign out to the bottom of the drawer.
    flex: 1,
  },
  navList: {
    gap: 3,
    paddingBottom: spacing.lg,
  },
  navItem: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 46,
    paddingHorizontal: spacing.md + 2,
    position: 'relative',
  },
  rail: {
    borderBottomRightRadius: 3,
    borderTopRightRadius: 3,
    bottom: 9,
    left: 0,
    position: 'absolute',
    top: 9,
    width: 3,
  },
  navLabel: {
    flex: 1,
  },
  footer: {
    borderTopColor: 'rgba(250,250,247,0.09)',
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    gap: 2,
    paddingTop: spacing.md,
  },
  footerBtn: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.md + 2,
  },
  footerText: {
    flex: 1,
  },
});
