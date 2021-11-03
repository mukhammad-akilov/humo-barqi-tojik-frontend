import {createContext, useState, FC, useMemo, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
import {createTheme, PaletteMode, ThemeProvider} from "@mui/material";
import { ruRU } from '@mui/material/locale';
import useMediaQuery from '@mui/material/useMediaQuery';


interface ICaptcha {
    show: boolean;
    function?: () => void;
    image?: string;
}

export interface IStoreContext {
    uuid?: string;
    hashKey?: string;
    themeMode?: PaletteMode;
    captcha?: ICaptcha;
    store?: IStoreContext;
    setStore?: (store: IStoreContext) => void
}

const defaultStore: IStoreContext = {
    uuid: uuidv4(),
    hashKey: "280229628760108bc4b659a64ca2aa89bc88b332ec9eee2ae88c3025181f59b6",
    themeMode: "light",
    captcha: {
        show: false,
    }
};

export const StoreContext = createContext<IStoreContext>(defaultStore);

export const StoreContextProvider: FC = ({children}): JSX.Element => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    defaultStore.themeMode = prefersDarkMode ? "dark" : "light";

    const [store, setStore] = useState<IStoreContext>(defaultStore);

    const customTheme = useMemo(
        () =>
        createTheme({
            palette: {
                mode: store.themeMode,
                //     main: "#FF6600",
                //     contrastText: '#FFFFFF',
                // },
            
                // secondary: {
                //     main: "#00617F",
                //     contrastText: '#FFFFFF',
                // },
              },
        }, ruRU),[store.themeMode],
      );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const themeMode: PaletteMode | null = localStorage.getItem("theme-mode") as PaletteMode;
            if ((themeMode !== null) && (themeMode === "light" || themeMode === "dark")) {
                setStore({...store, themeMode: themeMode});
            }
        }
    }, []);

    useEffect(() => {
        if(store.themeMode) {
            localStorage.setItem("theme-mode", store.themeMode);
        }
    }, [store.themeMode]);

    return <StoreContext.Provider value={{store, setStore}}>
        <ThemeProvider theme={customTheme}>
            {children}
        </ThemeProvider>
    </StoreContext.Provider>;
};