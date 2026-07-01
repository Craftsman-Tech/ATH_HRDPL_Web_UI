import type { Convo } from '../types/doctor.types';

export const CONVOS: Convo[] = [
  { name:'Sarah Johnson', last:'When should I take my medication?', time:'2m', unread:2, msgs:[
    { from:'patient', text:'Hi Dr. Chen, when exactly should I take my Lisinopril?', time:'9:45 AM' },
    { from:'doctor',  text:'Good morning Sarah! Take it first thing in the morning, ideally at the same time each day.', time:'9:52 AM' },
    { from:'patient', text:'Should I take it with food or on an empty stomach?', time:'9:53 AM' },
  ]},
  { name:'Marcus Williams', last:'Thank you doctor', time:'1h', unread:0, msgs:[
    { from:'patient', text:'Doctor, my blood sugar has been high this week.', time:'8:00 AM' },
    { from:'doctor',  text:'Please check your levels after each meal and share the readings.', time:'8:30 AM' },
    { from:'patient', text:'Will do. Thank you doctor.', time:'8:35 AM' },
  ]},
  { name:'Pharmacy Team', last:'RX-4823 dispensed', time:'3h', unread:1, msgs:[
    { from:'patient', text:"RX-4823 — Amiodarone 200mg has been dispensed to James O'Brien.", time:'6:30 AM' },
  ]},
];
