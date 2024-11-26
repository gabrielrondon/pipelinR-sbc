import React, { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory, canisterId } from "./declarations/SmartBlockCanister";
import { BlockCard } from "./components/BlockCard";
import { BlockModal } from "./components/BlockModal";

const agent = new HttpAgent();
const smartBlockActor = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

function App() {
  const [blocks, setBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState({ content: "", fundingGoal: "" });
  const [status, setStatus] = useState("");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const result = await smartBlockActor.listBlocks();
      setBlocks(result);
    } catch (error) {
      setStatus("Error fetching blocks: " + error.message);
    }
  };

  const createBlock = async () => {
    try {
      setIsCreating(true);
      const tokenId = await smartBlockActor.createBlock(
        newBlock.content,
        BigInt(newBlock.fundingGoal)
      );
      setStatus("Block created successfully! Token ID: " + tokenId);
      setNewBlock({ content: "", fundingGoal: "" });
      fetchBlocks();
    } catch (error) {
      setStatus("Error creating block: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleContribute = async (tokenId, amount) => {
    try {
      const result = await smartBlockActor.contribute(
        tokenId,
        BigInt(amount)
      );
      setStatus(result);
      fetchBlocks();
      // Refresh the selected block details
      if (selectedBlock && selectedBlock.token_id === tokenId) {
        const updatedBlock = await smartBlockActor.getBlock(tokenId);
        setSelectedBlock(updatedBlock);
      }
    } catch (error) {
      setStatus("Error contributing: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Smart Block Platform</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Block
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {status && (
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">{status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Block Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <BlockCard
              key={block.token_id}
              block={block}
              onClick={() => setSelectedBlock(block)}
            />
          ))}
        </div>

        {/* Create Block Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full m-4">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create New Block</h3>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      value={newBlock.content}
                      onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Funding Goal (ICP)
                    </label>
                    <input
                      type="number"
                      value={newBlock.fundingGoal}
                      onChange={(e) => setNewBlock({ ...newBlock, fundingGoal: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={createBlock}
                      disabled={!newBlock.content || !newBlock.fundingGoal}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Block
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Block Details Modal */}
        {selectedBlock && (
          <BlockModal
            block={selectedBlock}
            onClose={() => setSelectedBlock(null)}
            onContribute={handleContribute}
          />
        )}
      </main>
    </div>
  );
}

export default App;
