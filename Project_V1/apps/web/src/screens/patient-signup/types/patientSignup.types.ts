/**
 * patientSignup.types.ts — types for the public patient sign-up feature.
 *
 * `SignupForm` is a flat bag of the mandatory patient profile fields, so wiring
 * the backend POST later is a straight JSON.stringify(form). Family members are
 * a separate list (one entry per added relation), each keyed by a `RelationId`.
 */

/** The two entry methods on the first step. */
export type SignupMethod = 'google' | 'email';

/** Which screen the orchestrator is showing. */
export type SignupStage = 'method' | 'details' | 'done';

/** Family relations the patient can attach. Order = dropdown order. */
export type RelationId = 'spouse' | 'father' | 'mother' | 'children' | 'in-laws';

export interface RelationConfig {
  id: RelationId;
  label: string;
  /** true → patient may add more than one (Children, In-laws). */
  multiple: boolean;
  /** singular noun for the "Add another …" button (e.g. Children → child). */
  singular?: string;
}

/** A single family member's details. */
export interface FamilyMember {
  /** stable row key */
  key: string;
  relation: RelationId;
  name?: string;
  age?: string;
  phone?: string;
  aadhar?: string;
}

/** Flat, all-optional so the generic field setter can index it by key. */
export interface SignupForm {
  // Identity (from Google / Email step)
  fullName?: string;
  email?: string;
  // Mandatory profile
  phone?: string;
  aadhar?: string;
  // Address
  street?: string;
  city?: string;
  district?: string;
  state?: string;
  pin?: string;
}

/** set('phone') -> onChange handler. Works for input / select / textarea. */
export type FieldSetter = (
  key: keyof SignupForm,
) => (e: { target: { value: string } }) => void;
