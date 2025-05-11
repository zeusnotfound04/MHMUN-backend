// Utility functions for participant data
import { useQuery } from "@tanstack/react-query";

// Types
export interface Participant {
  id: string;
  name: string;
  school: string;
  email: string;
  phone: string;
  qrImageUrl?: string | null;
  profilePicture?: string | null;
  committee?: string | null;
  experience?: string | null;
  countryPreferences?: string | null;
  delegationType?: string | null;
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

// React Query hook for fetching all participants
export const useParticipants = () => {
  return useQuery({
    queryKey: ['participants'],
    queryFn: fetchParticipants,
  });
};

// React Query hook for fetching a single participant
export const useParticipant = (id: string) => {
  return useQuery({
    queryKey: ['participant', id],
    queryFn: () => fetchParticipantById(id),
    enabled: !!id, // Only run the query if an ID is provided
  });
};
