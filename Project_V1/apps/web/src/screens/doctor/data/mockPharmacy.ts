/**
 * ============================================================================
 *  mockPharmacy.ts — medicines available in the hospital pharmacy
 * ============================================================================
 *  Powers the "Medicine" dropdown inside the Consultation form's Medications
 *  tab. TODO: migrate to packages/shared once the Pharmacist portal's
 *  inventory is wired to a real backend — this list should stay in sync
 *  with whatever the Pharmacist portal stocks.
 */

export const PHARMACY_MEDICINES: string[] = [
  'Lisinopril 10mg',
  'Lisinopril 5mg',
  'Amlodipine 5mg',
  'Amlodipine 10mg',
  'Atorvastatin 10mg',
  'Atorvastatin 20mg',
  'Metformin 500mg',
  'Metformin 1000mg',
  'Aspirin 81mg',
  'Aspirin 150mg',
  'HCTZ 12.5mg',
  'Losartan 50mg',
  'Amiodarone 200mg',
  'Salbutamol Inhaler',
  'Montelukast 10mg',
  'Sumatriptan 50mg',
  'Propranolol 40mg',
  'Ibuprofen 400mg',
  'Paracetamol 500mg',
  'Azithromycin 500mg',
  'Amoxicillin 500mg',
  'Pantoprazole 40mg',
  'Cetirizine 10mg',
  'Vitamin D3 60K',
  'Calcium + D3',
  'Ondansetron 4mg',
  'Insulin Glargine',
  'Levothyroxine 50mcg',
  'Sertraline 50mg',
  'Alprazolam 0.25mg',
];

// Dosage frequency options for the Medications tab
export const DOSAGE_FREQUENCIES: string[] = ['Once', 'Twice', 'Thrice'];

// Consume-time options for the Medications tab (multi-select — a medicine
// can be taken at more than one time of day, e.g. "Twice" → After Breakfast
// + After Dinner).
export const DOSAGE_TIMINGS: string[] = [
  'Before Breakfast',
  'After Breakfast',
  'Before Lunch',
  'After Lunch',
  'Before Dinner',
  'After Dinner',
];

// Reused for the Notes tab's "Lab Test Recommendation" multi-select
export const LAB_TESTS: string[] = [
  'CBC (Complete Blood Count)',
  'Metabolic Panel',
  'HbA1c',
  'Lipid Panel',
  'Thyroid Function (TSH)',
  'Troponin',
  'Urinalysis',
  'Coagulation (PT/INR)',
  'Liver Function',
  'CRP / ESR',
  'ECG',
  'Chest X-Ray',
  'MRI Brain',
  'Spirometry',
];
