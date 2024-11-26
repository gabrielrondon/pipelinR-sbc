import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";

actor SmartBlockCanister {
  // Types
  type BlockId = Nat;
  type TokenId = Text;
  type Contribution = {
    contributor: Principal;
    amount: Nat;
    timestamp: Int;
  };

  type SmartBlock = {
    id: BlockId;
    content: Text;
    owner: Principal;
    token_id: TokenId;
    created_at: Int;
    funding_goal: Nat;
    total_funded: Nat;
    contributions: [Contribution];
  };

  // Stable storage
  stable var next_block_id: Nat = 0;
  stable var blocks_entries : [(BlockId, SmartBlock)] = [];
  stable var token_to_block : [(TokenId, BlockId)] = [];

  // Runtime state
  private var blocks = Map.HashMap<BlockId, SmartBlock>(0, Nat.equal, Hash.hash);
  private var tokens = Map.HashMap<TokenId, BlockId>(0, Text.equal, Text.hash);

  // Initialize state from stable storage
  system func preupgrade() {
    blocks_entries := Iter.toArray(blocks.entries());
    token_to_block := Iter.toArray(tokens.entries());
  };

  system func postupgrade() {
    for ((id, block) in blocks_entries.vals()) {
      blocks.put(id, block);
    };
    for ((token, block_id) in token_to_block.vals()) {
      tokens.put(token, block_id);
    };
  };

  // Generate a unique token ID
  private func generateTokenId(id: BlockId, owner: Principal) : TokenId {
    let seed = Text.concat(Nat.toText(id), Principal.toText(owner));
    let hash = Nat32.toNat(Text.hash(seed));
    Nat.toText(hash)
  };

  // Create a new Smart Block with tokenization
  public shared(msg) func createBlock(content: Text, funding_goal: Nat) : async TokenId {
    let block_id = next_block_id;
    next_block_id += 1;

    let owner = msg.caller;
    let token_id = generateTokenId(block_id, owner);
    
    let new_block : SmartBlock = {
      id = block_id;
      content = content;
      owner = owner;
      token_id = token_id;
      created_at = Time.now();
      funding_goal = funding_goal;
      total_funded = 0;
      contributions = [];
    };

    blocks.put(block_id, new_block);
    tokens.put(token_id, block_id);

    token_id
  };

  // Contribute funds to a Smart Block
  public shared(msg) func contribute(token_id: TokenId, amount: Nat) : async Text {
    switch (tokens.get(token_id)) {
      case null { return "Error: Invalid token ID" };
      case (?block_id) {
        switch (blocks.get(block_id)) {
          case null { return "Error: Block not found" };
          case (?block) {
            let contribution : Contribution = {
              contributor = msg.caller;
              amount = amount;
              timestamp = Time.now();
            };

            let new_total = block.total_funded + amount;
            let new_contributions = Array.tabulate<Contribution>(
              block.contributions.size() + 1,
              func (i) {
                if (i < block.contributions.size()) {
                  block.contributions[i]
                } else {
                  contribution
                }
              }
            );

            let updated_block : SmartBlock = {
              id = block.id;
              content = block.content;
              owner = block.owner;
              token_id = block.token_id;
              created_at = block.created_at;
              funding_goal = block.funding_goal;
              total_funded = new_total;
              contributions = new_contributions;
            };

            blocks.put(block_id, updated_block);
            return "Contribution successful. Total funded: " # Nat.toText(new_total);
          };
        };
      };
    };
  };

  // Get block details including funding status
  public query func getBlock(token_id: TokenId) : async ?SmartBlock {
    switch (tokens.get(token_id)) {
      case null { null };
      case (?block_id) { blocks.get(block_id) };
    };
  };

  // List all blocks with their funding status
  public query func listBlocks() : async [SmartBlock] {
    Iter.toArray(blocks.vals())
  };

  // Get funding status of a block
  public query func getFundingStatus(token_id: TokenId) : async ?{total_funded: Nat; funding_goal: Nat; contributions: [Contribution]} {
    switch (tokens.get(token_id)) {
      case null { null };
      case (?block_id) {
        switch (blocks.get(block_id)) {
          case null { null };
          case (?block) {
            ?{
              total_funded = block.total_funded;
              funding_goal = block.funding_goal;
              contributions = block.contributions;
            }
          };
        };
      };
    };
  };

  // Get blocks owned by a principal
  public query func getOwnedBlocks(owner: Principal) : async [SmartBlock] {
    let owned_blocks = Array.filter<SmartBlock>(
      Iter.toArray(blocks.vals()),
      func (block) { Principal.equal(block.owner, owner) }
    );
    owned_blocks
  };
}