import { Link } from 'react-router-dom';
import { useVotes } from '../hooks/useVotes';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { FullPageSpinner } from '../../shared/components/FullPageSpinner';
import { useToast } from '../../shared/hooks/useToast';
import { Vote, VoteStatus } from '../types/vote';

function getVoteStatusStyle(status: VoteStatus) {
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

function getVoteStatusText(status: VoteStatus) {
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

function VoteCard({ vote }: { vote: Vote }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{vote.title}</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${getVoteStatusStyle(vote.status)}`}>
          {getVoteStatusText(vote.status)}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {vote.description}
      </p>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Vytvořeno: {new Date(vote.created_at).toLocaleDateString()}
        </div>
        <Button variant="primary" size="sm" asChild>
          <Link to={`/votes/${vote.id}`}>
            Zobrazit detail
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export function VotesListView() {
  const { data, loading, error } = useVotes();
  const { showToast } = useToast();

  if (loading) {
    return <FullPageSpinner message="Načítám hlasování..." />;
  }

  if (error) {
    showToast({
      type: 'error',
      title: 'Chyba při načítání hlasování',
      message: error.message
    });
    return null;
  }

  if (!data?.votes.length) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Žádná hlasování</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          V této budově zatím nejsou žádná hlasování. Vytvořte první hlasování.
        </p>
        <Button variant="primary" asChild>
          <Link to="/votes/new">Vytvořit hlasování</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hlasování</h1>
        <Button variant="primary" asChild>
          <Link to="/votes/new">Nové hlasování</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.votes.map((vote) => (
          <VoteCard key={vote.id} vote={vote} />
        ))}
      </div>
    </div>
  );
}
