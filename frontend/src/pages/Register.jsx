import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Upload, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', password: '', role: 'seeker'
  });
  const [idProof, setIdProof] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idProof) {
      console.log("Proceeding with demo ID verification");
    }
    
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('addressProof', idProof);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setError(result.error || 'Registration protocols failed');
      }
    } catch (err) {
      setError('Network sync error. Please retry registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] p-6 py-20 animate-in fade-in duration-1000">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-primary/20 mx-auto mb-6">
            D
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Professional Account</h2>
          <p className="text-gray-500 text-sm">Join the ecosystem of verified daily wage professionals.</p>
        </div>

        <div className="card-base shadow-2xl border-none">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold animate-in slide-in-from-top-2 text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text" placeholder="Johnathan Doe" required
                    className="input-base !pl-12"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Communication Line</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel" placeholder="+1 000 000 000" required
                      className="input-base !pl-12"
                      value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">System Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email" placeholder="name@domain.com" required
                      className="input-base !pl-12"
                      value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Geographic Placement</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text" placeholder="City, State, Zip" required
                    className="input-base !pl-12"
                    value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Global Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password" placeholder="••••••••" required
                    className="input-base !pl-12"
                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              <div className="pt-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Security Verification (ID Proof)</label>
                <label className="flex items-center justify-center w-full px-6 py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-brand-primary transition-all group">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload size={24} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-600 uppercase tracking-wider">
                      {idProof ? idProof.name : 'Upload Identity Document'}
                    </span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setIdProof(e.target.files[0])} />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? 'Initializing...' : (
                <>
                  Establish Identity <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-border text-center">
            <p className="text-xs text-gray-500">
              Already verified?{' '}
              <Link to="/login" className="text-brand-primary font-bold hover:underline">
                Sign In to Workspace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
