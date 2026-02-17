import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Announcement {
    id: bigint;
    title: string;
    message: string;
    timestamp: bigint;
    priority: AnnouncementPriority;
}
export interface QuoteRequest {
    id: bigint;
    to: Principal;
    from: Principal;
    message: string;
    timestamp: bigint;
}
export interface ContestEntry {
    id: bigint;
    votes: bigint;
    imageUrl: string;
    artist: Principal;
}
export interface WalletTransaction {
    id: bigint;
    user: Principal;
    description: string;
    timestamp: bigint;
    amount: bigint;
}
export interface Ticket {
    id: bigint;
    status: TicketStatus;
    owner: Principal;
    event: string;
}
export interface PhotoPost {
    id: bigint;
    author: Principal;
    imageUrl: string;
    timestamp: bigint;
    caption: string;
}
export interface UserProfile {
    balance: bigint;
    interests: Array<string>;
    name: string;
    role: UserRole;
    email: string;
    portfolioUrl?: string;
    empresa?: string;
    cnpjCpf?: string;
}
export enum AnnouncementPriority {
    emergency = "emergency",
    normal = "normal",
    important = "important"
}
export enum TicketStatus {
    active = "active",
    invalid = "invalid",
    used = "used",
    refunded = "refunded",
    validating = "validating"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFavorite(itemId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAnnouncement(title: string, message: string, priority: AnnouncementPriority): Promise<bigint>;
    createContestEntry(entry: ContestEntry): Promise<void>;
    createTicket(ticket: Ticket): Promise<void>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deletePhoto(id: bigint): Promise<void>;
    getAnnouncements(): Promise<Array<Announcement>>;
    getBalance(user: Principal): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContestEntries(): Promise<Array<ContestEntry>>;
    getFavorites(): Promise<Array<bigint>>;
    getPhotoPosts(): Promise<Array<PhotoPost>>;
    getQuoteRequestsForUser(): Promise<Array<QuoteRequest>>;
    getTicket(id: bigint): Promise<Ticket | null>;
    getTransactions(user: Principal): Promise<Array<WalletTransaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTickets(owner: Principal): Promise<Array<Ticket>>;
    isCallerAdmin(): Promise<boolean>;
    recordTransaction(user: Principal, amount: bigint, description: string): Promise<bigint>;
    refundTicket(id: bigint): Promise<void>;
    removeFavorite(itemId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendQuoteRequest(to: Principal, message: string): Promise<bigint>;
    updateBalance(user: Principal, amount: bigint): Promise<void>;
    uploadPhoto(imageUrl: string, caption: string): Promise<bigint>;
    validateTicket(id: bigint): Promise<boolean>;
    voteContestEntry(entryId: bigint): Promise<void>;
}
