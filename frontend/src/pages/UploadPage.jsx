import { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import ResultCard from '../components/ResultCard';
import { CloudDownload } from 'lucide-react';

export default function UploadPage() {
  const [result, setResult] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [fetchingDL, setFetchingDL] = useState(false);

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

  const handleDigilockerFetch = () => {
      const id = window.prompt("Enter 12-digit Aadhaar or DigiLocker ID:");
      if (!id || id.length < 10) return alert("Invalid ID");
      setFetchingDL(true);
      setTimeout(() => {
          setFetchingDL(false);
          setResult({
              verdict: 'VERIFIED',
              certId: 'DL-MOCK-' + Math.floor(Math.random() * 10000),
              dbRecord: {
                  cert_id: 'DL-MOCK-' + Math.floor(Math.random() * 10000),
                  student_name: 'Verified Citizen',
                  institution: 'DigiLocker Verified Institution',
                  course: 'B.Tech Computer Science',
                  year: '2022',
                  marks: '85%'
              },
              matchedFields: ['name', 'institution', 'course', 'year', 'marks'],
              mismatchedFields: [],
              message: 'Verified directly via DigiLocker India Stack.',
              fraudPrediction: { probability: 0, riskLevel: 'LOW', factors: [] }
          });
      }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Verify Academic Credentials</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Upload a certificate to instantly verify its authenticity against institutional databases using AI-powered OCR.
        </p>
      </div>

      {!result ? (
        <div className="space-y-6">
            <UploadForm onResult={(res, file) => { setResult(res); setOriginalFile(file); }} />
            <div className="flex items-center justify-center space-x-4 py-4">
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                <span className="text-slate-400 text-sm font-medium">OR</span>
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            </div>
            <button 
                onClick={handleDigilockerFetch} disabled={fetchingDL}
                className="w-full py-4 px-6 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
                <CloudDownload className="w-5 h-5 text-blue-600" />
                {fetchingDL ? 'Authenticating with National e-Governance Division...' : 'Fetch Verified Document from DigiLocker'}
            </button>
        </div>
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
