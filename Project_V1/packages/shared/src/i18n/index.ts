/**
 * i18n exports + a tiny helper for screen components.
 *
 * Usage in any screen:
 *   import { useT } from '@vexoo/shared/i18n';
 *   const t = useT(lang);                // lang is whatever the user picked
 *   return <Text>{t.signIn.heading}</Text>
 *
 * The actual `useT` function is platform-specific (web uses Context, mobile
 * uses a hook on top of AsyncStorage), so each app provides its own. This
 * file just re-exports the data + types.
 */
export * from './strings';
