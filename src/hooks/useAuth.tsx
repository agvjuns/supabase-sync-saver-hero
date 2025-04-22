
import { createContext, useContext } from 'react';
import { useAuthState } from './auth/useAuthState';
import { useAuthMethods } from './auth/useAuthMethods';

type AuthContextType = ReturnType<typeof useAuthState> &
  ReturnType<typeof useAuthMethods>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authState = useAuthState();
  const authMethods = useAuthMethods();

  return (
    <AuthContext.Provider value={{ ...authState, ...authMethods }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
