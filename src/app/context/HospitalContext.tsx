import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getHospitals, type Hospital } from "../../services/hospital.service";

const STORAGE_KEY = "careflow.currentHospitalId";

interface HospitalContextValue {
  hospitals: Hospital[];
  currentHospital: Hospital | null;
  isLoading: boolean;
  error: string | null;
  selectHospital: (hospitalId: string) => void;
  refreshHospitals: () => Promise<void>;
}

const HospitalContext = createContext<HospitalContextValue | undefined>(undefined);

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [currentHospitalId, setCurrentHospitalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshHospitals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getHospitals(1, 100);
      const activeHospitals = response.data.filter(
        (hospital) => hospital.status === "ACTIVE",
      );
      const storedHospitalId = window.sessionStorage.getItem(STORAGE_KEY);
      const selectedId = [currentHospitalId, storedHospitalId]
        .find((id) => activeHospitals.some((hospital) => hospital.id === id));

      setHospitals(activeHospitals);
      setCurrentHospitalId(selectedId ?? activeHospitals[0]?.id ?? null);
    } catch (loadError) {
      console.error("Failed to load hospitals:", loadError);
      setHospitals([]);
      setCurrentHospitalId(null);
      setError("Unable to load hospitals.");
    } finally {
      setIsLoading(false);
    }
  }, [currentHospitalId]);

  useEffect(() => {
    void refreshHospitals();
  }, [refreshHospitals]);

  const selectHospital = useCallback((hospitalId: string) => {
    setCurrentHospitalId(hospitalId);
    window.sessionStorage.setItem(STORAGE_KEY, hospitalId);
  }, []);

  const currentHospital = useMemo(
    () => hospitals.find((hospital) => hospital.id === currentHospitalId) ?? null,
    [currentHospitalId, hospitals],
  );

  const value = useMemo(() => ({
    hospitals,
    currentHospital,
    isLoading,
    error,
    selectHospital,
    refreshHospitals,
  }), [currentHospital, error, hospitals, isLoading, refreshHospitals, selectHospital]);

  return <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>;
}

export function useHospitalContext(): HospitalContextValue {
  const context = useContext(HospitalContext);

  if (!context) {
    throw new Error("useHospitalContext must be used within HospitalProvider.");
  }

  return context;
}
