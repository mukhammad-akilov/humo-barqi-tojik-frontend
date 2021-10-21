import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.scss";
import cn from "classnames";
import { CssBaseline, createTheme, ThemeProvider} from "@mui/material";
import { ruRU } from '@mui/material/locale';
import { StoreContextProvider } from "../../store/StoreContext";

const customTheme = createTheme({
    palette: {
        // mode: "dark",
        // primary: {
        //     main: "#FF6600",
        //     contrastText: '#FFFFFF',
        // },
    
        // secondary: {
        //     main: "#00617F",
        //     contrastText: '#FFFFFF',
        // },
      },
    
      typography: {
        fontSize: 16,
        body1: {
          fontSize: "1rem",
        }
      },
}, ruRU);

const Layout = ({children}: LayoutProps): JSX.Element => {
    return (
        <StoreContextProvider>
            <ThemeProvider theme={customTheme}>
                <Header />
                <CssBaseline />
                <div className={cn(styles.layoutContainer)}>
                    {children}
                </div>
                <Footer />
            </ThemeProvider>
        </StoreContextProvider>
    );
};

export default Layout;