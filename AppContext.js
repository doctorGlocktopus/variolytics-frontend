import { createContext, useEffect, useState } from "react";

const AppContext = createContext([]);

export const AppContextProvider = ({ children, defaultUser }) => {
    const [currentUser, setCurrentUser] = useState(defaultUser);
    const [language, setLanguage] = useState('de'); 

    useEffect(() => {
        try {
            const userString = localStorage.getItem("user");
            setCurrentUser(JSON.parse(userString) || defaultUser);

            const storedLanguage = localStorage.getItem("language");
            setLanguage(storedLanguage || 'de');
        } catch (err) {
            setCurrentUser(null);
            setLanguage('de');
        }
    }, [defaultUser]);

    return (
        <AppContext.Provider value={{ currentUser, setCurrentUser, language, setLanguage }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;
