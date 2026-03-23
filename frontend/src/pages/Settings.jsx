import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Shield, Bell, Eye, Palette, CreditCard, LogOut, ChevronRight, Lock } from 'lucide-react';

const Settings = () => {
  const settingsGroups = [
    {
      title: 'Strategic Control',
      items: [
        { icon: Shield, label: 'Security & Integrity', text: 'Manage authentication protocols and session security.' },
        { icon: Lock, label: 'Access Permissions', text: 'Configure granular visibility and profile access.' },
        { icon: Bell, label: 'Communication Hub', text: 'Define notification triggers and delivery channels.' },
      ]
    },
    {
      title: 'Operations & Compliance',
      items: [
        { icon: Eye, label: 'Regulatory Privacy', text: 'Manage data governance and compliance standards.' },
        { icon: CreditCard, label: 'Financial Ecosystem', text: 'Configure payment gateways and transaction history.' },
      ]
    }
  ];

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        localStorage.clear();
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center space-x-6 pb-8 border-b border-brand-border">
        <div className="w-16 h-16 bg-brand-bg text-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/10">
          <SettingsIcon size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Preferences</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your workspace environment and security parameters.</p>
        </div>
      </div>

      <div className="space-y-10">
        {settingsGroups.map((group, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
              {group.title}
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {group.items.map((item, j) => (
                <div key={j} className="card-base flex items-center justify-between group hover:border-brand-primary transition-all cursor-pointer">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-brand-bg group-hover:text-brand-primary transition-all">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm group-hover:text-brand-primary transition-all">{item.label}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.text}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-primary transition-all" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="pt-8 border-t border-brand-border">
          <button 
            onClick={handleLogout}
            className="w-full py-4 border-2 border-dashed border-red-200 text-red-500 font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:border-red-500 transition-all flex items-center justify-center gap-3"
          >
            <LogOut size={18} />
            Terminate Current Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
