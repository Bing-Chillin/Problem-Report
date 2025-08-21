import { useEffect, useCallback, useRef } from 'react';
import { logout, isLoggedIn } from '../utils/auth';

const INACTIVITY_TIMEOUT = 300000; // 5 minutes in milliseconds
const WARNING_TIMEOUT = 240000; // 4 minutes - show warning 1 minute before logout

export const useInactivityTimer = () => {
  const timeoutRef = useRef<number | null>(null);
  const warningTimeoutRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      window.clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    clearTimers();

    if (!isLoggedIn()) {
      return;
    }

    warningTimeoutRef.current = window.setTimeout(() => {
      const shouldContinue = confirm(
        'Inaktivitás miatt hamarosan kijelentkezel. Szeretnéd folytatni a munkát?'
      );
      
      if (shouldContinue) {
        resetTimer();
      }
    }, WARNING_TIMEOUT);

    timeoutRef.current = window.setTimeout(() => {
      console.log('User logged out due to inactivity');
      alert('A munkamenet lejárt. Kérjük, jelentkezz be újra.');
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [clearTimers]);

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
    ];

    const handleUserActivity = () => {
      if (isLoggedIn()) {
        resetTimer();
      }
    };

    const handleRouteChange = () => {
      if (isLoggedIn()) {
        resetTimer();
      }
    };

    const checkLoginStatus = () => {
      if (!isLoggedIn()) {
        clearTimers();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    window.addEventListener('popstate', handleRouteChange);
    
    // Check login status every 30 seconds
    const loginCheckInterval = setInterval(checkLoginStatus, 30000);

    if (isLoggedIn()) {
      resetTimer();
    }

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      window.removeEventListener('popstate', handleRouteChange);
      clearInterval(loginCheckInterval);
      clearTimers();
    };
  }, [resetTimer, clearTimers]);

  return { resetTimer, clearTimer: clearTimers };
};
