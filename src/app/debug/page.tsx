'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      console.log('API Response:', data);
      setApiResponse(data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debug API</h1>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Загрузка...' : 'Тестировать API'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {apiResponse && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">API Response:</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

