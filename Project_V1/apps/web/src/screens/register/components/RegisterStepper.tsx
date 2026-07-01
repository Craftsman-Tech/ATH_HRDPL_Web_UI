/**
 * RegisterStepper.tsx — the 3-step (Hospital · Contact · License) tab strip.
 * Clicking a step jumps to it; the orchestrator owns the active step.
 */
import React from 'react';
import { STEPS } from '../data/registerOptions';
import type { StepId } from '../types/register.types';

export const RegisterStepper: React.FC<{
  step: StepId;
  onGoto: (n: StepId) => void;
}> = ({ step, onGoto }) => (
  <div className="vxreg-stepper">
    {STEPS.map((label, i) => {
      const n = (i + 1) as StepId;
      return (
        <button
          key={label}
          type="button"
          className={`vxreg-step ${n === step ? 'active' : ''} ${n < step ? 'done' : ''}`}
          onClick={() => onGoto(n)}
        >
          <span className="vxreg-step-num">{n}</span>
          <span className="vxreg-step-label">{label}</span>
        </button>
      );
    })}
  </div>
);
