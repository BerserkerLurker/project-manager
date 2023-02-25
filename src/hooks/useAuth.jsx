import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as authApi from "../api/auth";
const AuthContext = createContext({});

export function AuthProvider(children) {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [token, setToken] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // reset error on page change
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile !== "undefined") {
      setUser(JSON.parse(savedProfile));
    } else {
      navigate("login", { replace: true });
    }
    setLoadingInitial(false);
  }, []);

  function login(email, password) {
    setLoading(true);

    authApi
      .login({ email, password })
      .then((user) => {
        localStorage.setItem("userProfile", JSON.stringify(user));
        setUser(user);
        setToken(globalThis.targetProxy.accessToken);
        navigate("/", { replace: true });
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function signUp(email, name, password) {
    setLoading(true);

    authApi
      .signUp({ email, name, password })
      .then((user) => {
        localStorage.setItem("userProfile", JSON.stringify(user));
        setUser(user);
        setToken(globalThis.targetProxy.accessToken);
        navigate("/", { replace: true });
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function logout() {
    authApi.logout().then(() => {
      setUser(undefined);
      localStorage.removeItem("userProfile");
      globalThis.socket.emit("end");
      setToken("");
      navigate("login", { replace: true });
    });
  }

  function updateUser(params) {
    setLoading(true);

    authApi
      .updateUser(params)
      .then((user) => {
        localStorage.setItem("userProfile", JSON.stringify(user));
        setUser(user);
        setToken(globalThis.targetProxy.accessToken);
        navigate("/profile", { replace: true });
      })
      .catch((error) => setError(error))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
  }

  globalThis.targetProxy = new Proxy(globalThis.accessToken, {
    set: function (target, key, value) {
      if (!target.token) {
        // console.log(`${key.toString()} set to ${value}`);
        target[key] = value;
        setToken(value);
      }
      return true;
    },
    get: function (target, prop, receiver) {
      if (prop === "token") {
        return target.token;
      }
      // @ts-ignore
      return Reflect.get(...arguments);
    },
  });
  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      token,
      login,
      signUp,
      logout,
      updateUser,
    }),
    [user, loading, error, token]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {loadingInitial ? "loading" : toArray(children.children)}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}

function toArray(items) {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  return [items];
}
