/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

import { createContext, useContext as useReactContext } from "react";

export enum PageType {
  Account = "account",
  Transaction = "transaction",
  Upload = "upload",
}

export interface User {
  name: string;
  accounts: Array<string>;
}

export interface ContextType {
  body?: JSX.Element;
  bodyType?: PageType;
  loginDialogOpen: boolean;
  loggedIn: boolean;
  user?: User;
}

interface AppStateType extends ContextType {
  setBody: (body?: JSX.Element, bodyType?: PageType) => void;
  handleAttemptLogin: () => void;
  handleLogIn: (user: User) => void;
  handleLogOut: () => void;
}

export const defaultValue: ContextType = {
  loggedIn: false,
  loginDialogOpen: true,
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
    handleLogIn: (user: User) =>
      setContext((prev) => ({
        ...prev,
        loggedIn: true,
        loginDialogOpen: false,
        user,
      })),
    handleLogOut: () =>
      setContext((prev) => ({ ...prev, loggedIn: false, user: undefined })),
  };
}
