import { useState, useCallback } from 'react';
import { uploadCertificate } from '../api/apiClient';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';

export default function UploadForm({ onResult }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [useMock, setUseMock] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError('');
    
    // Simulate progress bar
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        const bar = document.getElementById('fake-progress-bar');
        if (bar) bar.style.width = `${Math.min(progress, 90)}%`;
    }, 200);

    try {
      const result = await uploadCertificate(file, useMock);
      
      clearInterval(interval);
      const bar = document.getElementById('fake-progress-bar');
      if (bar) bar.style.width = '100%';
      
      setTimeout(() => onResult(result, file), 400); // slight delay for smooth transition
    } catch (err) {
      clearInterval(interval);
      setError(err.message || 'Failed to process document');
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 animate-in fade-in duration-300">
        <div className="space-y-6">
          <div className="h-12 w-full bg-slate-100 rounded-xl overflow-hidden relative">
            <div id="fake-progress-bar" className="absolute top-0 left-0 h-full bg-blue-500 w-0 transition-all duration-300 ease-out"></div>
          </div>
          <div className="text-center text-sm font-medium text-slate-500 animate-pulse">Running OCR & Validating against Database...</div>
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4 mx-auto"></div>
            <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2 mx-auto"></div>
            <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-in-out ${
            isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            id="fileInput"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*,.pdf"
          />
          
          <div className="pointer-events-none flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <UploadCloud className="w-8 h-8 text-blue-600" />
            </div>
            {file ? (
              <div className="flex items-center gap-2 text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <File className="w-4 h-4 text-slate-400" />
                <span className="font-medium truncate max-w-[200px]">{file.name}</span>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-slate-700">Drop your certificate here</p>
                <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG, or PDF</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
            <X className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
          <input 
            type="checkbox" 
            id="mockData" 
            checked={useMock} 
            onChange={(e) => setUseMock(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 border-slate-300"
          />
          <label htmlFor="mockData" className="text-sm text-slate-500 cursor-pointer">Use Mock Data (Demo Mode)</label>
        </div>

        <button
          type="submit"
          disabled={!file}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Verify Authenticity
        </button>
      </form>
    </div>
  );
}
