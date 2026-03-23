import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  ArrowLeft,
  Share2,
  Bookmark,
  Building2,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
          
          // Check if already applied
          if (localStorage.getItem('role') === 'seeker') {
            const appsRes = await fetch('/api/jobs/applications');
            if (appsRes.ok) {
              const apps = await appsRes.json();
              setApplied(apps.some(app => app.jobId?._id === id));
            }
          }
        }
      } catch (err) {
        console.error('Fetch job error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, { method: 'POST' });
      if (res.ok) {
        setApplied(true);
        alert('Application submitted successfully!');
      }
    } catch (err) {
      console.error('Apply error:', err);
      alert('Failed to apply. Please try again.');
    }
  };

  if (loading) return <div className="p-32 text-center text-2xl font-black uppercase text-gray-400">Loading Job Details...</div>;
  if (!job) return <div className="p-32 text-center text-2xl font-black uppercase text-gray-400">Job Not Found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 font-poppins text-left">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-blue-500 font-black text-xl uppercase tracking-widest group">
        <ArrowLeft size={32} className="mr-4 group-hover:-translate-x-2 transition-transform" />
        Go Back
      </button>

      {/* Main Header Card */}
      <div className="bg-white border-8 border-gray-50 rounded-[3.5rem] p-12 shadow-2xl space-y-10">
        <div className="flex flex-col md:flex-row items-center gap-8 border-b-8 border-gray-50 pb-10">
          <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-500 border-4 border-blue-100">
            <Briefcase size={48} />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl font-black uppercase tracking-tight text-black leading-none">{job.title}</h1>
            <p className="text-2xl font-bold text-gray-400 mt-2 uppercase tracking-widest">{job.location} • {job.employerId?.name || 'Employer'}</p>
          </div>
        </div>

        {/* Big Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-8 rounded-[2rem] border-4 border-blue-100 space-y-2">
            <p className="text-lg font-black text-blue-400 uppercase tracking-widest">Daily Pay</p>
            <p className="text-5xl font-black text-blue-700">${job.wage} <span className="text-xl opacity-60">/ HR</span></p>
          </div>
          <div className="bg-gray-50 p-8 rounded-[2rem] border-4 border-gray-100 space-y-2">
            <p className="text-lg font-black text-gray-400 uppercase tracking-widest">Location</p>
            <p className="text-3xl font-black text-black">{job.location}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-6">
          <h3 className="text-3xl font-black uppercase tracking-tight border-l-8 border-blue-500 pl-6">Job Description</h3>
          <p className="text-2xl text-gray-600 font-medium leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <button 
            disabled={applied}
            onClick={handleApply}
            className={`py-8 rounded-[2rem] text-3xl font-black uppercase shadow-2xl transition-all active:scale-95 ${
              applied 
                ? 'bg-green-100 text-green-700 border-4 border-green-200 cursor-default' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {applied ? '✓ Applied' : 'Apply Now'}
          </button>
          <a 
            href={`tel:${job.employerId?.phone || '0000000000'}`}
            className="bg-[#10b981] py-8 rounded-[2rem] text-white text-3xl font-black uppercase text-center shadow-2xl hover:bg-[#059669] transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            📞 Call Now
          </a>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="bg-gray-50 border-4 border-gray-100 rounded-[2.5rem] p-10 flex items-center gap-8">
        <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white">
          <ShieldCheck size={48} />
        </div>
        <div className="text-left">
          <p className="text-2xl font-black uppercase text-black">Verified Job</p>
          <p className="text-xl font-bold text-gray-400">This employer is verified by DailyJobs.</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
