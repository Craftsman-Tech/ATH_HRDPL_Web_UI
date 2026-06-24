import type { Thread } from '../types/patient.types';

export const THREADS: Thread[] = [
  { id: 't1', name: 'Dr. Amy Chen',   spec: 'Cardiology',      time: 'Today',  unread: true,  preview: 'That\u2019s excellent! Keep it up and we\u2019ll review\u2026', msgs: [
    { from: 'doctor',  text: 'Hi Sarah, your blood pressure readings are looking much better! Keep up the great work with the lifestyle changes.' },
    { from: 'patient', text: 'Thank you Dr. Chen! I\u2019ve been walking 30 minutes every day and reduced my sodium intake.' },
    { from: 'doctor',  text: 'That\u2019s excellent! Those changes make a huge difference. We\u2019ll review your progress at the next appointment.' },
    { from: 'patient', text: 'Quick question \u2014 should I take my Lisinopril if my BP reads below 110/70?' },
  ]},
  { id: 't2', name: 'Dr. Raj Patel',  spec: 'General Medicine', time: 'Mon',    unread: false, preview: 'Your lab order has been sent to the lab.', msgs: [
    { from: 'doctor',  text: 'Your lab order has been sent to the lab. Please fast for 8 hours before your visit.' },
    { from: 'patient', text: 'Got it, thank you!' },
  ]},
  { id: 't3', name: 'Apollo Pharmacy',spec: 'Pharmacy',         time: 'Apr 18', unread: false, preview: 'Your prescription is ready for pickup.', msgs: [
    { from: 'doctor',  text: 'Your Aspirin 81mg prescription is ready for pickup at the front counter.' },
  ]},
];
