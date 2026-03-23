import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical,
  TrendingUp,
  Activity,
  Briefcase,
  Users,
  Bookmark,
  ChevronRight,
  Settings,
  ShieldCheck,
  Zap,
  Star,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState({ name: 'User', role: 'seeker' });
  const [stats, setStats] = useState({ active: 0, applied: 0, notifications: 0 });
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role') || 'seeker';
        
        const headers = { 'Authorization': `Bearer ${token}` };

        const profileRes = await fetch('/api/auth/profile', { headers });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUser({ name: profile.name, role });
        }

        if (role === 'employer') {
          const [jobsRes, appsRes] = await Promise.all([
            fetch('/api/jobs/employer', { headers }),
            fetch('/api/jobs/applications/employer', { headers })
          ]);
          if (jobsRes.ok) {
            const jobs = await jobsRes.json();
            setStats(prev => ({ ...prev, active: jobs.length }));
          }
          if (appsRes.ok) {
            const apps = await appsRes.json();
            setActivity(apps.slice(0, 5).map(app => ({ message: `${app.seekerId?.name || 'A candidate'} applied for ${app.jobId?.title || 'a job'}` })));
            setStats(prev => ({ ...prev, applied: apps.length }));
          }
        } else {
          const [jobsRes, appsRes] = await Promise.all([
            fetch('/api/jobs'),
            fetch('/api/jobs/applications', { headers })
          ]);
          if (jobsRes.ok) {
            const jobs = await jobsRes.json();
            setStats(prev => ({ ...prev, active: jobs.length }));
          }
          if (appsRes.ok) {
            const apps = await appsRes.json();
            setActivity(apps.slice(0, 5));
            setStats(prev => ({ ...prev, applied: apps.length }));
          }
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Dashboard Mini-Hero Header */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-brand-primary">
              <LayoutDashboard size={20} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Management Console</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="text-brand-primary">{(user.name || 'User').split(' ')[0]}</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md">
              Your professional ecosystem is active. You have <span className="text-white font-bold">{stats.active} {user.role === 'employer' ? 'active listings' : 'available jobs'}</span> and {stats.applied} {user.role === 'employer' ? 'new applications to review' : 'submitted applications'}.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {user.role === 'employer' && (
              <Link to="/post-job" className="btn-primary !px-8 !py-4 shadow-xl shadow-brand-primary/20">
                <Plus size={20} /> Post New Opportunity
              </Link>
            )}
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/10 to-transparent"></div>
      </section>

      {/* Stats Grid - Synced with Index Categories style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: user.role === 'employer' ? 'Active Listings' : 'Available Jobs', val: stats.active, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: user.role === 'employer' ? 'Total Applications' : 'Your Applications', val: stats.applied, icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Integrity Score', val: '98.2%', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' }
        ].map((item, i) => (
          <div key={i} className="card-base group hover:-translate-y-1">
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all`}>
              <item.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold tracking-tight">Recent Activity Log</h2>
            <Link to="/notifications" className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-widest">
              Audit Full History
            </Link>
          </div>
          <div className="card-base !p-0 overflow-hidden border-none shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-brand-border">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operation Description</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-sm">
                {activity.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-16 text-center text-gray-400 italic">No recent system activity detected</td>
                  </tr>
                ) : (
                  activity.map((item, i) => {
                    const isApproved = item.status === 'approved';
                    const employer = item.jobId?.employerId;
                    const message = user.role === 'employer' 
                      ? `${item.seekerId?.name || 'A candidate'} applied for ${item.jobId?.title || 'a job'}`
                      : `You applied for ${item.jobId?.title || 'a job'}`;

                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-bg flex-shrink-0 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                              <Activity size={18} />
                            </div>
                            <div className="space-y-1">
                              <span className="font-semibold text-gray-700 block">{message}</span>
                              {user.role === 'seeker' && isApproved && employer && (
                                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 animate-in slide-in-from-top-2 duration-300">
                                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Accepted! Contact Employer:</div>
                                  <div className="text-sm font-bold text-gray-900">{employer.name}</div>
                                  <div className="text-xs text-gray-500 mb-3">{employer.phone} &bull; {employer.email}</div>
                                  <div className="flex space-x-2">
                                    <a href={`tel:${employer.phone}`} className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors">Call Now</a>
                                    <a href={`mailto:${employer.email}`} className="px-4 py-2 bg-white text-green-600 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-50 transition-colors">Email</a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          <span className={`px-3 py-1 ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'} rounded-full text-[9px] font-bold uppercase tracking-widest border capitalize`}>
                            {item.status || 'Verified'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          {user.role === 'employer' && (
            <div className="card-base bg-white border-2 border-brand-primary/10 relative overflow-hidden group">
              <div className="space-y-4 relative z-10">
                <div className="flex items-center space-x-2 text-brand-primary">
                  <Star size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Premium Status</span>
                </div>
                <h3 className="font-bold text-lg leading-tight">Elite Hiring Pack</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Your account has been optimized for high-volume recruitment. Access deeper analytics and priority job placement.</p>
                <button className="w-full py-3 btn-primary text-xs !rounded-xl">
                  VIEW ANALYTICS
                </button>
              </div>
            </div>
          )}

          <div className="card-base space-y-4 shadow-lg">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Operational Shortcuts</h3>
            <div className="space-y-2">
              {[
                { label: 'Profile Management', path: '/profile', icon: Users },
                { label: 'System Settings', path: '/settings', icon: Settings }
              ].map((link, i) => (
                <Link key={i} to={link.path} className="flex items-center justify-between group p-3 rounded-xl hover:bg-brand-bg transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-brand-primary group-hover:bg-white transition-all">
                      <link.icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-all">{link.label}</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-primary transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
          
          <div className="card-base bg-slate-900 text-white border-none relative overflow-hidden">
             <div className="flex items-center space-x-3 relative z-10">
               <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                 <Zap size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">System Health</p>
                 <p className="text-xs text-gray-400 font-medium italic">Operational • 99.9% uptime</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
