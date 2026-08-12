/**
 * ============================================================================
 *  AppHeader — Vexoo Mobile
 * ============================================================================
 *  The portal header, rebuilt on InkPanel so it carries the same grid texture
 *  and mineral glow as the web sidebar rather than being a flat navy block.
 *
 *  Structure, top to bottom:
 *    row 1  ☰   Vexoo · <portal>              ☀  ?  <avatar>
 *    row 2  <eyebrow: greeting>
 *           <serif page title>                <live clock>
 *    row 3  <module pill>   <subtitle>
 *
 *  The title uses Fraunces — it's the one place per screen where the brand
 *  voice shows up, which is what stops every portal looking like the same
 *  grey admin template.
 * ============================================================================
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { T, alpha } from '../theme';
import { Avatar } from './Avatar';
import { Icon, type IconName } from './Icon';
import { InkPanel } from './InkPanel';
import { Touchable } from './Touchable';
import { VexooGlyph } from './VexooMark';

const PAPER = '#FAFAF7';

/** A translucent icon control that sits on ink. */
function InkAction({
  icon,
  onPress,
  label,
}: {
  icon: IconName;
  onPress?: () => void;
  label?: string;
}) {
  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label ?? icon}
      style={styles.inkAction}
    >
      <Icon name={icon} size={18} color={PAPER} strokeWidth={2} />
    </Touchable>
  );
}

export interface AppHeaderProps {
  /** The page title — module name, in the display serif. */
  title: string;
  subtitle?: string;
  /** "Doctor Portal", "Pharmacy" … shown beside the wordmark. */
  roleLabel: string;
  userName: string;
  accent: string;
  /** Small pill under the title showing the active module. */
  modulePill?: string;
  /** Shows a live clock beside the title. */
  showClock?: boolean;
  onMenu?: () => void;
  onProfile?: () => void;
  onHelp?: () => void;
  /** Extra content docked under the header text — search bars, filter rails. */
  children?: React.ReactNode;
}

export function AppHeader({
  title,
  subtitle,
  roleLabel,
  userName,
  accent,
  modulePill,
  showClock = false,
  onMenu,
  onProfile,
  onHelp,
  children,
}: AppHeaderProps) {
  const { mode, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!showClock) return undefined;
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, [showClock]);

  return (
    <InkPanel
      accent={accent}
      glowPosition="top"
      height={280}
      style={[styles.panel, { paddingTop: insets.top + spacing.sm }]}
    >
      {/* Row 1 — chrome */}
      <View style={styles.topRow}>
        {onMenu ? <InkAction icon="menu" onPress={onMenu} label="Open menu" /> : null}

        <View style={styles.brand}>
          <View style={[styles.mark, { backgroundColor: accent }]}>
            <VexooGlyph size={17} color={PAPER} />
          </View>
          <View style={styles.brandText}>
            <Text style={[T.titleSm, { color: PAPER }]} numberOfLines={1}>
              Vexoo One
            </Text>
            <Text style={[T.eyebrow, { color: alpha(PAPER, 0.5) }]} numberOfLines={1}>
              {roleLabel}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <InkAction icon={mode === 'light' ? 'moon' : 'sun'} onPress={toggle} label="Toggle theme" />
          {onHelp ? <InkAction icon="help" onPress={onHelp} label="Help and support" /> : null}
          {onProfile ? (
            <Touchable onPress={onProfile} accessibilityLabel="Open profile">
              <Avatar name={userName} size={38} color={accent} solid ring={alpha(PAPER, 0.18)} />
            </Touchable>
          ) : null}
        </View>
      </View>

      {/* Row 2 — identity + title */}
      <View style={styles.titleBlock}>
        <View style={styles.greetRow}>
          <View style={[styles.pulse, { backgroundColor: '#1FBFA0' }]} />
          <Text style={[T.eyebrow, { color: alpha(PAPER, 0.62) }]} numberOfLines={1}>
            Hi, {userName}
          </Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={[T.h1, styles.title, { color: PAPER }]} numberOfLines={2}>
            {title}
          </Text>
          {showClock ? (
            <View style={styles.clock}>
              <Text style={[T.monoLg, { color: PAPER }]}>
                {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={[T.caption, { color: alpha(PAPER, 0.55) }]}>
                {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Text>
            </View>
          ) : null}
        </View>

        {modulePill || subtitle ? (
          <View style={styles.metaRow}>
            {modulePill ? (
              <View style={[styles.pill, { backgroundColor: alpha(accent, 0.3), borderColor: alpha(PAPER, 0.16) }]}>
                <Text style={[T.chip, { color: PAPER }]} numberOfLines={1}>
                  {modulePill}
                </Text>
              </View>
            ) : null}
            {subtitle ? (
              <Text style={[T.caption, styles.subtitle, { color: alpha(PAPER, 0.62) }]} numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {children ? <View style={styles.slot}>{children}</View> : null}
    </InkPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderBottomLeftRadius: radius.xxl + 4,
    borderBottomRightRadius: radius.xxl + 4,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inkAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(250,250,247,0.10)',
    borderRadius: radius.md,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  brand: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm + 2,
    minWidth: 0,
  },
  mark: {
    alignItems: 'center',
    borderRadius: radius.sm,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  brandText: {
    flex: 1,
    minWidth: 0,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  titleBlock: {
    marginTop: spacing.xl + 2,
  },
  greetRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  pulse: {
    borderRadius: radius.pill,
    height: 6,
    width: 6,
  },
  titleRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  title: {
    flex: 1,
  },
  clock: {
    alignItems: 'flex-end',
    paddingBottom: 2,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  pill: {
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  subtitle: {
    flex: 1,
    minWidth: 160,
  },
  slot: {
    marginTop: spacing.lg,
  },
});
