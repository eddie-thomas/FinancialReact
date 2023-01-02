import { createContext, useContext as useReactContext } from "react";

import users from "../json/users.json";

export enum PageType {
  Account = "account",
  Transaction = "transaction",
  Upload = "upload",
}

export interface ContextType {
  body?: JSX.Element;
  bodyType?: PageType;
  loginDialogOpen: boolean;
  loggedIn: boolean;
  user?: { name: string; accounts: Array<string> };
}

interface AppStateType extends ContextType {
  setBody: (body?: JSX.Element, bodyType?: PageType) => void;
  handleAttemptLogin: () => void;
  handleLogIn: (userIndex: number) => void;
  handleLogOut: () => void;
}

export const defaultValue: ContextType = {
  loggedIn: false,
  loginDialogOpen: false,
};

export const Context = createContext<
  [ContextType, React.Dispatch<React.SetStateAction<ContextType>>]
>([defaultValue, () => null]);

export function useContext(): AppStateType {
  const [context, setContext] = useReactContext(Context);

  return {
    ...context,
    setBody: (body, bodyType) =>
      setContext((prev) => ({ ...prev, body, bodyType })),
    handleAttemptLogin: () =>
      setContext((prev) => ({ ...prev, loginDialogOpen: true })),
    handleLogIn: (userIndex: number) =>
      setContext((prev) => ({
        ...prev,
        loggedIn: true,
        loginDialogOpen: false,
        user: users[userIndex],
      })),
    handleLogOut: () =>
      setContext((prev) => ({ ...prev, loggedIn: false, user: undefined })),
  };
}
