import { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import ResultCard from '../components/ResultCard';

export default function UploadPage() {
  const [result, setResult] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const certId = params.get('certId');
    if (certId) {
      import('../api/apiClient').then(({ fetchVerificationById }) => {
        fetchVerificationById(certId)
          .then(data => setResult({ ...data, isShared: true }))
          .catch(err => console.error('Failed to load shared result:', err));
      });
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Verify Academic Credentials</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Upload a certificate to instantly verify its authenticity against institutional databases using AI-powered OCR.
        </p>
      </div>

      {!result ? (
        <UploadForm onResult={(res, file) => { setResult(res); setOriginalFile(file); }} />
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => { setResult(null); setOriginalFile(null); }}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center transition-colors"
          >
            ← Verify another document
          </button>
          <ResultCard result={result} originalFile={originalFile} />
        </div>
      )}
    </div>
  );
}
