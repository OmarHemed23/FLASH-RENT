import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens')
            ? JSON.parse(localStorage.getItem('authTokens'))
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem('authTokens')
            ? { username: localStorage.getItem('username') }
            : null
    );

    const navigate = useNavigate();

    const loginUser = async (username, password, rememberMe) => {
        try {
            const response = await axios.post('http://localhost:8000/api-token-auth/', { username, password });
            if (response.status === 200) {
                setAuthTokens(response.data);
                setUser({ username });
                localStorage.setItem('authTokens', JSON.stringify(response.data));
                localStorage.setItem('username', username);

                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }

                if (response.data.first_time_login) {
                    navigate('/auth/change-password');
                } else {
                    navigate('/tenant/dashboard');
                }
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('username');
        navigate('/auth/login');
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
