import React, { useEffect, useState } from 'react';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import '../styles/intro-custom.css';

const AppTour = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Check if tour has been seen
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => {
        setEnabled(true);
      }, 1500); // Small delay for layout to settle
    }

    // Listen for manual restart events
    const handleRestart = () => {
      setEnabled(true);
    };
    window.addEventListener('restart-tour', handleRestart);
    return () => window.removeEventListener('restart-tour', handleRestart);
  }, []);

  const onExit = () => {
    setEnabled(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const steps = [
    {
      element: '#main-sidebar',
      title: '🚀 Your Command Center',
      intro: 'Access your dashboard, browse jobs, and manage your settings from here. This is your home base.',
      position: 'right'
    },
    {
      element: '#main-header',
      title: '🔍 Instant Search',
      intro: 'Need something specific? Use the global search to find jobs, people, or projects instantly.',
      position: 'bottom'
    },
    {
      element: '#job-search-section',
      title: '📍 Precise Filtering',
      intro: 'Narrow down jobs by location, category, or pay. Our smart filters ensure you find exactly what you need.',
      position: 'bottom'
    },
    {
      element: '#job-list',
      title: '👷 Verified Opportunities',
      intro: 'Browse real-time daily wage jobs near you. All listings are verified for your safety.',
      position: 'top'
    },
    {
      element: '#demo-apply-btn',
      title: '👉 One-Tap Apply',
      intro: 'Found a match? Just tap apply to notify the employer immediately. Simple as that!',
      position: 'left'
    }
  ];

  const options = {
    showProgress: true,
    showBullets: true,
    exitOnOverlayClick: false,
    scrollToElement: true,
    doneLabel: 'Got it!',
    nextLabel: 'Next',
    prevLabel: 'Back'
  };

  return (
    <>
      <Steps
        enabled={enabled}
        steps={steps}
        initialStep={0}
        onExit={onExit}
        options={options}
      />
      {enabled && <div className="tour-active-bg" />}
    </>
  );
};

export default AppTour;
