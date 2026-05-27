import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedInUser = () => {
            try {
                const storedUser= localStorage.getItem("user");

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedInUser();
    }, []);

    const login = async (email, password) => {
        const loginResponse = await api.post("/auth/login", {
            email: email,
            password: password
        });

        if (!loginResponse) {
            throw new Error("Login Failed");
        }

        const data = await response.json();

        localStorage.setItem('user', JSON.stringify(data.data.user));
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");

            setUser(null);
            localStorage.removeItem("user");
        } catch (error) {
            console.error(error);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used with an AuthProvider");
    }
    return context;
}
