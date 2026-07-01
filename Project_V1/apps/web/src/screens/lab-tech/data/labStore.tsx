/**
 * ============================================================================
 *  labStore.tsx — shared lab pipeline store (React Context)
 * ============================================================================
 *  Owns every piece of state that moves BETWEEN screens, and exposes the
 *  actions that push an order down the lab pipeline:
 *
 *    In-House / External Queue
 *        └─ generateBarcode() ─────────────► Sample Collection (Pending)
 *                                                  └─ confirmCollection() ──► Sample Processing (Ready)
 *                                                                                  └─ completeProcessing() ──► Test Results
 *                                                                                                                   └─ submitResult() ──► Completed Tests
 *
 *  Each screen reads/mutates this one source of truth via useLab(), so data
 *  entered on one screen appears on the next — no prop drilling, no globals.
 *  TODO(backend): swap the seed arrays + actions for API calls.
 * ============================================================================
 */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type {
  TestOrder, SampleCollect, ProcessSample, PendingResult,
  CompletedTest, TestQueue, LabProfile, InventoryItem, EquipmentItem,
} from '../types/labtech.types';
import {
  INHOUSE_ORDERS, EXTERNAL_ORDERS, SAMPLES, PROCESS_SAMPLES,
  PENDING_RESULTS, COMPLETED_TESTS, INVENTORY, EQUIPMENT,
  catalogOf, paramsFor, DEFAULT_PROFILE, TODAY,
} from './mockLabData';

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

let barcodeSeq = 93030;
const nextBarcode = () => `BC-${barcodeSeq++}`;

const nowTime = () =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }).toUpperCase();

/** Full date + time stamp, e.g. "23 Jun 2026, 02:15 AM" — used for collection. */
const nowStamp = () =>
  new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/* ── Context value shape ────────────────────────────────────────────────── */
interface LabContextValue {
  inhouse: TestOrder[];
  external: TestOrder[];
  samples: SampleCollect[];
  processing: ProcessSample[];
  results: PendingResult[];
  completed: CompletedTest[];
  inventory: InventoryItem[];
  equipment: EquipmentItem[];
  profile: LabProfile;

  acceptOrder: (queue: TestQueue, id: string) => void;
  generateBarcode: (queue: TestQueue, id: string) => string;     // returns the barcode
  addExternalOrder: (o: {
    patient: string; age: number; gender: 'Male' | 'Female' | 'Other';
    tests: string[]; time: string; priority: TestOrder['priority'];
  }) => void;

  setSampleType: (barcode: string, sampleType: string[]) => void;
  confirmCollection: (barcode: string, collector: string, collectedAt?: string) => void;

  setEquipments: (barcode: string, equipments: string[]) => void;
  startProcessing: (barcode: string) => void;
  pauseProcessing: (barcode: string) => void;
  resumeProcessing: (barcode: string) => void;
  completeProcessing: (barcode: string) => void;

  updateResultParam: (id: string, testIdx: number, paramIdx: number, patch: Partial<PendingResult['tests'][number]['params'][number]>) => void;
  updateResultRemarks: (id: string, testIdx: number, remarks: string) => void;
  addResultAttachments: (id: string, testIdx: number, files: string[]) => void;
  submitResult: (id: string) => void;

  addInventory: (item: InventoryItem) => void;
  addEquipment: (item: EquipmentItem) => void;

  updateProfile: (patch: Partial<LabProfile>) => void;
}

const LabContext = createContext<LabContextValue | null>(null);

export const useLab = (): LabContextValue => {
  const ctx = useContext(LabContext);
  if (!ctx) throw new Error('useLab must be used inside <LabProvider>');
  return ctx;
};

/* ── Provider ───────────────────────────────────────────────────────────── */
export const LabProvider: React.FC<{ children: React.ReactNode; techName?: string }> = ({ children, techName }) => {
  const [inhouse, setInhouse]       = useState<TestOrder[]>(() => clone(INHOUSE_ORDERS));
  const [external, setExternal]     = useState<TestOrder[]>(() => clone(EXTERNAL_ORDERS));
  const [samples, setSamples]       = useState<SampleCollect[]>(() => clone(SAMPLES));
  const [processing, setProcessing] = useState<ProcessSample[]>(() => clone(PROCESS_SAMPLES));
  const [results, setResults]       = useState<PendingResult[]>(() => clone(PENDING_RESULTS));
  const [completed, setCompleted]   = useState<CompletedTest[]>(() => clone(COMPLETED_TESTS));
  const [inventory, setInventory]   = useState<InventoryItem[]>(() => clone(INVENTORY));
  const [equipment, setEquipment]   = useState<EquipmentItem[]>(() => clone(EQUIPMENT));
  const [profile, setProfile]       = useState<LabProfile>(() => ({ ...DEFAULT_PROFILE, name: techName || DEFAULT_PROFILE.name }));

  const setQueue = (queue: TestQueue) => (queue === 'inhouse' ? setInhouse : setExternal);

  /* Accept an order (New → Accepted). */
  const acceptOrder = useCallback((queue: TestQueue, id: string) => {
    setQueue(queue)(prev => prev.map(o =>
      o.id === id ? { ...o, status: 'Accepted', assignedTech: o.assignedTech ?? profile.name } : o));
  }, [profile.name]);

  /* Generate barcode → remove from queue, push into Sample Collection. */
  const generateBarcode = useCallback((queue: TestQueue, id: string): string => {
    const list = queue === 'inhouse' ? inhouse : external;
    const order = list.find(o => o.id === id);
    if (!order) return '';
    const barcode = order.barcode || nextBarcode();
    // Derive every distinct sample type required across all tests on the order.
    const derived = Array.from(new Set(
      order.tests.map(t => catalogOf(t)?.sampleType).filter(Boolean) as string[]
    ));
    const sampleType = derived.length ? derived : ['Whole Blood (EDTA)'];

    setQueue(queue)(prev => prev.filter(o => o.id !== id));
    setSamples(prev => {
      const sample: SampleCollect = {
        orderId: order.id, barcode, patient: order.patient, pid: order.pid,
        tests: order.tests, test: order.tests[0], doctor: order.doctor,
        sampleType, status: 'Pending', phone: order.phone,
      };
      const without = prev.filter(s => s.barcode !== barcode && s.orderId !== order.id);
      return [sample, ...without];
    });
    return barcode;
  }, [inhouse, external]);

  /* Add an external walk-in order. */
  const addExternalOrder = useCallback((o: {
    patient: string; age: number; gender: 'Male' | 'Female' | 'Other';
    tests: string[]; time: string; priority: TestOrder['priority'];
  }) => {
    const id = `EXT-${7002 + external.length}`;
    const primary = o.tests[0];
    const cat = catalogOf(primary);
    const order: TestOrder = {
      id, queue: 'external', patient: o.patient, pid: `W-${100 + external.length + 2}`,
      age: o.age, gender: o.gender, tests: o.tests, test: primary,
      testType: cat?.testType ?? '—', department: 'Walk-in', doctor: 'Self / Walk-in',
      ordered: TODAY, time: o.time, priority: o.priority, status: 'New', barcode: '', walkIn: true,
    };
    setExternal(prev => [order, ...prev]);
  }, [external.length]);

  /* Collection */
  const setSampleType = useCallback((barcode: string, sampleType: string[]) => {
    setSamples(prev => prev.map(s => s.barcode === barcode ? { ...s, sampleType } : s));
  }, []);

  const confirmCollection = useCallback((barcode: string, collector: string, collectedAt?: string) => {
    const stamp = collectedAt && collectedAt.trim() ? collectedAt.trim() : nowStamp();
    // Look the sample up BEFORE we mutate, so we always have its full data.
    const s = samples.find(x => x.barcode === barcode);
    setSamples(prev => prev.map(x => x.barcode === barcode
      ? { ...x, status: 'Collected', collector, collectedAt: stamp } : x));
    if (!s) return;
    // Push a NEW row into Sample Processing. De-dupe by barcode so a re-confirm
    // updates the same row instead of creating a duplicate.
    setProcessing(prev => {
      const equipments = Array.from(new Set(s.tests.map(t => catalogOf(t)?.equipment ?? 'Cobas c311')));
      const durationMin = s.tests.reduce((sum, t) => sum + (catalogOf(t)?.durationMin ?? 15), 0);
      const row: ProcessSample = {
        orderId: s.orderId, barcode: s.barcode, patient: s.patient, pid: s.pid,
        tests: s.tests, test: s.tests[0], doctor: s.doctor,
        equipments, status: 'Ready', qc: 'Pending', durationMin,
        collectedAt: stamp, phone: s.phone,
      };
      const without = prev.filter(p => p.barcode !== barcode);
      return [...without, row];
    });
  }, [samples]);

  /* Processing */
  const setEquipments = useCallback((barcode: string, equipments: string[]) => {
    setProcessing(prev => prev.map(p => p.barcode === barcode ? { ...p, equipments } : p));
  }, []);
  const startProcessing = useCallback((barcode: string) => {
    setProcessing(prev => prev.map(p => p.barcode === barcode ? { ...p, status: 'Running', startedAt: Date.now() } : p));
  }, []);
  const pauseProcessing = useCallback((barcode: string) => {
    setProcessing(prev => prev.map(p => p.barcode === barcode ? { ...p, status: 'Paused' } : p));
  }, []);
  const resumeProcessing = useCallback((barcode: string) => {
    setProcessing(prev => prev.map(p => p.barcode === barcode ? { ...p, status: 'Running', startedAt: p.startedAt ?? Date.now() } : p));
  }, []);

  const completeProcessing = useCallback((barcode: string) => {
    const p = processing.find(x => x.barcode === barcode);
    setProcessing(prev => prev.map(x => x.barcode === barcode ? { ...x, status: 'Completed' } : x));
    if (!p) return;
    setResults(prev => {
      if (prev.some(r => r.id === p.orderId)) return prev;
      const cat0 = catalogOf(p.tests[0]);
      const pending: PendingResult = {
        id: p.orderId, patient: p.patient, pid: p.pid,
        test: p.tests[0], testType: cat0?.testType ?? '—', doctor: p.doctor,
        collected: p.collectedAt ?? nowTime(), phone: p.phone,
        tests: p.tests.map(name => ({
          name, testType: catalogOf(name)?.testType ?? '—',
          params: paramsFor(name), remarks: '', attachments: [],
        })),
      };
      return [pending, ...prev];
    });
  }, [processing]);

  /* Results */
  const updateResultParam = useCallback((id: string, testIdx: number, paramIdx: number, patch: Partial<PendingResult['tests'][number]['params'][number]>) => {
    setResults(prev => prev.map(r => r.id !== id ? r : {
      ...r,
      tests: r.tests.map((t, ti) => ti !== testIdx ? t : {
        ...t, params: t.params.map((pm, pi) => pi !== paramIdx ? pm : { ...pm, ...patch }),
      }),
    }));
  }, []);
  const updateResultRemarks = useCallback((id: string, testIdx: number, remarks: string) => {
    setResults(prev => prev.map(r => r.id !== id ? r : {
      ...r, tests: r.tests.map((t, ti) => ti !== testIdx ? t : { ...t, remarks }),
    }));
  }, []);
  const addResultAttachments = useCallback((id: string, testIdx: number, files: string[]) => {
    setResults(prev => prev.map(r => r.id !== id ? r : {
      ...r, tests: r.tests.map((t, ti) => ti !== testIdx ? t : { ...t, attachments: [...(t.attachments ?? []), ...files] }),
    }));
  }, []);

  const submitResult = useCallback((id: string) => {
    const r = results.find(x => x.id === id);
    setResults(prev => prev.filter(x => x.id !== id));
    if (!r) return;
    const anyAbnormal = r.tests.some(t => t.params.some(p => p.flag !== 'normal'));
    const c: CompletedTest = {
      id: r.id, patient: r.patient, pid: r.pid, test: r.tests.map(t => t.name).join(', '),
      testType: r.testType, doctor: r.doctor,
      completed: `${TODAY} ${nowTime()}`, validatedBy: profile.name,
      outcome: anyAbnormal ? 'Abnormal' : 'Normal', phone: r.phone, tests: r.tests.map(t => t.name),
    };
    setCompleted(prev => [c, ...prev]);
  }, [results, profile.name]);

  const addInventory = useCallback((item: InventoryItem) => {
    setInventory(prev => [item, ...prev]);
  }, []);
  const addEquipment = useCallback((item: EquipmentItem) => {
    setEquipment(prev => [item, ...prev]);
  }, []);

  const updateProfile = useCallback((patch: Partial<LabProfile>) => {
    setProfile(prev => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<LabContextValue>(() => ({
    inhouse, external, samples, processing, results, completed, inventory, equipment, profile,
    acceptOrder, generateBarcode, addExternalOrder,
    setSampleType, confirmCollection,
    setEquipments, startProcessing, pauseProcessing, resumeProcessing, completeProcessing,
    updateResultParam, updateResultRemarks, addResultAttachments, submitResult,
    addInventory, addEquipment,
    updateProfile,
  }), [
    inhouse, external, samples, processing, results, completed, inventory, equipment, profile,
    acceptOrder, generateBarcode, addExternalOrder, setSampleType, confirmCollection,
    setEquipments, startProcessing, pauseProcessing, resumeProcessing, completeProcessing,
    updateResultParam, updateResultRemarks, addResultAttachments, submitResult,
    addInventory, addEquipment, updateProfile,
  ]);

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
};
