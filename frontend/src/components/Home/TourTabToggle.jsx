import React from 'react';
import { Users, Building2 } from 'lucide-react';

const TourTabToggle = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center mb-10">
      <div className="inline-flex p-1.5 bg-gray-100/80 rounded-2xl shadow-inner border border-gray-200 backdrop-blur-sm">
        <button
          onClick={() => onTabChange('seeker')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'seeker' ? 'bg-white text-brand-primary shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
        >
          <Users size={20} /> For Job Seekers
        </button>
        <button
          onClick={() => onTabChange('employer')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'employer' ? 'bg-white text-brand-primary shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
        >
          <Building2 size={20} /> For Employers
        </button>
      </div>
    </div>
  );
};

export default TourTabToggle;
