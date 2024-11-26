import React from 'react';

export function BlockCard({ block, onClick }) {
  const progress = (Number(block.total_funded) / Number(block.funding_goal)) * 100;
  const formattedDate = new Date(Number(block.created_at) / 1000000).toLocaleDateString();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {block.content}
          </h3>
          <p className="text-sm text-gray-500">ID: {block.token_id}</p>
        </div>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Funding Progress</span>
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

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            {block.contributions.length} contribution(s)
          </span>
          <span className="text-gray-500">
            {progress.toFixed(1)}% funded
          </span>
        </div>
      </div>
    </div>
  );
}
