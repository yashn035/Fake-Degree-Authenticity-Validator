import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Database, Fingerprint } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pt-20 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-center mb-6">
                    <ShieldCheck className="w-20 h-20 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Securing Academic Credentials, <br/><span className="text-blue-600 dark:text-blue-400">One Certificate at a Time</span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Government of Jharkhand – Smart Education Initiative. Verify degrees instantly with AI-powered OCR, cryptographic hashing, and fraud intelligence.
                </p>
                
                <div className="pt-8">
                    <Link to="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg transition-all active:scale-95">
                        Get Started Now
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                    <Search className="w-12 h-12 text-blue-500 mb-6" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">OCR & Validation</h3>
                    <p className="text-slate-500 dark:text-slate-400">Extract unstructured data flawlessly using Tesseract.js and match it instantly against institutional databases.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                    <Fingerprint className="w-12 h-12 text-blue-500 mb-6" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Tamper Detection</h3>
                    <p className="text-slate-500 dark:text-slate-400">Advanced perceptual hashing fingerprints every image to catch duplicates and detect unauthorized modifications.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                    <Database className="w-12 h-12 text-blue-500 mb-6" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Fraud Intelligence</h3>
                    <p className="text-slate-500 dark:text-slate-400">An enterprise admin dashboard to track verification trends, manage blacklisted certificates, and issue secure PDF reports.</p>
                </div>
            </div>
        </div>
    );
}
