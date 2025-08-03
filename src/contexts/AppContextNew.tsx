// AKTUALIZOVANÝ AppContext - Používá nový CompleteAppContext
// Zachovává původní API pro zpětnou kompatibilitu

export { 
  CompleteAppProvider as AppProvider, 
  useCompleteApp as useApp
} from './CompleteAppContext';

// Re-export všech typů pro kompatibilitu
export type { 
  ExtendedBuilding as Building,
  ExtendedMember as Member,
  ExtendedVote as Vote,
  ExtendedQuestion as Question,
  VoteDelegation,
  Notification,
  VoteAnalytics,
  Report,
  ProxyVote,
  Attachment
} from '../types/extended';

// Export typu AppContextType z CompleteAppContext
export type { AppContextType } from './CompleteAppContext';
