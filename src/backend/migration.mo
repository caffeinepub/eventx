import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  // Original UserRole type (from AccessControl module)
  type UserRole = AccessControl.UserRole;
  // Original UserProfile type (without organizer/artist fields)
  type OldUserProfile = {
    name : Text;
    email : Text;
    role : UserRole;
    interests : [Text];
    balance : Nat;
  };

  // New UserProfile type with organizer/artist/exhibitor fields
  type NewUserProfile = {
    name : Text;
    email : Text;
    role : UserRole;
    interests : [Text];
    balance : Nat;
    cnpjCpf : ?Text; // Organizer specific (optional)
    empresa : ?Text; // Organizer specific (optional)
    portfolioUrl : ?Text; // Artist/Exhibitor specific (optional)
  };

  // Other unchanged types
  type Ticket = {
    id : Nat;
    event : Text;
    owner : Principal;
    status : TicketStatus;
  };

  type TicketStatus = {
    #active;
    #used;
    #validating;
    #invalid;
    #refunded;
  };

  type QuoteRequest = {
    id : Nat;
    from : Principal;
    to : Principal;
    message : Text;
    timestamp : Nat;
  };

  type ContestEntry = {
    id : Nat;
    artist : Principal;
    imageUrl : Text;
    votes : Nat;
  };

  type PhotoPost = {
    id : Nat;
    author : Principal;
    imageUrl : Text;
    caption : Text;
    timestamp : Nat;
  };

  type Announcement = {
    id : Nat;
    title : Text;
    message : Text;
    priority : AnnouncementPriority;
    timestamp : Nat;
  };

  type AnnouncementPriority = {
    #normal;
    #important;
    #emergency;
  };

  type WalletTransaction = {
    id : Nat;
    user : Principal;
    amount : Int; // positive for top-up, negative for spending
    description : Text;
    timestamp : Nat;
  };

  // Old actor type with old UserProfile
  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    tickets : Map.Map<Nat, Ticket>;
    favorites : Map.Map<Principal, Set.Set<Nat>>;
    quoteRequests : Map.Map<Nat, QuoteRequest>;
    quoteRequestCounter : Nat;
    contestEntries : Map.Map<Nat, ContestEntry>;
    contestVotes : Map.Map<Principal, Set.Set<Nat>>;
    photoPosts : Map.Map<Nat, PhotoPost>;
    photoPostCounter : Nat;
    announcements : Map.Map<Nat, Announcement>;
    announcementCounter : Nat;
    walletTransactions : Map.Map<Nat, WalletTransaction>;
    transactionCounter : Nat;
  };

  // New actor type with new UserProfile
  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    tickets : Map.Map<Nat, Ticket>;
    favorites : Map.Map<Principal, Set.Set<Nat>>;
    quoteRequests : Map.Map<Nat, QuoteRequest>;
    quoteRequestCounter : Nat;
    contestEntries : Map.Map<Nat, ContestEntry>;
    contestVotes : Map.Map<Principal, Set.Set<Nat>>;
    photoPosts : Map.Map<Nat, PhotoPost>;
    photoPostCounter : Nat;
    announcements : Map.Map<Nat, Announcement>;
    announcementCounter : Nat;
    walletTransactions : Map.Map<Nat, WalletTransaction>;
    transactionCounter : Nat;
  };

  // Migration function called by the main actor via with-clause
  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          oldProfile with
          cnpjCpf = null;
          empresa = null;
          portfolioUrl = null;
        };
      }
    );
    {
      old with
      userProfiles = newUserProfiles;
    };
  };
};
