import { useQuery } from '@apollo/client';
import { useBuildingStore } from '../../shared/store/buildingStore';
import { Vote } from '../types/vote';
import { GET_VOTES } from '../graphql/votes';

export function useVotes() {
  const { selectedBuilding } = useBuildingStore();

  return useQuery<{ votes: Vote[] }>(GET_VOTES, {
    variables: { buildingId: selectedBuilding?.id },
    skip: !selectedBuilding,
  });
}

export function useVote(voteId: string) {
  const { selectedBuilding } = useBuildingStore();

  return useQuery<{ vote: Vote }>(GET_VOTE_DETAIL, {
    variables: { voteId },
    skip: !selectedBuilding || !voteId,
  });
}
