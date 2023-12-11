import { createContext } from "react";

import useAccount from "../hooks/useAccount";
import useFreeBackground from "../hooks/useFreeBackground";
import useFreeMusic from "../hooks/useFreeMusic";
import useLoading from "../hooks/useLoading";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const loadingState = useLoading();
  const accountState = useAccount();
  const freeBackgroundState = useFreeBackground();
  const freeMusicState = useFreeMusic();

  return (
    <AppContext.Provider
      value={{
        loadingState,
        accountState,
        freeBackgroundState,
        freeMusicState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
