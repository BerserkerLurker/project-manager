import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as fakesessionsApi from "../api/fakesessions";
import * as fakeusersApi from "../api/fakeusers";
const AuthContext = createContext({});

export function AuthProvider(children) {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // reset error on page change
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  useEffect(() => {
    fakeusersApi
      .getCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch((_error) => {
        console.log(_error);
      })
      .finally(() => setLoadingInitial(false));
  }, []);

  function login(email, password) {
    setLoading(true);

    fakesessionsApi
      .login({ email, password })
      .then((user) => {
        setUser(user);
        navigate("/");
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function signUp(email, name, password) {
    setLoading(true);

    fakeusersApi
      .signUp({ email, name, password })
      .then((user) => {
        setUser(user);
        navigate("/");
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function logout() {
    fakesessionsApi.logout().then(() => setUser(undefined));
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      signUp,
      logout,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {children && (loadingInitial ? "Loading..." : children.children)}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
