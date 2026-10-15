// ============================================================================
//  mockHospitals.ts — Vexoo Patient Portal
//  Hospital directory used by the enhanced "Book New" appointment flow:
//  hospital-type filter, nearby-hospital cards (image + rating + reviews +
//  details), and the booking-confirmation message content.
//  MOCK — replace with backend /hospitals endpoint when available.
// ============================================================================

export type HospitalType =
  | 'Multispeciality'
  | 'Cardiac'
  | 'Orthopedic'
  | 'Pediatric'
  | 'Eye Care'
  | 'Maternity'
  | 'Cancer Care'
  | 'General';

export interface HospitalReview {
  author: string;
  rating: number;   // 1–5
  text:   string;
  date:   string;
}

export interface Hospital {
  id:          string;
  name:        string;
  type:        HospitalType;
  image:       string;
  rating:      number;        // average, e.g. 4.6
  reviewCount: number;
  distanceKm:  number;
  area:        string;
  address:     string;
  mapsQuery:   string;        // used to build the Google Maps link
  phone:       string;
  beds:        number;
  established: number;
  hours:       string;
  highlights:  string[];
  departments: string[];
  doctors:     string[];
  reviews:     HospitalReview[];
}

// Filter chips shown above the hospital list. 'All' is handled in the UI.
export const HOSPITAL_TYPES: HospitalType[] = [
  'Multispeciality', 'Cardiac', 'Orthopedic', 'Pediatric',
  'Eye Care', 'Maternity', 'Cancer Care', 'General',
];

// Bookable slots, grouped by part of day.
export const TIME_SLOTS: { group: string; slots: string[] }[] = [
  { group: 'Morning',   slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:30 AM'] },
  { group: 'Afternoon', slots: ['12:00 PM', '12:30 PM', '02:00 PM', '03:00 PM', '04:30 PM'] },
  { group: 'Evening',   slots: ['05:00 PM', '05:30 PM', '06:00 PM', '07:00 PM'] },
];

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=70`;

export const HOSPITALS: Hospital[] = [
  {
    id: 'H-001', name: 'Apollo Multispeciality Hospital', type: 'Multispeciality',
    image: U('1519494026892-80bbd2d6fd0d'),
    rating: 4.7, reviewCount: 2841, distanceKm: 2.3, area: 'Jubilee Hills',
    address: 'Rd No. 72, Jubilee Hills, Hyderabad, Telangana 500033',
    mapsQuery: 'Apollo Hospital Jubilee Hills Hyderabad',
    phone: '+91 40 2360 7777', beds: 550, established: 1988, hours: 'Open 24 hours',
    highlights: ['24/7 Emergency', 'NABH Accredited', 'ICU & Trauma Care'],
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine', 'Oncology'],
    doctors: ['Dr. Amy Chen', 'Dr. Raj Patel', 'Dr. Sarah Kim', 'Any Available'],
    reviews: [
      { author: 'Priya R.',  rating: 5, text: 'Excellent cardiac team and very clean facilities. Wait times were short.', date: 'May 2026' },
      { author: 'Imran S.',  rating: 4, text: 'Good doctors, though parking can be tricky on weekends.', date: 'Apr 2026' },
    ],
  },
  {
    id: 'H-002', name: 'CARE Heart Institute', type: 'Cardiac',
    image: U('1586773860418-d37222d8fce3'),
    rating: 4.8, reviewCount: 1620, distanceKm: 3.8, area: 'Banjara Hills',
    address: 'Rd No. 1, Banjara Hills, Hyderabad, Telangana 500034',
    mapsQuery: 'CARE Hospital Banjara Hills Hyderabad',
    phone: '+91 40 6165 6565', beds: 320, established: 1997, hours: 'Open 24 hours',
    highlights: ['Cath Lab', '24/7 Cardiac Emergency', 'Heart Transplant Unit'],
    departments: ['Cardiology', 'Cardiac Surgery', 'Electrophysiology'],
    doctors: ['Dr. Vikram Rao', 'Dr. Meera Sharma', 'Any Available'],
    reviews: [
      { author: 'Lakshmi N.', rating: 5, text: 'They handled my fathers angioplasty brilliantly. Forever grateful.', date: 'May 2026' },
      { author: 'Sandeep K.', rating: 5, text: 'Best cardiac care in the city. Attentive nursing staff.', date: 'Mar 2026' },
    ],
  },
  {
    id: 'H-003', name: 'Sunshine Orthopedic Centre', type: 'Orthopedic',
    image: U('1538108149393-fbbd81895907'),
    rating: 4.5, reviewCount: 980, distanceKm: 5.1, area: 'Secunderabad',
    address: 'Paradise Circle, Secunderabad, Telangana 500003',
    mapsQuery: 'Sunshine Hospital Secunderabad Hyderabad',
    phone: '+91 40 4567 8900', beds: 210, established: 2009, hours: 'Open 24 hours',
    highlights: ['Joint Replacement', 'Sports Injury Clinic', 'Physiotherapy'],
    departments: ['Orthopedics', 'Spine Surgery', 'Rehabilitation'],
    doctors: ['Dr. Arjun Mehta', 'Dr. Sarah Kim', 'Any Available'],
    reviews: [
      { author: 'Ravi T.',  rating: 5, text: 'Knee replacement went smoothly, walking again within weeks.', date: 'Apr 2026' },
      { author: 'Deepa M.', rating: 4, text: 'Good ortho team. Billing took a little long.', date: 'Feb 2026' },
    ],
  },
  {
    id: 'H-004', name: 'Rainbow Children\u2019s Hospital', type: 'Pediatric',
    image: U('1551076805-e1869033e561'),
    rating: 4.6, reviewCount: 1450, distanceKm: 4.0, area: 'Banjara Hills',
    address: 'Rd No. 4, Banjara Hills, Hyderabad, Telangana 500034',
    mapsQuery: 'Rainbow Childrens Hospital Banjara Hills Hyderabad',
    phone: '+91 40 4455 6677', beds: 180, established: 1999, hours: 'Open 24 hours',
    highlights: ['NICU & PICU', 'Child Vaccination', 'Pediatric Emergency'],
    departments: ['Pediatrics', 'Neonatology', 'Pediatric Surgery'],
    doctors: ['Dr. Anita Reddy', 'Dr. Amy Chen', 'Any Available'],
    reviews: [
      { author: 'Sneha P.',  rating: 5, text: 'Wonderful with kids. My daughter wasnt scared at all.', date: 'May 2026' },
      { author: 'Karthik V.', rating: 4, text: 'Caring staff, clean wards. Slightly pricey.', date: 'Mar 2026' },
    ],
  },
  {
    id: 'H-005', name: 'L V Prasad Eye Institute', type: 'Eye Care',
    image: U('1504439468489-c8920d796a29'),
    rating: 4.9, reviewCount: 3120, distanceKm: 6.4, area: 'Road No. 2, Banjara Hills',
    address: 'Kallam Anji Reddy Campus, Banjara Hills, Hyderabad 500034',
    mapsQuery: 'L V Prasad Eye Institute Hyderabad',
    phone: '+91 40 3061 2345', beds: 140, established: 1987, hours: '8:00 AM – 8:00 PM',
    highlights: ['LASIK Centre', 'Retina Clinic', 'Cornea Transplant'],
    departments: ['Ophthalmology', 'Retina', 'Cornea', 'Glaucoma'],
    doctors: ['Dr. Neha Gupta', 'Dr. Raj Patel', 'Any Available'],
    reviews: [
      { author: 'Mohan R.', rating: 5, text: 'World-class eye care. Cataract surgery was painless.', date: 'Apr 2026' },
      { author: 'Asha B.',  rating: 5, text: 'Very thorough eye examination. Highly recommend.', date: 'Feb 2026' },
    ],
  },
  {
    id: 'H-006', name: 'Fernandez Maternity Hospital', type: 'Maternity',
    image: U('1629909613654-28e377c37b09'),
    rating: 4.7, reviewCount: 2010, distanceKm: 3.2, area: 'Hyderguda',
    address: 'Bogulkunta, Hyderguda, Hyderabad, Telangana 500001',
    mapsQuery: 'Fernandez Hospital Hyderguda Hyderabad',
    phone: '+91 40 4012 3456', beds: 160, established: 1948, hours: 'Open 24 hours',
    highlights: ['Birthing Suites', 'Fetal Medicine', 'Lactation Support'],
    departments: ['Obstetrics', 'Gynecology', 'Neonatology'],
    doctors: ['Dr. Priya Nair', 'Dr. Sarah Kim', 'Any Available'],
    reviews: [
      { author: 'Divya S.',  rating: 5, text: 'Felt safe and supported through my whole pregnancy.', date: 'May 2026' },
      { author: 'Naveen G.', rating: 4, text: 'Great maternity care. Reception was a bit busy.', date: 'Mar 2026' },
    ],
  },
  {
    id: 'H-007', name: 'Omega Cancer Care Hospital', type: 'Cancer Care',
    image: U('1516574187841-cb9cc2ca948b'),
    rating: 4.6, reviewCount: 890, distanceKm: 7.8, area: 'Gachibowli',
    address: 'Financial District, Gachibowli, Hyderabad, Telangana 500032',
    mapsQuery: 'Omega Hospitals Gachibowli Hyderabad',
    phone: '+91 40 2354 5454', beds: 240, established: 2005, hours: 'Open 24 hours',
    highlights: ['Radiation Oncology', 'Chemotherapy Day Care', 'PET-CT'],
    departments: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology'],
    doctors: ['Dr. Sanjay Verma', 'Dr. Amy Chen', 'Any Available'],
    reviews: [
      { author: 'Geeta R.',  rating: 5, text: 'Compassionate oncology team. Explained every step clearly.', date: 'Apr 2026' },
      { author: 'Suresh M.', rating: 4, text: 'Good treatment, supportive counselors for the family.', date: 'Jan 2026' },
    ],
  },
  {
    id: 'H-008', name: 'City General Hospital', type: 'General',
    image: U('1632833239869-a37e3a5806d2'),
    rating: 4.3, reviewCount: 670, distanceKm: 1.6, area: 'Ameerpet',
    address: 'Main Rd, Ameerpet, Hyderabad, Telangana 500016',
    mapsQuery: 'City General Hospital Ameerpet Hyderabad',
    phone: '+91 40 2374 1100', beds: 300, established: 1995, hours: 'Open 24 hours',
    highlights: ['24/7 OPD', 'Diagnostics Lab', 'Pharmacy On-site'],
    departments: ['General Medicine', 'General Surgery', 'ENT', 'Dermatology'],
    doctors: ['Dr. Raj Patel', 'Dr. Arjun Mehta', 'Any Available'],
    reviews: [
      { author: 'Farhan A.', rating: 4, text: 'Convenient and affordable for routine check-ups.', date: 'May 2026' },
      { author: 'Manju L.',  rating: 4, text: 'Quick OPD, friendly doctors. Decent for general care.', date: 'Mar 2026' },
    ],
  },
];
