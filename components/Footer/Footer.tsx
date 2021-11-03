// Styles
import {Container, Box, Typography, Link} from '@mui/material';

const Footer = () : JSX.Element => {
    return (
        <Box
            component="footer"
            sx={{
                marginTop: "auto",
                borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? theme.palette.primary.main : '#EAEEF3'}`,
                padding: "15px 0",
            }}
        >
            <Container>
                <Box
                  sx={{
                    display: "grid",
                    columnGap: "15px",
                    rowGap: "25px",
                    '@media (min-width: 768px)': {
                        gridTemplateColumns: "2fr 1fr",
                    },
                    }}
                >
                    <Box>
                        <Typography variant="h6" gutterBottom component="h3">
                            О нас
                        </Typography>
                        <p>
                            Прогрессивная и одна из лидирующих микрофинансовых организаций в Таджикистане,
                            предоставляющая банковские услуги более 100 тысячам клиентов.
                        </p>
                        <p className="mb-0">
                            734061, г. Душанбе, ул. Н. Карабаева, 148/1.
                        </p>
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom component="h3">
                            Мы в соц. сетях
                        </Typography>
                        <Box mb={2} sx={{display: "flex", columnGap: "5px"}}>
                            <a href="https://ru-ru.facebook.com/mdohumo/" target="_blank" rel="noreferrer">
                                <img src="/icons/facebook.svg" alt="МДО Хумо"/>
                            </a>
                            <a href="https://instagram.com/humo.tj" target="_blank" rel="noreferrer">
                                <img src="/icons/instagram.svg" alt="МДО Хумо"/>
                            </a>
                            <a href="https://t.me/Humomdo" target="_blank" rel="noreferrer">
                                <img src="/icons/telegram.svg" alt="МДО Хумо"/>
                            </a>
                            <a href="https://ru-ru.facebook.com/mdohumo/" target="_blank" rel="noreferrer">
                                <img src="/icons/imo.svg" alt="МДО Хумо"/>
                            </a>
                            <a href="https://ru-ru.facebook.com/mdohumo/" target="_blank" rel="noreferrer">
                                <img src="/icons/whats-app.svg" alt="МДО Хумо"/>
                            </a>
                            <a href="https://ru-ru.facebook.com/mdohumo/" target="_blank" rel="noreferrer">
                                <img src="/icons/viber.svg" alt="МДО Хумо"/>
                            </a>
                        </Box>
                        <Box>
                            <Link href="tel:+992446405544">Тел: (+992) 44 640 55 44</Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;