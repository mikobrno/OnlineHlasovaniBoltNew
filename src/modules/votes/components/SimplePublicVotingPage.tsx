import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useQuery } from '@apollo/client';
import { GET_VOTE_DETAILS } from '../graphql/queries';
import { votingTokenService } from '@/lib/votingTokenService';
// no toast used here

export const SimplePublicVotingPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [voteId, setVoteId] = useState<string | null>(null);

  // Determine whether this is the dev demo token — if so, don't run the GraphQL query
  const isDemoToken = token === 'test-token' || voteId === 'test-token';

  // GraphQL query for vote details — skip when we don't have a voteId or when using the demo token
  const { data: voteData, loading: voteLoading, error: voteError } = useQuery(GET_VOTE_DETAILS, {
    variables: { voteId },
  skip: !voteId || isDemoToken,
  context: { skipAuth: true },
  });

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    // Resolve token via votingTokenService (in-memory). If unresolved, fallback to token.
    const resolved = votingTokenService.resolveTokenToVoteId(token);
    setVoteId(resolved || token);
  }, [token, navigate]);

  // No dev mock here — show vote only when GraphQL returned it
  // Dev fallback: if token or resolved voteId equals 'test-token', show a demo vote
  const demoMockVote = {
    id: 'demo-vote-1',
    title: 'Demo hlasování (test-token)',
    description: 'Ukázkové hlasování pro vývoj a testování.',
    status: 'active',
    questions: [
      { id: 'q1', text: 'Podporujete návrh A?' },
      { id: 'q2', text: 'Podporujete návrh B?' }
    ]
  } as any;

  const vote = voteData?.vote || (voteId === 'test-token' || token === 'test-token' ? demoMockVote : null);
  const [manualId, setManualId] = React.useState('');
  const [generatedToken, setGeneratedToken] = React.useState<string | null>(null);

  // debug helper
  // eslint-disable-next-line no-console
  console.debug('[SimplePublicVotingPage] token, voteId, isDemoToken, voteData:', token, voteId, isDemoToken, voteData);

  if (voteLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8">
          <p>Načítám hlasování...</p>
        </Card>
      </div>
    );
  }

  if (voteError || !vote) {
    const errorDetails = (() => {
      try {
        const details: Record<string, unknown> = { graphQLErrors: (voteError as any)?.graphQLErrors, networkError: (voteError as any)?.networkError };
        return JSON.stringify(details, null, 2);
      } catch {
        return String(voteError);
      }
    })();

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-2xl">
          <h1 className="text-xl font-bold mb-4">Chyba při načítání hlasování</h1>
          <p className="mb-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{voteError ? String(voteError.message) : 'Hlasování nebylo nalezeno'}</p>

          <details className="mb-4">
            <summary className="cursor-pointer text-sm text-gray-500">Zobrazit technické detaily chyby</summary>
            <pre className="text-xs mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">{errorDetails}</pre>
          </details>

          <div className="mb-4">
            <label className="block text-sm mb-1">Zadat voteId ručně (pro debug)</label>
            <div className="flex space-x-2">
              <input value={manualId} onChange={e => setManualId(e.target.value)} className="border px-2 py-1 rounded w-full" placeholder="vote id" />
              <Button onClick={() => setVoteId(manualId)}>Načíst</Button>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <Button onClick={() => {
                if (!manualId) return;
                const t = votingTokenService.generateToken(manualId, 'dev-member');
                setGeneratedToken(t.token);
              }}>Vygenerovat dev token pro toto voteId</Button>
              {generatedToken && (
                <div className="text-sm text-gray-600">Vygenerovaný token: <code className="break-all">{generatedToken}</code></div>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>Zpět na hlavní stránku</Button>
            <Button onClick={() => window.location.reload()}>Zkusit znovu</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card className="p-8">
          <h1 className="text-2xl font-bold mb-4">{vote.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{vote.description}</p>
          
          {vote.questions && Array.isArray(vote.questions) && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Otázky:</h2>
              {vote.questions.map((question: any, index: number) => (
                <Card key={index} className="p-4">
                  <p className="font-medium">{question.text || `Otázka ${index + 1}`}</p>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Token: {token}
            </p>
            <p className="text-sm text-gray-500">
              Status: {vote.status}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
