import '@testing-library/jest-dom';

import { vi } from 'vitest';
import React from 'react';

const mockBuilding = {
  id: 'building-1',
  name: 'Test Building',
};

vi.mock('@/contexts', () => ({
  useApp: () => ({ selectedBuilding: mockBuilding }),
}));

// Mock useQuery from Apollo
const useQueryMock = vi.fn();
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useQuery: (...args: any[]) => useQueryMock(...args),
  };
});

import { render, screen, fireEvent } from '@testing-library/react';
import { VotesListView } from './VotesListView';

const mockVotes = [
  {
    id: 'vote-1',
    title: 'Vote 1',
    status: 'active',
    created_at: '2025-08-01T00:00:00Z',
    start_date: '2025-08-10T00:00:00Z',
    end_date: '2025-08-20T00:00:00Z',
  },
  {
    id: 'vote-2',
    title: 'Vote 2',
    status: 'completed',
    created_at: '2025-07-01T00:00:00Z',
    start_date: '2025-07-10T00:00:00Z',
    end_date: '2025-07-20T00:00:00Z',
  },
];

describe('VotesListView', () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  it('renders loading state initially', () => {
    useQueryMock.mockReturnValue({ data: undefined, loading: true, error: undefined });

    render(<VotesListView />);

    // Spinner/rendered loading text should be present immediately
    expect(screen.queryByText(/Načítám hlasování.../i)).toBeInTheDocument();
  });

  it('renders error state if query fails', async () => {
    useQueryMock.mockReturnValue({ data: undefined, loading: false, error: { message: 'Query failed' } });

    render(<VotesListView />);

    expect(await screen.findByText(/Chyba při načítání hlasování/i)).toBeInTheDocument();
  });

  it('renders votes when data is available', async () => {
    useQueryMock.mockReturnValue({ data: { votes: mockVotes }, loading: false, error: undefined });

    render(<VotesListView />);

    expect(await screen.findByText(/Přehled hlasování/i)).toBeInTheDocument();
    expect(screen.getByText(/Vote 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Vote 2/i)).toBeInTheDocument();
  });

  it('filters votes based on search term', async () => {
    useQueryMock.mockReturnValue({ data: { votes: mockVotes }, loading: false, error: undefined });

    render(<VotesListView />);

    expect(await screen.findByText(/Vote 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Vote 2/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Hledat hlasování.../i);
    fireEvent.change(searchInput, { target: { value: 'Vote 1' } });

    expect(screen.getByText(/Vote 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Vote 2/i)).not.toBeInTheDocument();
  });
});
