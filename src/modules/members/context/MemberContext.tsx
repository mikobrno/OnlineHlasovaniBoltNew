import { createContext, useContext, FC, ReactNode, useState } from 'react';
import { Member, MemberFormData, MemberFilters } from '../types';

interface MemberContextValue {
  selectedMember: Member | null;
  setSelectedMember: (member: Member | null) => void;
  isFormOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
  editingMember: Member | null;
  setEditingMember: (member: Member | null) => void;
  formData: MemberFormData;
  setFormData: (data: MemberFormData) => void;
  filters: MemberFilters;
  setFilters: (filters: MemberFilters) => void;
}

const defaultFormData: MemberFormData = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  buildingId: '',
  unitNumber: '',
  isOwner: false,
  isCommitteeMember: false,
  isActive: true,
};

const defaultFilters: MemberFilters = {
  buildingId: undefined,
  isActive: true,
  isOwner: undefined,
  isCommitteeMember: undefined,
  searchQuery: undefined,
};

const MemberContext = createContext<MemberContextValue | undefined>(undefined);

export const MemberProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<MemberFormData>(defaultFormData);
  const [filters, setFilters] = useState<MemberFilters>(defaultFilters);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMember(null);
    setFormData(defaultFormData);
  };

  const value = {
    selectedMember,
    setSelectedMember,
    isFormOpen,
    openForm,
    closeForm,
    editingMember,
    setEditingMember,
    formData,
    setFormData,
    filters,
    setFilters,
  };

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMemberContext must be used within MemberProvider');
  }
  return context;
};
