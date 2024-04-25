// import Dip721 "mo:stdlib/dip721.mo";
import NFTActorClass "./dip";
import Principal "mo:base/Principal";
import Types "./Types";
import Cycles "mo:base/ExperimentalCycles";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Nat16 "mo:base/Nat16";
import Int "mo:base/Int";
import Int16 "mo:base/Int16";
import HashMap "mo:base/HashMap";
import List "mo:base/List";

actor {

  // private stable var nftmapEntries : [(Principal, NFTActorClass.Dip721NonFungibleToken)] = [];
  // var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.Dip721NonFungibleToken>(1, Principal.equal, Principal.hash);

  private stable var nftmapEntries : [(Principal, List.List<Principal>)] = [];
  var mapOfNFTs = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);

  public shared (msg) func createAndMintNFT(logoImage : Text, name : Text, symbol : Text, maxL : Nat16) : async Principal {
    let logo : Types.LogoResult = {
      logo_type = "image/png";
      data = logoImage;
    };
    let nftInit : Types.Dip721NonFungibleToken = {
      logo = logo;
      name = name;
      symbol = symbol;
      maxLimit = maxL;
    };
    Cycles.add(200_000_000_000); // Since this value increases as time passes, change this value according to error in console.

    let result = await NFTActorClass.Dip721NFT(Principal.fromText("rfrca-lyaaa-aaaap-ag7ka-cai"), nftInit);
    let store = await result.getCanisterId();
    let owner = msg.caller;

    var ownedNFTs : List.List<Principal> = switch (mapOfNFTs.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    ownedNFTs := List.push(store, ownedNFTs);
    mapOfNFTs.put(owner, ownedNFTs);
    // mapOfNFTs.put(owner, store);

    // Example of preparing the metadata in Motoko, mirroring your CLI command
    let metadata : Types.MetadataDesc = [{
      purpose = #Rendered;
      data = Text.encodeUtf8("Developer Journey NFT"); // Correct way to convert Text to Blob
      key_val_data = [
        {
          key = "description";
          val = #TextContent "The NFT metadata can hold arbitrary metadata";
        },
        { key = "tag"; val = #TextContent "education" },
        { key = "contentType"; val = #TextContent "text/plain" },
        { key = "locationType"; val = #Nat8Content 4 },
      ];
    }];
    let i16 = Int16.fromNat16(maxL);
    let val = Int16.toInt(i16);
    let max = val;
    for (i in Iter.range(0, max -1)) {
      // Debug.print(debug_show (i));
      var receipt = await result.mintDip721(owner, metadata);
    };
    // var receipt = await result.mintDip721((Principal.fromText("7dy3i-uejra-uhz3d-ebcgj-jf7vr-h6yb3-le67j-gf5ky-trnfr-akgah-aqe"), metadata));

    return store;
    // return Principal.fromText("aaaaa-aa");
  };
  public shared (msg) func msgCaller() : async Principal {
    return msg.caller;
  };

  public func getNFTValues() : async [List.List<Principal>] {
    let ids = Iter.toArray(mapOfNFTs.vals());
    return ids;
  };
  public func getNFTsOwners() : async [Principal] {
    let ids = Iter.toArray(mapOfNFTs.keys());
    return ids;
  };
  public query func getOwnedNFTs(user : Principal) : async [Principal] {
    var ownedNFTs : List.List<Principal> = switch (mapOfNFTs.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };
    return List.toArray<Principal>(ownedNFTs);
  };

  // public query func getOwner(id : Principal) : async [Principal] {
  //   let listing = switch (mapOfNFTs.get(id)) {
  //     case null return Principal.fromText("aaaaa-aa"); // empty string isn't a valid principal...https://forum.dfinity.org/t/the-replica-returned-an-error-code-5-message-canister-trapped-explicitly-rts-error-blob-of-principal-principal-too-short/16439
  //     case (?result) result;
  //   };
  //   return listing;
  // };

  system func preupgrade() {
    nftmapEntries := Iter.toArray(mapOfNFTs.entries());

  };
  system func postupgrade() {
    mapOfNFTs := HashMap.fromIter<Principal, List.List<Principal>>(nftmapEntries.vals(), 1, Principal.equal, Principal.hash);
  };
};
