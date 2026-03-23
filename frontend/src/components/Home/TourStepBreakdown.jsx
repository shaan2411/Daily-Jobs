import React from 'react';

const TourStepBreakdown = ({ steps }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mt-8">
      {steps.map((step, idx) => (
        <div key={idx} className="group flex items-start gap-6 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all duration-500">
          <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
            {step.icon}
          </div>
          <div class="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-brand-primary bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                {step.label}
              </span>
              <h4 className="font-black text-gray-900 text-lg tracking-tight">
                {step.title}
              </h4>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TourStepBreakdown;
