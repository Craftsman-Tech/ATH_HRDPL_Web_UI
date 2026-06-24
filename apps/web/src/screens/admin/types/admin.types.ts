/**
 * admin.types.ts — Super Admin portal shared types
 */

export type ViewId = 'dashboard' | 'hospitals' | 'doctors' | 'approvals' | 'licenses' | 'activity';

export interface SuperAdminScreenProps {
  adminName?: string;
  adminRole?: string;
  onSignOut?: () => void;
}

export interface Hospital {
  id: string; name: string; city: string; type: string;
  status: 'active' | 'pending' | 'suspended'; beds: number;
  doctors: number; joined: string; plan: string; revenue: string;
}

export interface Approval {
  id: string; type: string; name: string; hospital: string;
  submitted: string; priority: 'high' | 'normal'; docs: number;
}

export interface NavItem { id: ViewId; label: string; path: string; badge?: number; }
