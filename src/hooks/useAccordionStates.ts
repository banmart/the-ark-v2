import { useState, useCallback } from 'react';

interface AccordionState {
  [key: string]: boolean;
}

export const useAccordionStates = (initialState: AccordionState = {}) => {
  const [states, setStates] = useState<AccordionState>(initialState);

  const toggleAccordion = useCallback((key: string) => {
    setStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const openAccordion = useCallback((key: string) => {
    setStates(prev => ({
      ...prev,
      [key]: true
    }));
  }, []);

  const closeAccordion = useCallback((key: string) => {
    setStates(prev => ({
      ...prev,
      [key]: false
    }));
  }, []);

  const closeAllAccordions = useCallback(() => {
    setStates(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );
  }, []);

  const openAllAccordions = useCallback(() => {
    setStates(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
  }, []);

  return {
    states,
    toggleAccordion,
    openAccordion,
    closeAccordion,
    closeAllAccordions,
    openAllAccordions,
    isOpen: (key: string) => states[key] || false
  };
};