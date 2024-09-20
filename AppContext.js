import { createContext, useEffect, useState } from "react";

const AppContext = createContext([])

export const AppContextProvider = ({ children, defaultUser }) => {

    const [currentUser, setCurrentUser] = useState(defaultUser)

    useEffect(() => {
        try {
            const userString = localStorage.getItem("user")
            setCurrentUser(JSON.parse(userString) || defaultUser)
        } catch (err) {
            setCurrentUser(null)
        }
    }, [])

    return (
        <AppContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext