import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, [token]);

    const login = async (email: string, password: string) => {
        const result = await apiService.login(email, password);
        apiService.setToken(result.token);
        setToken(result.token);
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
    };

    const register = async (name: string, email: string, password: string) => {
        const result = await apiService.register(name, email, password);
        apiService.setToken(result.token);
        setToken(result.token);
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
    };

    const logout = () => {
        apiService.clearToken();
        setToken(null);
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
