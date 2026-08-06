import { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import ResultCard from '../components/ResultCard';
import { CloudDownload } from 'lucide-react';

export default function UploadPage() {
  const [result, setResult] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [fetchingDL, setFetchingDL] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

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

      {!result && !pendingResult ? (
        <div className="space-y-6">
            <UploadForm onResult={(res, file) => { setPendingResult(res); setOriginalFile(file); }} />
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
      ) : pendingResult && !result ? (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center space-y-6 animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Student Consent Required</h2>
            <p className="text-slate-500 text-sm">
                To comply with the Data Privacy Act, an OTP has been sent to the student's registered mobile number ending in ****1234.
            </p>
            <p className="text-xs text-blue-500 font-mono bg-blue-50 dark:bg-blue-900/20 p-2 rounded">(Demo Mode: Enter 1234 to proceed)</p>
            <div>
                <input 
                    type="text" 
                    maxLength="4"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP" 
                    className={`w-full text-center tracking-[1em] font-mono text-2xl p-4 border rounded-xl dark:bg-slate-900 focus:outline-none focus:ring-2 ${otpError ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'}`}
                />
                {otpError && <p className="text-red-500 text-xs mt-2">Invalid OTP. Please try again.</p>}
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => { setPendingResult(null); setOriginalFile(null); setOtp(''); setOtpError(false); }}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >Cancel</button>
                <button 
                    onClick={() => {
                        if (otp === '1234') {
                            setResult(pendingResult);
                        } else {
                            setOtpError(true);
                        }
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >Verify OTP</button>
            </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => { setResult(null); setPendingResult(null); setOriginalFile(null); setOtp(''); setOtpError(false); }}
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
