/**
 * Demo accounts — match the Sign-In page exactly. In demo mode any password
 * unlocks the matched email. Replace with real auth API calls in production.
 */
import type { AuthUser } from '../types';

export const DEMO_USERS: AuthUser[] = [
  // Platform / founder level — lands in the Founders' Console.
  { id: 'U-000', email: 'superadmin@vexoo.in', name: 'Aarav Rao',    role: 'SuperAdmin'   },
  // Hospital administrator — credentials issued by the SuperAdmin.
  { id: 'U-001', email: 'admin@vexoo.in',     name: 'Anita Reddy',   role: 'Admin'        },
  { id: 'U-002', email: 'doctor@vexoo.in',    name: 'Dr. Amy Chen',  role: 'Doctor'       },
  { id: 'U-003', email: 'reception@vexoo.in', name: 'Maria Lopez',   role: 'Receptionist' },
  { id: 'U-004', email: 'pharmacy@vexoo.in',  name: 'Mei Perez',     role: 'Pharmacist'   },
  { id: 'U-005', email: 'lab@vexoo.in',       name: 'Kevin Liu',     role: 'LabTech'      },
  { id: 'U-006', email: 'patient@vexoo.in',   name: 'Sarah Johnson', role: 'Patient'      },
];

/** Find a user by email — demo auth helper. */
export function findUserByEmail(email: string): AuthUser | undefined {
  return DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
}
