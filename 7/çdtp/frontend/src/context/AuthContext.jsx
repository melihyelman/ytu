import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                name,
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const updateContacts = async (newContacts, newDeviceId = null) => {
        if(!user) return;
        try {
             const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            
            const body = { emergencyContacts: newContacts };
            if (newDeviceId) body.deviceId = newDeviceId;

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/contacts`, body, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch(error) {
            console.error("Update failed", error);
        }
    }

    const updateSettings = async (settings) => {
        if(!user) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/settings`, settings, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return true;
        } catch(error) {
            console.error("Settings update failed", error);
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateContacts, updateSettings, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

