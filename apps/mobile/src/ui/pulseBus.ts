/**
 * ============================================================================
 *  pulseBus — one place that knows the app is busy
 * ============================================================================
 *  The work worth showing a loader for (exporting a PDF, sharing a receipt,
 *  picking a document) happens inside module-level helpers that are called from
 *  dozens of deeply nested call sites. Threading a `loading` prop down to each
 *  would touch far more code than it is worth and would drift out of sync.
 *
 *  So the helpers announce their own work here, and a single
 *  <GlobalPulseOverlay /> mounted in App.tsx renders the heartbeat. Adding a
 *  loader to a new async action is then one `withPulse(...)` wrap.
 *
 *  Reference-counted, because two exports can overlap — the overlay lifts only
 *  when the last one finishes.
 * ============================================================================
 */

type Listener = (active: boolean, label?: string) => void;

const listeners = new Set<Listener>();
let depth = 0;
let current: string | undefined;

function emit() {
  const active = depth > 0;
  listeners.forEach((listener) => listener(active, current));
}

export function subscribePulse(listener: Listener): () => void {
  listeners.add(listener);
  listener(depth > 0, current);
  return () => {
    listeners.delete(listener);
  };
}

function begin(label?: string) {
  depth += 1;
  if (label) current = label;
  emit();
}

function end() {
  depth = Math.max(0, depth - 1);
  if (depth === 0) current = undefined;
  emit();
}

/**
 * Show the heartbeat for as long as `fn` runs — including if it throws, so a
 * failed export can never leave the overlay stuck on screen.
 */
export async function withPulse<T>(fn: () => Promise<T>, label?: string): Promise<T> {
  begin(label);
  try {
    return await fn();
  } finally {
    end();
  }
}

/**
 * Hold the heartbeat for a fixed spell. For changes that are actually instant
 * (switching module) so they read as a deliberate transition, not a flicker.
 */
export function pulseFor(ms = 420, label?: string) {
  begin(label);
  // Each hold owns its timer. Sharing one and clearing it would drop the
  // matching `end()` when two holds overlap — tapping two modules inside the
  // window would leave the count above zero and the overlay stuck on screen.
  setTimeout(end, ms);
}
