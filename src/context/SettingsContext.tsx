import { FriendRequestsType, FriendType } from "@/app/types/connections";
import {
  LoadingRefType,
  SettingsContextCacheRecordType,
  SettingsContextOpenType,
  SettingsContextType,
} from "@/app/types/contexts";
import { createContext, useContext, useMemo, useRef, useState } from "react";

export const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<SettingsContextOpenType>("friends");
  const [stateCache, setStateCache] = useState<SettingsContextCacheRecordType>(
    {}
  );
  const loadingRef = useRef<LoadingRefType>({
    friends: true,
    requests: true,
    settings: true
  });

  const structureMap = {
    friends: { title: "Friends" },
    requests: { title: "Friend requests" },
    settings: { title: "Settings" },
  };

  const structure = structureMap[type];

  const setCache = (
    data: FriendRequestsType[] | FriendType[],
    dataKey: SettingsContextOpenType
  ) => {
    setStateCache((prev) =>
      prev[dataKey] === data
        ? prev
        : {
            ...prev,
            [dataKey]: data,
          }
    );
  };

  const addCache = (
    data: FriendRequestsType[] | FriendType[],
    dataKey: SettingsContextOpenType
  ) => {
    console.log(data);
  };

  const value = useMemo(
    () => ({
      open: { isOpen: open, type },
      toggle: () => setOpen((o) => !o),
      close: () => setOpen(false),
      changeType: (ty: SettingsContextOpenType) => setType(ty),
      structure,
      cache: stateCache ?? null,
      setCache,
      addCache,
      clearCache: (dataKey: SettingsContextOpenType) =>
        setStateCache((prev) => ({
          ...prev,
          [dataKey]: undefined,
        })),
      loadingRef,
    }),
    [open, type, structure, stateCache]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings outside provider");
  return ctx;
}
