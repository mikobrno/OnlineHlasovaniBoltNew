export interface Member {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  building_id: string;
  unit_number: string;
  is_owner: boolean;
  is_committee_member: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MemberFormData {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  buildingId: string;
  unitNumber: string;
  isOwner: boolean;
  isCommitteeMember: boolean;
  isActive: boolean;
}

export interface MemberFilters {
  buildingId?: string;
  isActive?: boolean;
  isOwner?: boolean;
  isCommitteeMember?: boolean;
  searchQuery?: string;
}
