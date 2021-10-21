import { Div, Text } from "atomize";
import Image from "next/image";

const Navbar = () => {
    return (
        <Div
            w = "100%"
            h = "130px"
            p = "1.25rem"
        >
            <Div d = "flex" align  = "center">
                <Logo />
                <Text m = {{
                    b: '16px'
                }} tag = "h1" textSize = "display1" textColor = "info600">
                    EYE MIRROR | BETA
                </Text>
            </Div>
        </Div>
    );
}

const Logo = () => {
    return (
        <Div>
            <Image 
                width = {130}
                height = "100%"
                alt = "eye-mirror-logo"
                src = "/eye mirror.png"
                objectFit = "contain"
            />
        </Div>
    );
}

export { Navbar };