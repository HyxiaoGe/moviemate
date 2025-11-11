import React from 'react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 text-lg mb-4">❌ {message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          重试
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;