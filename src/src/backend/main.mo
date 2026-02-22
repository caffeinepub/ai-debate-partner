import Array "mo:core/Array";
import Map "mo:core/Map";
import Blob "mo:core/Blob";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Argument = {
    timestamp : Time.Time;
    content : Text;
  };

  public type Debate = {
    topic : Text;
    result : DebateResult;
    userSide : Side;
    aiSide : Side;
    mode : Text;
    responseLength : Text;
    category : Text;
    status : DebateStatus;
    turns : [Argument];
    score : Score;
    tips : [Text];
  };

  public type UserStats = {
    totalDebates : Nat;
    winRate : Float;
    strongestCategory : Text;
    weakestCategory : Text;
  };

  public type Score = {
    overall : Float;
    calculatedOnOpenAi : Float;
    calculatedOnDfinity : Float;
  };

  public type DebateResult = {
    overallRating : Text;
  };

  public type UserProfile = {
    name : Text;
    stats : UserStats;
    score : Score;
    debateHistory : [Debate];
  };

  public type Side = {
    name : Text;
    display : Text;
  };

  public type DebateStatus = {
    name : Text;
    display : Text;
  };

  module Score {
    public func compare(score1 : Score, score2 : Score) : Order.Order {
      Float.compare(score1.calculatedOnOpenAi, score2.calculatedOnOpenAi);
    };
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Float.compare(profile1.stats.winRate, profile2.stats.winRate);
    };
  };

  module DebateResult {
    public func compare(result1 : DebateResult, result2 : DebateResult) : Order.Order {
      Text.compare(result1.overallRating, result2.overallRating);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can initialize the system");
    };
  };

  public query ({ caller }) func getUserStats(user : Principal) : async UserStats {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own statistics");
    };
    return getProfileData(user).stats;
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (userProfiles.get(caller)) {
      case (?_profile) { ?_profile };
      case (null) {
        let defaultStats = {
          totalDebates = 0;
          winRate = 0.0;
          strongestCategory = "none";
          weakestCategory = "none";
        };
        let defaultProfile = {
          name = "Guest";
          stats = defaultStats;
          score = { overall = 0.0; calculatedOnOpenAi = 0.0; calculatedOnDfinity = 0.0 };
          debateHistory = [];
        };
        ?defaultProfile;
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func fetchTopUsersByScore(limit : Nat) : async [UserProfile] {
    // Public leaderboard data - no access control required
    userProfiles.values().toArray().sort().sliceToArray(0, Nat.min(limit, userProfiles.size()));
  };

  public query ({ caller }) func fetchTopUsersByWinRate(limit : Nat) : async [UserProfile] {
    // Public leaderboard data - no access control required
    userProfiles.values().toArray().sort().sliceToArray(0, Nat.min(limit, userProfiles.size()));
  };

  public shared ({ caller }) func makeHttpOutcall(url : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can make HTTP outcalls");
    };
    await OutCall.httpGetRequest(url, [], transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    // No access control needed - this is a system callback for HTTP outcalls
    OutCall.transform(input);
  };

  func getProfileData(user : Principal) : UserProfile {
    switch (userProfiles.get(user)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User does not exist") };
    };
  };

  public query ({ caller }) func addToDebateHistory(debate : Debate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to debate history");
    };
    let currentProfile = getProfileData(caller);
    let updatedHistory = currentProfile.debateHistory.concat([debate]);
    let updatedProfile = { currentProfile with debateHistory = updatedHistory };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func updateDebateHistory(debateResult : DebateResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update debate history");
    };
    let currentProfile = getProfileData(caller);
    let updatedHistory = currentProfile.debateHistory.map(
      func(debate) { { debate with result = debateResult } }
    );
    let newProfile = { currentProfile with debateHistory = updatedHistory };
    userProfiles.add(caller, newProfile);
  };
};
