import { createContext, useEffect, useState } from "react";

const AppContext = createContext([])

export const AppContextProvider = ({ children, defaultUser }) => {

    const [currentUser, setCurrentUser] = useState(defaultUser)
    const [language, setLanguage] = useState('de'); 

    useEffect(() => {
        try {
            const userString = localStorage.getItem("user")
            setCurrentUser(JSON.parse(userString) || defaultUser)
        } catch (err) {
            setCurrentUser(null)
        }
    }, [])

    return (
        <AppContext.Provider value={{ currentUser, setCurrentUser, language, setLanguage }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext