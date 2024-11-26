export const idlFactory = ({ IDL }) => {
  const TokenId = IDL.Text;
  const BlockId = IDL.Nat;
  const Contribution = IDL.Record({
    'timestamp' : IDL.Int,
    'amount' : IDL.Nat,
    'contributor' : IDL.Principal,
  });
  const SmartBlock = IDL.Record({
    'id' : BlockId,
    'content' : IDL.Text,
    'contributions' : IDL.Vec(Contribution),
    'token_id' : TokenId,
    'owner' : IDL.Principal,
    'created_at' : IDL.Int,
    'funding_goal' : IDL.Nat,
    'total_funded' : IDL.Nat,
  });
  return IDL.Service({
    'contribute' : IDL.Func([TokenId, IDL.Nat], [IDL.Text], []),
    'createBlock' : IDL.Func([IDL.Text, IDL.Nat], [TokenId], []),
    'getBlock' : IDL.Func([TokenId], [IDL.Opt(SmartBlock)], ['query']),
    'getFundingStatus' : IDL.Func(
        [TokenId],
        [
          IDL.Opt(
            IDL.Record({
              'contributions' : IDL.Vec(Contribution),
              'funding_goal' : IDL.Nat,
              'total_funded' : IDL.Nat,
            })
          ),
        ],
        ['query'],
      ),
    'getOwnedBlocks' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(SmartBlock)],
        ['query'],
      ),
    'listBlocks' : IDL.Func([], [IDL.Vec(SmartBlock)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
