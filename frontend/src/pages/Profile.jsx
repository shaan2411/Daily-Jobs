import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Camera, Shield, Briefcase, ChevronRight, Globe, Award } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '', address: '', bio: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setEditData({ 
            name: data.name, 
            phone: data.phone || '', 
            address: data.address || '',
            bio: data.bio || 'Professional worker with experience in multiple fields.'
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  if (loading) return <div className="p-32 text-center text-gray-400 font-medium">Verifying Credentials...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Profile Header Card */}
      <div className="card-base !p-0 overflow-hidden border-none shadow-2xl relative">
        <div className="h-32 bg-gradient-to-r from-brand-primary to-blue-400"></div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-12 gap-6 relative z-10">
          <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl border border-brand-border">
            <div className="w-full h-full rounded-2xl bg-brand-bg flex items-center justify-center text-3xl font-bold text-brand-primary uppercase">
              {profile?.name?.charAt(0)}
            </div>
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
              <span className="px-3 py-1 bg-blue-50 text-brand-primary text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-100 flex items-center">
                <Shield size={12} className="mr-1" /> Verified
              </span>
            </div>
            <p className="text-gray-500 font-medium mt-1">{profile?.role === 'seeker' ? 'Service Professional' : 'Hiring Agency'}</p>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="btn-primary mb-2 flex items-center gap-2"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Contact & Metadata */}
        <div className="space-y-6">
          <div className="card-base space-y-4">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest">Connect</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-brand-bg flex items-center justify-center text-gray-500">
                  <Mail size={16} />
                </div>
                <span className="text-gray-600 font-medium">{profile?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-brand-bg flex items-center justify-center text-gray-500">
                  <Phone size={16} />
                </div>
                <span className="text-gray-600 font-medium">{profile?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-brand-bg flex items-center justify-center text-gray-500">
                  <MapPin size={16} />
                </div>
                <span className="text-gray-600 font-medium">{profile?.address || 'City Center, Local'}</span>
              </div>
            </div>
          </div>

          <div className="card-base bg-[#f8fafc] border-dashed border-2 border-slate-200">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Achievements</h3>
            <div className="space-y-3">
              {[
                { label: 'Reliability Score', val: '98%', icon: Award },
                { label: 'Network Strength', val: 'Lvl 4', icon: Globe },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center"><item.icon size={14} className="mr-2" /> {item.label}</span>
                  <span className="font-bold text-gray-900">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Professional History */}
        <div className="md:col-span-2 space-y-6">
          <div className="card-base space-y-4">
            <h3 className="font-bold text-lg">About Me</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {editData.bio}
            </p>
          </div>

          <div className="card-base space-y-6">
            <h3 className="font-bold text-lg">Activity Overview</h3>
            <div className="space-y-4">
              {[
                { title: 'Project Completion', company: 'Logistics Hub', date: '2 days ago' },
                { title: 'Identity Verification', company: 'System Admin', date: '1 week ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-start justify-between group">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-bg group-hover:text-brand-primary transition-all">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.company} • {item.date}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                <input 
                  type="text" className="input-base"
                  value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                  <input 
                    type="text" className="input-base"
                    value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
                  <div className="input-base bg-gray-50 text-gray-500 select-none opacity-60">
                    {profile?.role}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Bio / Description</label>
                <textarea 
                  className="input-base h-24 resize-none"
                  value={editData.bio} onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
