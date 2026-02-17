import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, UserRole, Ticket, Announcement, PhotoPost, WalletTransaction, ContestEntry, QuoteRequest, AnnouncementPriority } from '../backend';

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Tickets
export function useGetUserTickets() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Ticket[]>({
    queryKey: ['userTickets', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserTickets(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useValidateTicket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateTicket(ticketId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTickets'] });
    },
  });
}

// Favorites
export function useGetFavorites() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFavorite(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFavorite(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

// Announcements
export function useGetAnnouncements() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnnouncements();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { title: string; message: string; priority: 'normal' | 'important' | 'emergency' }) => {
      if (!actor) throw new Error('Actor not available');
      const priorityEnum: AnnouncementPriority = params.priority as any;
      return actor.createAnnouncement(params.title, params.message, priorityEnum);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

// Photo Wall
export function useGetPhotoPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PhotoPost[]>({
    queryKey: ['photoPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPhotoPosts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { imageUrl: string; caption: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadPhoto(params.imageUrl, params.caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photoPosts'] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photoPosts'] });
    },
  });
}

// Wallet
export function useGetBalance() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ['balance', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return BigInt(0);
      return actor.getBalance(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetTransactions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<WalletTransaction[]>({
    queryKey: ['transactions', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getTransactions(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// Contest
export function useGetContestEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ContestEntry[]>({
    queryKey: ['contestEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContestEntries();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000, // Poll every 5 seconds for near-real-time updates
  });
}

export function useVoteContestEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.voteContestEntry(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contestEntries'] });
    },
  });
}

// Quote Requests
export function useGetQuoteRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<QuoteRequest[]>({
    queryKey: ['quoteRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuoteRequestsForUser();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSendQuoteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { to: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.sendQuoteRequest(Principal.fromText(params.to), params.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
    },
  });
}
