import { useEffect } from 'react';
import httpsService from '../../utils/httpService/httpService';
// Styles
import styles from './Home.module.scss';
import {Button, Container} from '@mui/material';

const Home = () : JSX.Element => {
    useEffect(() => {
        console.log("Test")
    }, []);

    return (
       <section>
           <Container>
                Home page
           </Container>
       </section>
    );
};

export default Home;