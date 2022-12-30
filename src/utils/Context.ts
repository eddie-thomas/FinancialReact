import { createContext, useContext as useReactContext } from "react";

export interface ContextType {
  body?: JSX.Element;
  loggedIn: boolean;
}

interface AppStateType extends ContextType {
  setBody: (body?: JSX.Element) => void;
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
    setBody: (body) => setContext((prev) => ({ ...prev, body })),
    handleLogIn: () => setContext((prev) => ({ ...prev, loggedIn: true })),
    handleLogOut: () => setContext((prev) => ({ ...prev, loggedIn: false })),
  };
}
