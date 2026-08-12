export type LabModuleId = 'dashboard'|'inhouse'|'external'|'collection'|'processing'|'results'|'completed'|'inventory'|'equipment'|'reports'|'settings';
export type Priority = 'STAT'|'Urgent'|'Routine';
export type LabOrder = { id:string; queue:'inhouse'|'external'; patient:string; pid:string; tests:string[]; doctor:string; department:string; priority:Priority; status:'New'|'Accepted'; time:string; barcode?:string; phone?:string };
export type Sample = { orderId:string; barcode:string; patient:string; pid:string; tests:string[]; doctor:string; sampleType:string; status:'Pending'|'Collected'|'Rejected'; collectedAt?:string };
export type ProcessingSample = Omit<Sample,'status'> & { status:'Ready'|'Running'|'Paused'|'Completed'; equipment:string; qc:'Pending'|'Pass'|'Fail' };
export type Result = { id:string; patient:string; pid:string; tests:string[]; doctor:string; values:Record<string,string>; flag:'Normal'|'Abnormal'|'Critical'; remarks:string };
export type CompletedTest = { id:string; patient:string; pid:string; tests:string[]; doctor:string; completed:string; outcome:'Normal'|'Abnormal'|'Critical'; validatedBy:string };
export type InventoryItem = { id:string; name:string; category:string; batch:string; stock:number; unit:string; reorder:number; expiry:string; state:'OK'|'Low'|'Expiring'|'Out' };
export type EquipmentItem = { id:string; name:string; model:string; status:'Online'|'Calibration Due'|'Maintenance'|'Offline'; load:string; nextCalib:string; uptime:string };

export const LAB_MODULES:{id:LabModuleId;label:string}[]=[
  {id:'dashboard',label:'Dashboard'},{id:'inhouse',label:'In-House Queue'},{id:'external',label:'External Queue'},
  {id:'collection',label:'Sample Collection'},{id:'processing',label:'Sample Processing'},{id:'results',label:'Test Results'},
  {id:'completed',label:'Completed Tests'},{id:'inventory',label:'Inventory'},{id:'equipment',label:'Equipment'},
  {id:'reports',label:'Reports & Analytics'},{id:'settings',label:'Settings'},
];
export const TEST_CATALOG = ['Complete Blood Count','Lipid Profile','Liver Function Test','HbA1c','Thyroid Profile','Renal Function Test','Troponin I','Urine Routine'];
export const SAMPLE_TYPES = ['Whole Blood (EDTA)','Serum','Plasma','Urine'];
export const EQUIPMENT_NAMES = ['Sysmex XN-1000','Cobas c311','Afinion 2','Mindray CL-900i'];
export const LAB_ORDERS:LabOrder[]=[
  {id:'LAB-2041',queue:'inhouse',patient:'Aarav Sharma',pid:'P-001',tests:['Complete Blood Count'],doctor:'Dr. Meera Iyer',department:'General Medicine',priority:'STAT',status:'New',time:'09:05',phone:'+91 98765 41001'},
  {id:'LAB-2042',queue:'inhouse',patient:'Fatima Khan',pid:'P-014',tests:['Lipid Profile','HbA1c'],doctor:'Dr. Arjun Rao',department:'Cardiology',priority:'Urgent',status:'New',time:'09:22'},
  {id:'LAB-2043',queue:'inhouse',patient:'Rohan Das',pid:'P-027',tests:['Liver Function Test'],doctor:'Dr. Meera Iyer',department:'Gastroenterology',priority:'Routine',status:'Accepted',time:'09:40'},
  {id:'EXT-7001',queue:'external',patient:'Nisha Patel',pid:'W-101',tests:['Thyroid Profile'],doctor:'Self / Walk-in',department:'Walk-in',priority:'Routine',status:'New',time:'10:10'},
];
export const LAB_SAMPLES:Sample[]=[{orderId:'LAB-2038',barcode:'BC-93018',patient:'Vikram Singh',pid:'P-009',tests:['Renal Function Test'],doctor:'Dr. Arjun Rao',sampleType:'Serum',status:'Pending'}];
export const LAB_PROCESSING:ProcessingSample[]=[{orderId:'LAB-2036',barcode:'BC-93016',patient:'Ananya Reddy',pid:'P-005',tests:['Complete Blood Count'],doctor:'Dr. Meera Iyer',sampleType:'Whole Blood (EDTA)',status:'Ready',equipment:'Sysmex XN-1000',qc:'Pending'}];
export const LAB_RESULTS:Result[]=[{id:'LAB-2032',patient:'Kabir Mehta',pid:'P-031',tests:['HbA1c'],doctor:'Dr. Arjun Rao',values:{HbA1c:''},flag:'Normal',remarks:''}];
export const LAB_COMPLETED:CompletedTest[]=[{id:'LAB-2028',patient:'Ishita Bose',pid:'P-022',tests:['Lipid Profile'],doctor:'Dr. Meera Iyer',completed:'Today, 08:42',outcome:'Normal',validatedBy:'Kevin Liu'}];
export const LAB_INVENTORY:InventoryItem[]=[
 {id:'INV-01',name:'CBC Diluent',category:'Reagents',batch:'CB-2408',stock:12,unit:'bottles',reorder:8,expiry:'30 Sep 2026',state:'OK'},
 {id:'INV-02',name:'HbA1c Test Cartridge',category:'Test Kits',batch:'HA-119',stock:5,unit:'packs',reorder:10,expiry:'14 Aug 2026',state:'Low'},
 {id:'INV-03',name:'Serum Separator Tubes',category:'Consumables',batch:'SST-88',stock:0,unit:'boxes',reorder:5,expiry:'20 Dec 2027',state:'Out'},
];
export const LAB_EQUIPMENT:EquipmentItem[]=[
 {id:'EQ-01',name:'Sysmex XN-1000',model:'XN-1000',status:'Online',load:'42%',nextCalib:'18 Jul 2026',uptime:'99.4%'},
 {id:'EQ-02',name:'Cobas c311',model:'c311',status:'Calibration Due',load:'18%',nextCalib:'Today',uptime:'98.1%'},
 {id:'EQ-03',name:'Afinion 2',model:'AS100',status:'Maintenance',load:'0%',nextCalib:'25 Jul 2026',uptime:'96.7%'},
];
