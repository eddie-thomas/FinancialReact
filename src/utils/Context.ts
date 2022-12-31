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
  loggedIn: boolean;
  user?: { name: string; accounts: Array<string> };
}

interface AppStateType extends ContextType {
  setBody: (body?: JSX.Element, bodyType?: PageType) => void;
  handleLogIn: () => void;
  handleLogOut: () => void;
}

export const defaultValue: ContextType = { loggedIn: false };

export const Context = createContext<
  [ContextType, React.Dispatch<React.SetStateAction<ContextType>>]
>([defaultValue, () => null]);

export function useContext(): AppStateType {
  const [context, setContext] = useReactContext(Context);

  return {
    ...context,
    setBody: (body, bodyType) =>
      setContext((prev) => ({ ...prev, body, bodyType })),
    handleLogIn: () =>
      setContext((prev) => ({ ...prev, loggedIn: true, user: users[0] })),
    handleLogOut: () =>
      setContext((prev) => ({ ...prev, loggedIn: false, user: undefined })),
  };
}
