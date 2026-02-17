import Text "mo:core/Text";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

// Use migration for data persistence between upgrades
(with migration = Migration.run)
actor {
  //(1) Initialize access control state (required for all apps)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  //(2) TYPE: User profile & role
  public type UserRole = AccessControl.UserRole;

  // Extended user profile with organizer and exhibitor/artist specific fields
  public type UserProfile = {
    name : Text;
    email : Text;
    role : UserRole;
    interests : [Text];
    balance : Nat;
    cnpjCpf : ?Text; // Organizer specific (optional)
    empresa : ?Text; // Organizer specific (optional)
    portfolioUrl : ?Text; // Artist/Exhibitor specific (optional)
  };

  module UserProfile {
    public func compare(user1 : UserProfile, user2 : UserProfile) : Order.Order {
      switch (Text.compare(user1.name, user2.name)) {
        case (#equal) { Text.compare(user1.email, user2.email) };
	      case (order) { order };
      };
    };

    public func compareByEmail(user1 : UserProfile, user2 : UserProfile) : Order.Order {
      Text.compare(user1.email, user2.email);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  //(3) PUBLIC: Get operations
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  //(4) PUBLIC: Save/Update operation
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  //(5) PUBLIC: Balance management - ADMIN ONLY (Organizador issues top-ups and records spending)
  public shared ({ caller }) func updateBalance(user : Principal, amount : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins (Organizador) can update balances");
    };
    let existingProfile = switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };
    let updatedProfile = {
      name = existingProfile.name;
      email = existingProfile.email;
      role = existingProfile.role;
      interests = existingProfile.interests;
      balance = amount;
      cnpjCpf = existingProfile.cnpjCpf;
      empresa = existingProfile.empresa;
      portfolioUrl = existingProfile.portfolioUrl;
    };
    userProfiles.add(user, updatedProfile);
  };

  // Get balance (users can view their own, admins can view any)
  public query ({ caller }) func getBalance(user : Principal) : async Nat {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own balance");
    };
    let profile = switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    profile.balance;
  };

  //(6) Module-specific: Ticket & Wallet
  public type Ticket = {
    id : Nat;
    event : Text;
    owner : Principal;
    status : TicketStatus;
  };

  public type TicketStatus = {
    #active;
    #used;
    #validating;
    #invalid;
    #refunded;
  };

  let tickets = Map.empty<Nat, Ticket>();

  // Create ticket - ADMIN ONLY (tickets are issued by Organizador)
  public shared ({ caller }) func createTicket(ticket : Ticket) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins (Organizador) can create tickets");
    };
    tickets.add(ticket.id, ticket);
  };

  // Get ticket - owner or admin only
  public query ({ caller }) func getTicket(id : Nat) : async ?Ticket {
    let ticket = switch (tickets.get(id)) {
      case (null) { return null };
      case (?t) { t };
    };
    if (caller != ticket.owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own tickets");
    };
    ?ticket;
  };

  // Get all tickets by owner (must be authenticated)
  public query ({ caller }) func getUserTickets(owner : Principal) : async [Ticket] {
    if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own tickets");
    };
    tickets.values().toArray().filter(
      func(ticket) {
        ticket.owner == owner
      }
    );
  };

  // Validate ticket - ADMIN ONLY (Organizador staff validates tickets)
  public shared ({ caller }) func validateTicket(id : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins (Organizador) can validate tickets");
    };
    let ticket = switch (tickets.get(id)) {
      case (null) { Runtime.trap("Ticket not found") };
      case (?t) { t };
    };
    if (ticket.status != #active) {
      return false;
    };
    let validatedTicket = {
      id = ticket.id;
      event = ticket.event;
      owner = ticket.owner;
      status = #used;
    };
    tickets.add(id, validatedTicket);
    true;
  };

  // Refund ticket - ADMIN ONLY
  public shared ({ caller }) func refundTicket(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can refund tickets");
    };
    let ticket = switch (tickets.get(id)) {
      case (null) { Runtime.trap("Ticket not found") };
      case (?t) { t };
    };
    let refundedTicket = {
      id = ticket.id;
      event = ticket.event;
      owner = ticket.owner;
      status = #refunded;
    };
    tickets.add(id, refundedTicket);
  };

  //(7) Favorites (Minha Agenda) - users can manage their own favorites
  let favorites = Map.empty<Principal, Set.Set<Nat>>();

  public shared ({ caller }) func addFavorite(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };
    let userFavs = switch (favorites.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?favs) { favs };
    };
    userFavs.add(itemId);
  };

  public shared ({ caller }) func removeFavorite(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };
    let userFavs = switch (favorites.get(caller)) {
      case (null) { return };
      case (?favs) { favs };
    };
    userFavs.remove(itemId);
  };

  public query ({ caller }) func getFavorites() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view favorites");
    };
    let userFavs = switch (favorites.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?favs) { favs };
    };
    userFavs.toArray();
  };

  //(8) Quote requests (Espaço Tattoo) - users send, artists/admins view
  public type QuoteRequest = {
    id : Nat;
    from : Principal;
    to : Principal;
    message : Text;
    timestamp : Nat;
  };

  let quoteRequests = Map.empty<Nat, QuoteRequest>();
  var quoteRequestCounter : Nat = 0;

  public shared ({ caller }) func sendQuoteRequest(to : Principal, message : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send quote requests");
    };
    let id = quoteRequestCounter;
    quoteRequestCounter += 1;
    let request = {
      id = id;
      from = caller;
      to = to;
      message = message;
      timestamp = 0; // In production, use Time.now()
    };
    quoteRequests.add(id, request);
    id;
  };

  public query ({ caller }) func getQuoteRequestsForUser() : async [QuoteRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view quote requests");
    };
    quoteRequests.values().toArray().filter(
      func(req) {
        req.to == caller
      }
    );
  };

  //(9) Contest voting (Concurso de Tatuagem) - users vote once per entry
  public type ContestEntry = {
    id : Nat;
    artist : Principal;
    imageUrl : Text;
    votes : Nat;
  };

  let contestEntries = Map.empty<Nat, ContestEntry>();
  let contestVotes = Map.empty<Principal, Set.Set<Nat>>(); // user -> set of entry IDs voted

  // Create contest entry - ADMIN ONLY
  public shared ({ caller }) func createContestEntry(entry : ContestEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create contest entries");
    };
    contestEntries.add(entry.id, entry);
  };

  // Vote on contest entry - users can vote (once per entry)
  public shared ({ caller }) func voteContestEntry(entryId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can vote");
    };
    let userVotes = switch (contestVotes.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?votes) { votes };
    };
    if (userVotes.contains(entryId)) {
      Runtime.trap("Already voted for this entry");
    };
    let entry = switch (contestEntries.get(entryId)) {
      case (null) { Runtime.trap("Contest entry not found") };
      case (?e) { e };
    };
    let updatedEntry = {
      id = entry.id;
      artist = entry.artist;
      imageUrl = entry.imageUrl;
      votes = entry.votes + 1;
    };
    contestEntries.add(entryId, updatedEntry);
    userVotes.add(entryId);
  };

  // Get contest entries - public (guests can view)
  public query func getContestEntries() : async [ContestEntry] {
    contestEntries.values().toArray();
  };

  //(10) Photo wall (Mural da Galera) - users upload, everyone views
  public type PhotoPost = {
    id : Nat;
    author : Principal;
    imageUrl : Text;
    caption : Text;
    timestamp : Nat;
  };

  let photoPosts = Map.empty<Nat, PhotoPost>();
  var photoPostCounter : Nat = 0;

  public shared ({ caller }) func uploadPhoto(imageUrl : Text, caption : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload photos");
    };
    let id = photoPostCounter;
    photoPostCounter += 1;
    let post = {
      id = id;
      author = caller;
      imageUrl = imageUrl;
      caption = caption;
      timestamp = 0; // In production, use Time.now()
    };
    photoPosts.add(id, post);
    id;
  };

  // Get photo wall - public (guests can view)
  public query func getPhotoPosts() : async [PhotoPost] {
    photoPosts.values().toArray();
  };

  // Delete photo - author or admin only
  public shared ({ caller }) func deletePhoto(id : Nat) : async () {
    let post = switch (photoPosts.get(id)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?p) { p };
    };
    if (caller != post.author and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only delete your own photos");
    };
    photoPosts.remove(id);
  };

  //(11) Announcements (Avisos Importantes) - ADMIN creates, everyone views
  public type Announcement = {
    id : Nat;
    title : Text;
    message : Text;
    priority : AnnouncementPriority;
    timestamp : Nat;
  };

  public type AnnouncementPriority = {
    #normal;
    #important;
    #emergency;
  };

  let announcements = Map.empty<Nat, Announcement>();
  var announcementCounter : Nat = 0;

  public shared ({ caller }) func createAnnouncement(title : Text, message : Text, priority : AnnouncementPriority) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins (Organizador) can create announcements");
    };
    let id = announcementCounter;
    announcementCounter += 1;
    let announcement = {
      id = id;
      title = title;
      message = message;
      priority = priority;
      timestamp = 0; // In production, use Time.now()
    };
    announcements.add(id, announcement);
    id;
  };

  // Get announcements - public (guests can view)
  public query func getAnnouncements() : async [Announcement] {
    announcements.values().toArray();
  };

  // Delete announcement - ADMIN ONLY
  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };
    announcements.remove(id);
  };

  //(12) Wallet transactions - ADMIN records, users view their own
  public type WalletTransaction = {
    id : Nat;
    user : Principal;
    amount : Int; // positive for top-up, negative for spending
    description : Text;
    timestamp : Nat;
  };

  let walletTransactions = Map.empty<Nat, WalletTransaction>();
  var transactionCounter : Nat = 0;

  public shared ({ caller }) func recordTransaction(user : Principal, amount : Int, description : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins (Organizador) can record transactions");
    };
    let id = transactionCounter;
    transactionCounter += 1;
    let transaction = {
      id = id;
      user = user;
      amount = amount;
      description = description;
      timestamp = 0; // In production, use Time.now()
    };
    walletTransactions.add(id, transaction);
    id;
  };

  public query ({ caller }) func getTransactions(user : Principal) : async [WalletTransaction] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own transactions");
    };
    walletTransactions.values().toArray().filter(
      func(tx) {
        tx.user == user
      }
    );
  };
};
