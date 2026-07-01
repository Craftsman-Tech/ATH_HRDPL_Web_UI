/**
 * register.types.ts — types for the public hospital-registration feature.
 *
 * `RegistrationForm` is a flat bag: every key maps 1:1 to a field the backend
 * onboarding endpoint will accept, so wiring the POST later is a straight
 * JSON.stringify(form). `DocId` keys the License-tab uploads.
 */

export type StepId = 1 | 2 | 3;

export type DocId = 'cea' | 'drug' | 'bmw' | 'gst' | 'pan' | 'fire';

export interface DocConfig {
  id: DocId;
  label: string;
  accept: string;
  meta: string;
  required: boolean;
}

/** Flat, all-optional so the generic field setter can index it by key. */
export interface RegistrationForm {
  // Step 1 — Hospital
  name?: string;
  type?: string;
  ownership?: string;
  beds?: string;
  est?: string;
  gstin?: string;
  pan?: string;
  specialities?: string;
  street?: string;
  city?: string;
  district?: string;
  pin?: string;
  state?: string;
  // Step 2 — Contact
  contactName?: string;
  designation?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  subdomain?: string;
  contact2Name?: string;
  contact2Phone?: string;
  // Step 3 — License
  cea?: string;
  ceaExp?: string;
  drug?: string;
  drugExp?: string;
  bmw?: string;
  fire?: string;
  nabh?: string;
  pndt?: string;
}

/** Uploaded filenames keyed by document id. */
export type UploadedFiles = Partial<Record<DocId, string>>;

/** set('name') -> onChange handler. Works for input / select / textarea. */
export type FieldSetter = (
  key: keyof RegistrationForm,
) => (e: { target: { value: string } }) => void;

/** Shared props passed from the orchestrator into each step component. */
export interface StepProps {
  form: RegistrationForm;
  set: FieldSetter;
}
