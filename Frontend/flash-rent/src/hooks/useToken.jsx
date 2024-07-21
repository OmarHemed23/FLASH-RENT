import { useState } from "react";

export const useToken = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const saveToken = (userToken) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    };

    const clearToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return {
        token,
        saveToken,
        clearToken
    };
};
