
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('🚨 Application Error Detected:', error);

        // Trigger Self-Healing
        const reportError = async () => {
            try {
                await fetch('/api/report-error', {
                    method: 'POST',
                    body: JSON.stringify({
                        error_message: error.message,
                        file_path: 'src/app/page.tsx' // Heuristic: In a real app, stack trace parsing would refine this
                    })
                });
                console.log('✅ Error reported to Self-Healing Agent');
            } catch (err) {
                console.error('Failed to report error:', err);
            }
        };

        reportError();
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white p-4">
            <div className="bg-[#1A1A1E] border border-red-500/20 rounded-xl p-8 max-w-md text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-red-400">Something went wrong!</h2>
                <p className="text-gray-400 mb-6 text-sm">
                    Don't worry, the <span className="text-blue-400 font-semibold">Anti-Gravity Healer</span> has been notified and is fixing it.
                </p>
                <div className="bg-black/50 p-4 rounded-lg text-left mb-6 overflow-hidden">
                    <code className="text-xs text-red-300 font-mono block break-words">
                        {error.message}
                    </code>
                </div>
                <button
                    onClick={reset}
                    className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Try to Recover
                </button>
            </div>
        </div>
    );
}
