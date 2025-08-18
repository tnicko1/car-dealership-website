'use client';

import { useEffect } from 'react';

const ServiceWorkerRegistrar = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  return null; // This component does not render anything.
};

export default ServiceWorkerRegistrar;
