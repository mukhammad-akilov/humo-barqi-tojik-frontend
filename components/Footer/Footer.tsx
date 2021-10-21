// Styles
import styles from './Footer.module.scss';
import Container from '@mui/material/Container';

const Footer = () : JSX.Element => {
    return (
        <footer className={styles.footer}>
            <Container>
                Footer info
            </Container>
        </footer>
    );
};

export default Footer;