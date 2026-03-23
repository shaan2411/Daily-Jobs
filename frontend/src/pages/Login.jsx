import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'seeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('role', formData.role);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Identity verification failed');
      }
    } catch (err) {
      setError('System connection error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] p-6 animate-in fade-in duration-1000">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-primary/20 mx-auto mb-6">
            D
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign in to DailyJobs</h2>
          <p className="text-gray-500 text-sm">Welcome back. Please enter your credentials.</p>
        </div>

        <div className="card-base shadow-2xl border-none">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email" placeholder="name@company.com" required
                    className="input-base !pl-12"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password" placeholder="••••••••" required
                    className="input-base !pl-12"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {['seeker', 'employer'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role })}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                      formData.role === role 
                        ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' 
                        : 'bg-white text-gray-500 border-brand-border hover:bg-gray-50'
                    }`}
                  >
                    {role === 'seeker' ? 'Service Pro' : 'Agency'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
            >
              {loading ? 'Authenticating...' : (
                <>
                  Access Workspace <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-border text-center">
            <p className="text-xs text-gray-500">
              New to the platform?{' '}
              <Link to="/register" className="text-brand-primary font-bold hover:underline">
                Create Professional Account
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-primary transition-all">
            Return to Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
