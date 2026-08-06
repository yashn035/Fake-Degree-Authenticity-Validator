import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, Share2, FileText, QrCode, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import { generateReport, generateQRCode, applyWatermark, verifyCertificateOnChain } from '../api/apiClient';
import BlockchainBadge from './BlockchainBadge';

const verdictConfig = {
  VERIFIED: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2, label: 'Authentic Document' },
  TAMPERED: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle, label: 'Tampering Detected' },
  FLAGGED: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, label: 'Duplicate/Flagged' },
  BLACKLISTED: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: XCircle, label: 'Blacklisted Certificate' },
  NOT_FOUND: { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', icon: HelpCircle, label: 'Record Not Found' },
  LEGACY_UNVERIFIED: { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: HelpCircle, label: 'Legacy Document' }
};

export default function ResultCard({ result, originalFile }) {
  const [copied, setCopied] = useState(false);
  const [qrSrc, setQrSrc] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [watermarking, setWatermarking] = useState(false);
  const [chainData, setChainData] = useState(null);
  
  const config = verdictConfig[result.verdict] || verdictConfig.NOT_FOUND;
  const Icon = config.icon;
  const certId = result.dbRecord?.cert_id || result.certId;

  useEffect(() => {
    if (result.verdict === 'VERIFIED' && !result.isShared) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    if (result.verdict === 'VERIFIED' && certId) {
      generateQRCode(certId).then(data => setQrSrc(data.qrCode)).catch(console.error);
      verifyCertificateOnChain(certId).then(res => {
        if (res.verified) setChainData(res.block);
      }).catch(console.error);
    }
  }, [result, certId]);

  const handleShare = () => {
    if (!certId) return;
    const url = `${window.location.origin}/?certId=${certId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const pdfBlob = await generateReport({ ...result, qrCodeImage: qrSrc });
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Verification_Report_${certId}.pdf`;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleWatermark = async () => {
    if (!originalFile) return alert('Need original file to watermark.');
    setWatermarking(true);
    try {
      const blob = await applyWatermark(originalFile);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked_${certId}.png`;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setWatermarking(false);
    }
  };

  return (
    <div className={`rounded-3xl border-2 ${config.border} bg-white dark:bg-slate-800 dark:border-slate-700 shadow-xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500`}>
      <div className={`${config.bg} dark:bg-slate-900/50 p-8 flex items-center justify-between border-b ${config.border} dark:border-slate-700`}>
        <div className="flex items-center gap-4">
          <Icon className={`w-12 h-12 ${config.color}`} />
          <div>
            <h2 className={`text-2xl font-bold ${config.color}`}>{config.label}</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {['NOT_FOUND', 'BLACKLISTED', 'LEGACY_UNVERIFIED'].includes(result.verdict)
                ? result.message 
                : `Database ID: ${certId || 'Unknown'}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleDownloadPDF} disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                <FileText className="w-4 h-4" /> PDF Report
            </button>
            {(result.verdict === 'VERIFIED' || result.verdict === 'TAMPERED') && (
            <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
                <Share2 className="w-4 h-4" />
                {copied ? 'Copied!' : 'Share'}
            </button>
            )}
        </div>
      </div>

      <div className="p-8">
        {result.verdict === 'BLACKLISTED' && (
          <div className="mb-8 p-4 bg-purple-50 rounded-xl border border-purple-200 text-purple-800 flex gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p><strong>Reason:</strong> {result.reason}</p>
          </div>
        )}
        {result.verdict === 'TAMPERED' && result.mismatchedFields?.length > 0 && (
          <div className="mb-8 space-y-4">
            <h3 className="font-semibold text-red-800 text-lg border-b border-red-100 pb-2">Mismatched Fields Detected</h3>
            <div className="space-y-3">
              {result.mismatchedFields.map((field, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100 gap-2">
                  <span className="font-medium text-slate-700">{field.field}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-red-600 line-through">Found: {field.found}</span>
                    <span className="text-emerald-600 font-medium">Expected: {field.expected}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.verdict === 'FLAGGED' && (
          <div className="mb-8 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 flex gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>This exact document image has been uploaded before. While the data matches, this could indicate unauthorized sharing or duplication.</p>
          </div>
        )}

        {result.fraudPrediction && result.verdict !== 'VERIFIED' && (
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg mb-4">Rule-Based Fraud Scoring</h3>
            <div className="mb-2 flex justify-between text-sm font-medium">
                <span className="text-slate-600 dark:text-slate-400">Probability of Fraud</span>
                <span className={`${result.fraudPrediction.probability > 70 ? 'text-red-600' : result.fraudPrediction.probability > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {result.fraudPrediction.probability}%
                </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${result.fraudPrediction.probability > 70 ? 'bg-red-500' : result.fraudPrediction.probability > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${result.fraudPrediction.probability}%` }}
                ></div>
            </div>
            <p className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Risk Level: <strong className={`${result.fraudPrediction.riskLevel === 'HIGH' ? 'text-red-600' : result.fraudPrediction.riskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'}`}>{result.fraudPrediction.riskLevel}</strong>
            </p>
            {result.fraudPrediction.factors.length > 0 && (
                <ul className="text-sm space-y-1 mt-3">
                    {result.fraudPrediction.factors.map((factor, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <AlertTriangle className="w-3 h-3 text-amber-500" /> {factor}
                        </li>
                    ))}
                </ul>
            )}
          </div>
        )}

        {result.dbRecord && result.verdict !== 'NOT_FOUND' && (
          <div>
            <h3 className="font-semibold text-slate-800 text-lg border-b border-slate-100 pb-2 mb-4">Official Record Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-slate-500 mb-1">Student Name</span>
                <span className="font-medium text-slate-900">{result.dbRecord.student_name}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Institution</span>
                <span className="font-medium text-slate-900">{result.dbRecord.institution}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Course</span>
                <span className="font-medium text-slate-900">{result.dbRecord.course} ({result.dbRecord.year})</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Marks</span>
                <span className="font-medium text-slate-900">{result.dbRecord.marks}</span>
              </div>
            </div>
          </div>
        )}
        
        {chainData && <BlockchainBadge blockNumber={chainData.index} />}
        
        {result.verdict === 'VERIFIED' && qrSrc && (
          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <img src={qrSrc} alt="Verification QR" className="w-24 h-24 rounded shadow-sm border border-slate-200" />
               <div>
                  <h4 className="font-semibold text-slate-800"><QrCode className="inline w-4 h-4 mr-1"/> Scan to Verify</h4>
                  <p className="text-sm text-slate-500">Permanent cryptographic verification link.</p>
               </div>
             </div>
             
             {originalFile && (
               <button 
                 onClick={handleWatermark} disabled={watermarking}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50"
               >
                 <Lock className="w-4 h-4"/> Apply Secure Watermark
               </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
