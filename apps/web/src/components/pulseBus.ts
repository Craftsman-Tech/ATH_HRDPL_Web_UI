/**
 * ============================================================================
 *  pulseBus — one place that knows the app is busy (Web)
 * ============================================================================
 *  Mirrors apps/mobile/src/ui/pulseBus.ts so both platforms describe waiting
 *  the same way. Exports and PDF builds live in module-level helpers called
 *  from many screens, so they announce their own work here rather than each
 *  screen threading a `loading` flag down.
 *
 *  Reference-counted: two overlapping exports lift the overlay only once the
 *  last one finishes.
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

/** Show the heartbeat for as long as `fn` runs — including if it throws. */
export async function withPulse<T>(fn: () => Promise<T> | T, label?: string): Promise<T> {
  begin(label);
  try {
    return await fn();
  } finally {
    end();
  }
}

/** Hold the heartbeat for a fixed spell, for changes that are actually instant. */
export function pulseFor(ms = 420, label?: string) {
  begin(label);
  // Each hold owns its timer. Sharing one and clearing it would drop the
  // matching `end()` when two holds overlap — clicking two modules inside the
  // window would leave the count above zero and the overlay stuck on screen.
  setTimeout(end, ms);
}
