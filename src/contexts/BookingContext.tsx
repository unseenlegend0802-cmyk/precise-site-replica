import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Hospital } from "@/data/hospitals";

interface BookingState {
  selectedHospital: Hospital | null;
  patientName: string;
  medicalIssue: string;
  detectedConditions: string[];
}

interface BookingContextType extends BookingState {
  setSelectedHospital: (h: Hospital) => void;
  setPatientInfo: (name: string, conditions: string[]) => void;
  clearBooking: () => void;
  hasPendingBooking: boolean;
}

const STORAGE_KEY = "medagg_booking";

const defaultState: BookingState = {
  selectedHospital: null,
  patientName: "",
  medicalIssue: "",
  detectedConditions: [],
};

const BookingContext = createContext<BookingContextType>({
  ...defaultState,
  setSelectedHospital: () => {},
  setPatientInfo: () => {},
  clearBooking: () => {},
  hasPendingBooking: false,
});

export const useBooking = () => useContext(BookingContext);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BookingState>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setSelectedHospital = useCallback((h: Hospital) => {
    setState((prev) => ({ ...prev, selectedHospital: h }));
  }, []);

  const setPatientInfo = useCallback((name: string, conditions: string[]) => {
    setState((prev) => ({
      ...prev,
      patientName: name,
      medicalIssue: conditions.join(", "),
      detectedConditions: conditions,
    }));
  }, []);

  const clearBooking = useCallback(() => {
    setState(defaultState);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setSelectedHospital,
        setPatientInfo,
        clearBooking,
        hasPendingBooking: !!state.selectedHospital,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
