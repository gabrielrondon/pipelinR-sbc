import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type BlockId = bigint;
export interface Contribution {
  'timestamp' : bigint,
  'amount' : bigint,
  'contributor' : Principal,
}
export interface SmartBlock {
  'id' : BlockId,
  'content' : string,
  'contributions' : Array<Contribution>,
  'token_id' : TokenId,
  'owner' : Principal,
  'created_at' : bigint,
  'funding_goal' : bigint,
  'total_funded' : bigint,
}
export type TokenId = string;
export interface _SERVICE {
  'contribute' : ActorMethod<[TokenId, bigint], string>,
  'createBlock' : ActorMethod<[string, bigint], TokenId>,
  'getBlock' : ActorMethod<[TokenId], [] | [SmartBlock]>,
  'getFundingStatus' : ActorMethod<
    [TokenId],
    [] | [
      {
        'contributions' : Array<Contribution>,
        'funding_goal' : bigint,
        'total_funded' : bigint,
      }
    ]
  >,
  'getOwnedBlocks' : ActorMethod<[Principal], Array<SmartBlock>>,
  'listBlocks' : ActorMethod<[], Array<SmartBlock>>,
}
