import { createContext, useState, useEffect } from "react";
import api from "../services/api"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {

            const response = await api.get("/users/profile");

            setUser(response.data);

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    // useEffect(() => {
    //     console.log("The user is", user);
    // }, [user])

    const login = async (credentials) => {

        const response = await api.post("/auth/login", credentials);

        await checkAuth();
        
        return response.data;
    }

    const signup = async (userData) => {

        const response = await api.post("/auth/signup", userData);

        await checkAuth();

        return response.data;
    }

    const logout = async () => {

    await api.post("/auth/logout");

    setUser(null);
}

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                checkAuth
            }}>

            {children}

        </ AuthContext.Provider>
    )
}

export default AuthContext;