import {createContext, useState, FC } from "react";
import { v4 as uuidv4 } from 'uuid';


interface ICaptcha {
    show: boolean;
    function?: () => void;
    image?: string;
}

export interface IStoreContext {
    uuid?: string;
    hashKey?: string;
    darkMode?: boolean;
    captcha?: ICaptcha;
    store?: IStoreContext;
    setStore?: (store: IStoreContext) => void
}

const defaultStore = {
    uuid: uuidv4(),
    hashKey: "280229628760108bc4b659a64ca2aa89bc88b332ec9eee2ae88c3025181f59b6",
    darkMode: false,
    captcha: {
        show: false,
    }
};

export const StoreContext = createContext<IStoreContext>(defaultStore);

export const StoreContextProvider: FC = ({children}): JSX.Element => {
    const [store, setStore] = useState<IStoreContext>(defaultStore);

    return <StoreContext.Provider value={{store, setStore}}>
        {children}
    </StoreContext.Provider>;
};