import { Link } from 'react-router-dom';
export default function BlockchainBadge({ blockNumber }) {
    return (
        <div className="flex items-center gap-2 mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl animate-in fade-in zoom-in duration-500">
            <span className="text-xl">🔗</span>
            <div>
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Blockchain Verified</h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-400">
                    Secured on block #{blockNumber}
                </p>
            </div>
        </div>
    );
}
