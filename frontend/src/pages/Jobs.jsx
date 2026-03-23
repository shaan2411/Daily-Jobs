import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Briefcase, Filter, ChevronRight, CheckCircle, Eye, Clock, Target } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [coords, setCoords] = useState(null);
  const [radius, setRadius] = useState(25);

  const fetchJobs = useCallback(async () => {
    try {
      let url = `/api/jobs?radius=${radius}`;
      if (coords) {
        url += `&lat=${coords.lat}&lng=${coords.lng}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setJobs(data.jobs || data);
      setLoading(false);
    } catch {
      console.error('Fetch jobs error');
    }
  }, [coords, radius]);

  const fetchUserApplications = useCallback(async () => {
    if (localStorage.getItem('role') !== 'seeker') return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/jobs/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAppliedJobs(data.map(a => a.jobId?._id));
    } catch {
      console.error('Fetch apps error');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) {
        await fetchJobs();
        await fetchUserApplications();
      }
    };
    load();
    return () => { isMounted = false; };
  }, [coords, radius, fetchJobs, fetchUserApplications]);

  const handleCitySearch = async () => {
    if (!citySearch) return fetchJobs();
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(citySearch)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        alert("Location not found");
      }
    } catch {
      console.error("Geocoding failed");
    }
    setLoading(false);
  };

  const handleApply = async (id) => {
    setApplyingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/jobs/${id}/apply`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAppliedJobs([...appliedJobs, id]);
      } else {
        const data = await res.json();
        console.error(data.error || 'Failed to apply');
      }
    } catch {
      console.error('Apply error');
    }
    setApplyingId(null);
  };

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      }, () => {
        console.error("Location access denied");
      });
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Search Bar */}
      <div id="job-search-section" className="card-base flex flex-col md:flex-row items-center gap-4 shadow-xl">
        <div className="flex-1 flex items-center px-4 space-x-3 bg-brand-bg rounded-xl border border-brand-border h-14 w-full">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Role, keyword or skill" 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 flex items-center px-4 space-x-3 bg-brand-bg rounded-xl border border-brand-border h-14 w-full">
          <MapPin size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search City or Region" 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
          />
        </div>
        <div className="flex-[0.5] flex flex-col px-4 bg-brand-bg rounded-xl border border-brand-border py-2 w-full">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Radius: {radius}km</label>
          <input 
            type="range" 
            min="5" max="500" step="5"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full accent-brand-primary"
          />
        </div>
        <button 
          onClick={requestLocation}
          className={`h-14 px-4 w-full md:w-auto flex items-center justify-center rounded-xl border ${coords ? 'bg-green-50 text-green-600 border-green-200' : 'bg-brand-bg text-gray-600 border-brand-border hover:border-brand-primary'} transition-all`}
          title="Use My GPS"
        >
          <Target size={20} />
        </button>
        <button 
          onClick={() => citySearch ? handleCitySearch() : fetchJobs()}
          className="btn-primary h-14 px-8 w-full md:w-auto flex items-center justify-center gap-2"
        >
           <Search size={18} /> Find
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Scanning local opportunities...</div>
      ) : (
        <div id="job-list" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job, idx) => {
            const cityName = job.city || (job.distance_km ? "Nearby" : "Local Site");
            const distanceText = job.distance_km ? `(${job.distance_km} km away)` : "";
            const isApplied = appliedJobs.includes(job._id);

            return (
              <div key={job._id} className="card-base flex flex-col justify-between group hover:border-brand-primary transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-xl flex items-center justify-center">
                      <Briefcase size={24} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isApplied ? 'bg-brand-bg text-brand-primary' : 'bg-green-50 text-green-600'}`}>
                      {isApplied ? 'Applied' : 'Open'}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-primary transition-all truncate" title={job.title}>{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <div className="flex items-center text-[11px] font-bold text-gray-500 uppercase tracking-tight bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        <MapPin size={12} className="mr-1 text-brand-primary" />
                        <span>{cityName}</span>
                        {distanceText && <span className="ml-1 text-brand-primary font-black">{distanceText}</span>}
                      </div>
                      <span className="text-xs text-brand-primary font-bold flex items-center">
                        <DollarSign size={14} className="mr-0.5" /> ₹{job.wage}/day
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-brand-border flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Link to={`/jobs/${job._id}`} className="p-2 rounded-lg hover:bg-brand-bg text-gray-400 hover:text-brand-primary transition-all">
                      <Eye size={18} />
                    </Link>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {isApplied ? (
                    <span className="text-xs font-bold text-green-600 flex items-center uppercase tracking-wider">
                      <CheckCircle size={16} className="mr-1.5" /> Applied
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleApply(job._id)}
                      disabled={applyingId === job._id}
                      id={idx === 0 ? "demo-apply-btn" : undefined}
                      className="btn-primary !px-4 !py-2 !text-xs"
                    >
                      {applyingId === job._id ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Jobs;
