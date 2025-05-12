import { keepPreviousData, useQuery, UseQueryResult } from "@tanstack/react-query";

// Types
export interface Participant {
  id: string;
  name: string;
  school: string;
  class: string;
  email: string;
  phone: string;
  qrImageUrl?: string | null;
  profilePicture?: string | null;
  portfolio: string;
  committee: string;
  formId: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch all participants
export const fetchParticipants = async (): Promise<Participant[]> => {
  const response = await fetch('/api/participants');
  if (!response.ok) {
    throw new Error('Failed to fetch participants data');
  }
  return response.json();
};

// Fetch a single participant by ID
export const fetchParticipantById = async (id: string): Promise<Participant> => {
  const response = await fetch(`/api/participants/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch participant data');
  }
  return response.json();
};

// Enhanced hook for all participants
export const useParticipants = (): UseQueryResult<Participant[], Error> => {
  return useQuery<Participant[], Error>({
    queryKey: ['participants'],
    queryFn: fetchParticipants,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime:  10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Enhanced hook for a single participant
export const useParticipant = (id: string): UseQueryResult<Participant, Error> => {
  return useQuery<Participant, Error>({
    queryKey: ['participant', id],
    queryFn: () => fetchParticipantById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  });
};
