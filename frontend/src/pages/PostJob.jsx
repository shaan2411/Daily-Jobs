import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, FileText, ArrowRight, CheckCircle, Rocket, Target } from 'lucide-react';

const PostJob = () => {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    wage: '', 
    address: '', 
    lat: 0, 
    lng: 0, 
    city: 'Unknown', 
    state: 'Unknown', 
    pincode: '' 
  });
  const [searching, setSearching] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('role') !== 'employer') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSearchAddress = async () => {
    if (!formData.address) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const result = data[0];
        setFormData(prev => ({
          ...prev,
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        }));
        setLocationVerified(true);
      } else {
        alert("Address not found. Please be more specific.");
      }
    } catch {
      console.error('Geocoding error');
    }
    setSearching(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        const data = await res.json();
        console.error(data.error || 'Failed to post job');
      }
    } catch {
      console.error('An error occurred');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Opportunity Published</h2>
        <p className="text-gray-500 mt-2">Redirecting to your management dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-xl flex items-center justify-center">
          <Plus size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Post New Opportunity</h1>
          <p className="text-gray-500 text-sm">Reach thousands of verified daily wage professionals instantly.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-base space-y-8 shadow-xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text" placeholder="e.g. Senior Logistics Coordinator" required
                className="input-base !pl-12"
                value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Address / Location</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text" placeholder="e.g. 123 Street, Area, City" required
                    className="input-base !pl-12"
                    value={formData.address} onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      setLocationVerified(false);
                    }}
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleSearchAddress}
                  disabled={searching || !formData.address}
                  className={`px-6 rounded-xl font-bold text-xs transition-all ${locationVerified ? 'bg-green-50 text-green-600' : 'bg-brand-primary text-white hover:bg-brand-primary/90'} disabled:opacity-50`}
                >
                  {searching ? 'Finding...' : locationVerified ? 'Verified ✓' : 'Find'}
                </button>
              </div>
              {locationVerified && (
                <p className="text-[10px] text-green-600 font-bold ml-1 italic animate-in slide-in-from-left-2 transition-all">
                  Coordinates Captured: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daily Wage (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number" placeholder="Daily rate" required
                  className="input-base !pl-12"
                  value={formData.wage} onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detailed Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-gray-400" size={18} />
              <textarea
                placeholder="Outline responsibilities, requirements, and timing..." required rows="5"
                className="input-base !pl-12 pt-4 resize-none"
                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-border flex items-center justify-between">
          <p className="text-[10px] text-gray-400 max-w-[240px]">By publishing, you agree to our Terms of Service and Professional Conduct policies.</p>
          <button
            type="submit" disabled={loading}
            className="btn-primary !px-10 !py-3 flex items-center gap-2"
          >
            {loading ? 'Processing...' : 'Publish Listing'} <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

const Plus = ({ size, ...props }) => (
  <svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

export default PostJob;
