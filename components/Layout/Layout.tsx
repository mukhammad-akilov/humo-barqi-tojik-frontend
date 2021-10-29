import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.scss";
import cn from "classnames";
import { CssBaseline} from "@mui/material";


const Layout = ({children}: LayoutProps): JSX.Element => {
    return (
        <>
            <Header />
            <CssBaseline />
            <div className={cn(styles.layoutContainer)}>
                {children}
            </div>
            <Footer />
        </>
    );
};

export default Layout;