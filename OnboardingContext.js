// OnboardingContext.js
import React, { createContext, useState, useContext } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }) => {
  const [isOnboarded, setIsOnboarded] = useState(false);

  return (
    <OnboardingContext.Provider value={{ isOnboarded, setIsOnboarded }}>
      {children}
    </OnboardingContext.Provider>
  );
};
