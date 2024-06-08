import { useState, useEffect } from 'react';

export const useSidebar = () => {
    const [showingSidebar, setShowingSidebar] = useState(false);

    const openSidebar = () => {
        setShowingSidebar((previousState) => !previousState);
    };

    const closeSidebar = () => {
        setShowingSidebar(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowingSidebar(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return { showingSidebar, openSidebar, closeSidebar };
};
