import { VoteStatus } from '../types/vote';

export function getVoteStatusStyle(status: VoteStatus) {
  switch (status) {
    case VoteStatus.ACTIVE:
      return 'text-green-600 bg-green-100';
    case VoteStatus.CLOSED:
      return 'text-gray-600 bg-gray-100';
    case VoteStatus.DRAFT:
      return 'text-yellow-600 bg-yellow-100';
    case VoteStatus.CANCELLED:
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getVoteStatusText(status: VoteStatus) {
  switch (status) {
    case VoteStatus.ACTIVE:
      return 'Aktivní';
    case VoteStatus.CLOSED:
      return 'Uzavřeno';
    case VoteStatus.DRAFT:
      return 'Koncept';
    case VoteStatus.CANCELLED:
      return 'Zrušeno';
    default:
      return status;
  }
}
