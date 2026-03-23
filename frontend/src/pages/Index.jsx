import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Rocket, 
  ShieldCheck, 
  TrendingUp, 
  Users,
  Briefcase,
  Building2,
  ChevronRight,
  Clock,
  Settings
} from 'lucide-react';
import AppTourSection from '../components/Home/AppTourSection';

const Index = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          const jobArray = data.jobs || data;
          if (Array.isArray(jobArray)) {
            setJobs(jobArray.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const categories = [
    { name: 'Construction', icon: Building2, count: '120+ Jobs' },
    { name: 'Cleaning', icon: ShieldCheck, count: '85+ Jobs' },
    { name: 'Delivery', icon: Rocket, count: '64+ Jobs' },
    { name: 'Unloading', icon: TrendingUp, count: '42+ Jobs' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[360px] rounded-3xl overflow-hidden bg-slate-900 flex items-center px-12 text-white">
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Connecting Talent with <span className="text-brand-primary">Opportunity</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Find the best daily wage jobs in your city. Verified employers, guaranteed payments, and a seamless application process.
          </p>
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl p-2 shadow-xl max-w-lg">
            <div className="flex-1 flex items-center px-4 space-x-2 border-r border-gray-100">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" placeholder="Job title or keyword" 
                className="bg-transparent border-none focus:ring-0 text-sm text-gray-800 w-full" 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 space-x-2">
              <MapPin size={18} className="text-gray-400" />
              <input 
                type="text" placeholder="Location" 
                className="bg-transparent border-none focus:ring-0 text-sm text-gray-800 w-full" 
                value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-brand-primary text-white p-3 rounded-lg hover:bg-blue-700 transition-all">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/20 to-transparent"></div>
      </section>

      {/* App Tour Section */}
      <AppTourSection />

      {/* Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Categories</h2>
          <Link to="/jobs" className="text-brand-primary text-sm font-semibold hover:underline flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="card-base hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-primary mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all">
                <cat.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-800">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Recently Posted Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 py-20 text-center text-gray-400">Loading opportunities...</div>
          ) : (
            jobs.map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`} className="card-base flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-primary">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-brand-primary transition-all">{job.title || 'Untitled Opportunity'}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <MapPin size={12} className="mr-1" /> {job.location || 'Local Site'}
                      </span>
                      <span className="text-xs text-green-600 font-bold">
                        ₹{job.wage || 0}/day
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-brand-primary transition-all" />
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
