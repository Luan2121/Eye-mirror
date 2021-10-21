import { Fragment } from "react"
import { Navbar } from "./navbar"
import { Div } from "atomize";
import { Footer } from "./footer";

const MainLayout = ({ children }) => {
    return (
        <Fragment>
            <Navbar />
            <Div $as = "main" h = "calc(100% - 130px)">
                {children}
            </Div>
            <Footer />
        </Fragment>

    )
}

export { MainLayout };