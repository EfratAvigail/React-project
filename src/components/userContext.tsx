import { createContext, ReactElement, useState } from "react";
import { user } from "../Types";

type userContextType = {
  Myuser: user | null,          // אפשר גם לאפשר null
  setMyUser: (Myuser: user) => void
}

export const userContext = createContext<userContextType>({
  Myuser: null,
  setMyUser: (_: user) => {}
});

const UserContext = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<user | null>(null);

  const setMyUser = (user: user) => {
    setUser(user);
  };

  return (
    <userContext.Provider value={{ Myuser: user, setMyUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContext;
