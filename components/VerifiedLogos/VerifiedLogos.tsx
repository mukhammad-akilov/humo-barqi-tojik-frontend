import {Box} from '@mui/material';

const VerifiedLogos = () : JSX.Element => {
    return (
        // <Box sx={
        //     {
        //         display: "grid",
        //         alignItems: "center",
        //         justifyItems: "space-between",
        //         gridTemplateColumns: "repeat(4, 1fr)",
        //         gap: "15px"
        //     }
        // }>
        //     <Box
        //         component="img"
        //         alt="Visa"
        //         src="/images/visa-verified.svg"
        //     />
        //     <Box
        //         component="img"
        //         alt="MasterCard"
        //         src="/images/master-card-verified.svg"
        //     />
        //     <Box
        //         component="img"
        //         alt="Карта Мир"
        //         src="/images/mir-verified.png"
        //     />
        //     <Box
        //         component="img"
        //         sx={{
        //             maxWidth: "80px"
        //         }}
        //         alt="Корти Милли"
        //         src="/images/korti-milli.svg"
        //     />
        // </Box>
        <Box>
            <Box component="img" src="/images/verified-payments.svg" alt="Методы оплаты" />
        </Box>
    );
};

export default VerifiedLogos;