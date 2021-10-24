import { useEffect, useContext } from 'react';
import { StoreContext } from '../../store/StoreContext';
import httpsService, {IApiConfig} from '../../utils/httpService/httpService';
// Styles
import styles from './Home.module.scss';
import {Button, Container} from '@mui/material';

const Home = () : JSX.Element => {
    const { store, setStore} = useContext(StoreContext);

    const getData = async () => {
        const apiConfig: IApiConfig = {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
            uuid: store?.uuid!,
            title: "rates",
            hashKey: store?.hashKey!,
            url: "cards/rates_and_fee/korti_milli",
            func: () => console.log("Test"),
        };

        const answer = await httpsService<string>(apiConfig);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
       <section>
           <Container>
                <button onClick={getData}>Button</button>
           </Container>
       </section>
    );
};

export default Home;