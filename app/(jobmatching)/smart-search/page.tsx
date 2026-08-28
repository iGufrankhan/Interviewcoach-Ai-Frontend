'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/withProtectedRoute';
import { getAuthHeaders } from '@/lib/auth/authUtils';
import { Search, Briefcase, Star, AlertCircle, Play, Loader2, Target, ArrowLeft } from 'lucide-react';

export default function SmartSearch() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setError('');
    setJobs([]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/jobmatching/smart-search?target_role=${encodeURIComponent(searchTerm)}`, {
        headers: getAuthHeaders() as any
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to search jobs');
      }

      setJobs(result.data.jobs || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while searching.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 pt-12">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="mb-8 flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10 w-max"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Target className="w-4 h-4" />
            Agentic Discovery
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-linear-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            Smart Job Search
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Our AI scans live jobs on the market, compares them against your resume, and identifies exactly what you need to study.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12 max-w-3xl mx-auto relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-violet-500 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-2 backdrop-blur-md">
              <Search className="w-6 h-6 text-zinc-400 ml-4" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="E.g. Senior Frontend Developer, Data Scientist..."
                className="flex-1 bg-transparent border-none outline-hidden px-4 py-4 text-white placeholder-zinc-500 text-lg"
                disabled={isSearching}
              />
              <button 
                type="submit"
                disabled={isSearching || !searchTerm}
                className="bg-linear-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 px-8 py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search Market"}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Results Grid */}
        {jobs.length > 0 && (
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-violet-400" />
              Top Matches Found ({jobs.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job: any, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-violet-500/30 transition-all group flex flex-col h-full relative overflow-hidden">
                  
                  {/* Score Badge */}
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-bold">
                    <Star className="w-4 h-4 fill-violet-400" />
                    {job.match_score}% Match
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 pr-24">{job.job_title}</h3>
                  <p className="text-cyan-400 font-medium mb-4">{job.company_name}</p>
                  
                  {/* Skill Gap Analysis */}
                  <div className="mb-6 flex-1">
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Missing Skills
                    </h4>
                    {job.missing_skills && job.missing_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {job.missing_skills.map((skill: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-emerald-400 text-sm flex items-center gap-1">
                        Perfect match! No major skills missing.
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                    <a 
                      href={job.apply_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 px-5 py-2.5 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] text-center block"
                    >
                      View Full Job
                    </a>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
