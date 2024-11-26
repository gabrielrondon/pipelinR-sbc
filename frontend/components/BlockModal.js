import React, { useState } from 'react';

export function BlockModal({ block, onClose, onContribute }) {
  const [amount, setAmount] = useState('');
  const progress = (Number(block.total_funded) / Number(block.funding_goal)) * 100;

  const handleContribute = () => {
    onContribute(block.token_id, amount);
    setAmount('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">Block Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <p className="mt-1 text-gray-900">{block.content}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Token ID</label>
              <p className="mt-1 text-sm text-gray-500 font-mono">{block.token_id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Owner</label>
              <p className="mt-1 text-sm text-gray-500 font-mono">{block.owner.toString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Funding Status</label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">
                    {block.total_funded.toString()} / {block.funding_goal.toString()} ICP
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contributions
              </label>
              <div className="border rounded-lg divide-y">
                {block.contributions.map((contribution, index) => (
                  <div key={index} className="p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-600">
                        {contribution.contributor.toString().slice(0, 10)}...
                      </span>
                      <span className="font-medium">
                        {contribution.amount.toString()} ICP
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(Number(contribution.timestamp) / 1000000).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make a Contribution
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount in ICP"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={handleContribute}
                  disabled={!amount}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Contribute
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
