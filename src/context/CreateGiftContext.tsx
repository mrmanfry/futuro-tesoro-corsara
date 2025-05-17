"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultState = {
  childDetails: { name: '', lastName: '', birthdate: '', childProfileId: '' },
  theme: { type: '', custom: '', icon: '', color: '' },
  message: '',
  photo: '',
  team: [],
};

const CreateGiftContext = createContext({
  state: defaultState,
  setChildDetails: (data: { name: string; lastName: string; birthdate: string; childProfileId: string }) => {},
  setTheme: (data: any) => {},
  setMessage: (msg: string) => {},
  setPhoto: (url: string) => {},
  setTeam: (team: any[]) => {},
  reset: () => {},
});

export const CreateGiftProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('createGiftState');
      return saved ? JSON.parse(saved) : defaultState;
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('createGiftState', JSON.stringify(state));
  }, [state]);

  const setChildDetails = (data: { name: string; lastName: string; birthdate: string; childProfileId: string }) => setState((s: any) => ({ ...s, childDetails: data }));
  const setTheme = (data: any) => setState((s: any) => ({ ...s, theme: data }));
  const setMessage = (msg: string) => setState((s: any) => ({ ...s, message: msg }));
  const setPhoto = (url: string) => setState((s: any) => ({ ...s, photo: url }));
  const setTeam = (team: any[]) => setState((s: any) => ({ ...s, team }));
  const reset = () => setState(defaultState);

  return (
    <CreateGiftContext.Provider value={{ state, setChildDetails, setTheme, setMessage, setPhoto, setTeam, reset }}>
      {children}
    </CreateGiftContext.Provider>
  );
};

export const useCreateGiftContext = () => useContext(CreateGiftContext); 