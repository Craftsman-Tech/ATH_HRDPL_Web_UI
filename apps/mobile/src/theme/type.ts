/**
 * ============================================================================
 *  TYPE PRESETS — Vexoo Mobile
 * ============================================================================
 *  A closed set of text styles. Screens should compose these rather than
 *  hand-rolling `fontSize` + `fontWeight` pairs, which is what made the old
 *  UI read as generic: everything was 14px semibold.
 *
 *  The hierarchy that makes the brand feel considered:
 *    - Fraunces (serif) for anything that states WHAT a screen is — page
 *      titles, hero numerals, sheet titles. Always negative tracking.
 *    - Inter Tight for everything the user reads or acts on.
 *    - Uppercase micro-labels with wide tracking to separate groups, instead
 *      of drawing another box.
 *
 *  Colour is deliberately NOT baked in — pass it at the call site from the
 *  active theme, e.g. `[T.title, { color: theme.text }]`.
 * ============================================================================
 */
import { StyleSheet } from 'react-native';
import { body, display, mono } from './fonts';

export const T = StyleSheet.create({
  // ── Display (Fraunces) ──────────────────────────────────────────────────
  hero: {
    fontFamily: display(400),
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1.4,
  },
  h1: {
    fontFamily: display(400),
    fontSize: 32,
    lineHeight: 37,
    letterSpacing: -1.1,
  },
  h2: {
    fontFamily: display(400),
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.85,
  },
  h3: {
    fontFamily: display(500),
    fontSize: 21,
    lineHeight: 26,
    letterSpacing: -0.5,
  },
  /** Big metric numerals on stat tiles. */
  numeral: {
    fontFamily: display(500),
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -1,
  },
  numeralSm: {
    fontFamily: display(500),
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.7,
  },

  // ── UI (Inter Tight) ────────────────────────────────────────────────────
  /** Card headings, row titles. */
  title: {
    fontFamily: body(700),
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  titleSm: {
    fontFamily: body(700),
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontFamily: body(500),
    fontSize: 14,
    lineHeight: 20,
  },
  bodyText: {
    fontFamily: body(400),
    fontSize: 14,
    lineHeight: 21,
  },
  bodyStrong: {
    fontFamily: body(600),
    fontSize: 14,
    lineHeight: 21,
  },
  small: {
    fontFamily: body(400),
    fontSize: 13,
    lineHeight: 19,
  },
  smallStrong: {
    fontFamily: body(600),
    fontSize: 13,
    lineHeight: 19,
  },
  caption: {
    fontFamily: body(400),
    fontSize: 12,
    lineHeight: 17,
  },
  captionStrong: {
    fontFamily: body(600),
    fontSize: 12,
    lineHeight: 17,
  },

  // ── Micro-labels ────────────────────────────────────────────────────────
  /** Field labels above inputs. */
  label: {
    fontFamily: body(600),
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  /** Section eyebrows — the smallest, widest text in the system. */
  eyebrow: {
    fontFamily: body(700),
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  /** Status chip text. */
  chip: {
    fontFamily: body(700),
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  /** Button labels. */
  button: {
    fontFamily: body(700),
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  buttonSm: {
    fontFamily: body(700),
    fontSize: 13,
    lineHeight: 17,
  },
  /** Bottom-tab labels. */
  tab: {
    fontFamily: body(600),
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.2,
  },

  // ── Mono ────────────────────────────────────────────────────────────────
  /** Patient IDs, tokens, order numbers. */
  mono: {
    fontFamily: mono(500),
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.2,
  },
  monoLg: {
    fontFamily: mono(500),
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: -0.3,
  },
});
