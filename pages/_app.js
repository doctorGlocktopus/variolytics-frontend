import '../styles/globals.css';
import { AppContextProvider } from "../AppContext";
import Navbar from "./Navbar";
import { Provider } from 'react-redux';
import store from '../redux/store';
import Notification from '../redux/Notification';

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <AppContextProvider>
                <main className="mainContainer">
                    <Navbar />
                    <Component {...pageProps} />
                    <Notification />
                </main>
            </AppContextProvider>
        </Provider>
    );
}

export default MyApp;
