import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import TourTabToggle from './TourTabToggle';
import TourStepBreakdown from './TourStepBreakdown';
import { tourConfig } from './tourConfig';

const AppTourSection = () => {
  const [activeTab, setActiveTab] = useState('seeker');
  const content = tourConfig[activeTab];

  return (
    <section className="py-24 bg-white rounded-[4rem] px-8 md:px-12 border border-gray-100 shadow-sm overflow-hidden relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 pb-8 border-b border-gray-100">
          <div className="space-y-4 text-left">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100/50">
              <CheckCircle size={12} /> New User Guide
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Begin Your Journey with <span className="text-brand-primary">Daily Jobs</span>
            </h2>
            <p className="text-gray-500 max-w-xl font-medium text-lg leading-relaxed">
              Learn how to find verified local work or hire talent in 4 simple steps.
            </p>
          </div>
          <TourTabToggle activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Interaction Area */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
             <div className="lg:col-span-12">
                <TourStepBreakdown steps={content.steps} />
             </div>
          </div>
        </div>

        {/* CTA Area */}
        <div className="pt-12 bg-gray-50/50 p-8 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black text-slate-800">Ready to start?</h3>
            <p className="text-sm text-gray-500 font-medium">{content.subtitle}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Link 
              to={activeTab === 'seeker' ? "/jobs" : "/employer/post"} 
              className="group btn-primary px-10 py-4 rounded-2xl flex items-center justify-center gap-3 w-full md:w-auto shadow-xl hover:shadow-brand-primary/20"
            >
              {content.cta} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default AppTourSection;
