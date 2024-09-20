import '../styles/globals.css'
import { AppContextProvider } from "../AppContext";
import Navbar from "./Navbar"

function MyApp({ Component, pageProps }) {

    return (
        <AppContextProvider>
            <Navbar />
            <Component {...pageProps} />
        </AppContextProvider>
    )

}

export default MyApp