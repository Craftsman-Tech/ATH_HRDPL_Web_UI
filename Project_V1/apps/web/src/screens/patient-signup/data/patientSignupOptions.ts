/**
 * patientSignupOptions.ts — reference data for the patient sign-up form.
 *
 * RELATIONS drives the family multi-select (order = dropdown order). STATES is
 * the full India States + UTs list, mirrored from the hospital-registration
 * feature so the address dropdown matches the rest of the platform.
 */
import type { RelationConfig } from '../types/patientSignup.types';

/** Family relations a patient can attach. `multiple` → "Add another" allowed. */
export const RELATIONS: RelationConfig[] = [
  { id: 'spouse',   label: 'Spouse',   multiple: false },
  { id: 'father',   label: 'Father',   multiple: false },
  { id: 'mother',   label: 'Mother',   multiple: false },
  { id: 'children', label: 'Children', multiple: true,  singular: 'child'   },
  { id: 'in-laws',  label: 'In-laws',  multiple: true,  singular: 'in-law'  },
];

export const STATES: string[] = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
  'Other…',
];
