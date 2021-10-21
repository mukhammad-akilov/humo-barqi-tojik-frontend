import { useContext } from 'react';
import { StoreContext } from '../../store/StoreContext';
// Styles
import styles from './Header.module.scss';
import {Button, Container} from '@mui/material';

const Header = () : JSX.Element => {
    const { store, setStore} = useContext(StoreContext);
    console.log(store);


    return (
        <header className={styles.header}>
            <Container>
                header {store?.uuid}
                <div>{store?.hashKey}</div>
                <button onClick={() => setStore && setStore({...store, uuid: "Ghost"})}>Test button</button>
            </Container>
        </header>
    );
};

export default Header;