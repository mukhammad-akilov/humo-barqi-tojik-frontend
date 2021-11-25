// Styles
import {Container, Box, Typography, useTheme} from '@mui/material';

const Footer = () : JSX.Element => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                marginTop: "auto",
                borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#EAEEF3'}`,
                padding: "15px 0",
            }}
        >
            <Container>
                <Box
                  sx={{
                    display: "grid",
                    columnGap: "15px",
                    alignItems: "center",
                    rowGap: "25px",
                    '@media (min-width: 768px)': {
                        gridTemplateColumns: "2fr 1fr",
                    },
                    }}
                >
                    <Box>
                        <Typography variant="h6" gutterBottom component="h3">
                            О сервисе
                        </Typography>
                        <p>
                            Оплачивайте за электричество Барки Точик с помощью таких банковских карт как Корти Милли, Visa, MasterCard и Мир быстро и безопасно.
                        </p>
                        <p className="mb-0">
                            Оплата Барки Точик {new Date().getFullYear()}. Все права защищены.
                        </p>
                    </Box>
                    <Box>
                        <Box>
                            <Box 
                                component="img" 
                                src={`/images/${theme.palette.mode === 'dark' ? "bark-white-logo.svg" : "bark-logo.svg"}`} 
                                alt="Оплата Барки Точик" 
                                sx={{
                                    width: "180px",
                                    margin: "auto",
                                    '@media (min-width: 768px)': {
                                        marginLeft: "auto"
                                    },
                                }}    
                        />
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;