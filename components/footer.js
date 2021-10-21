import { Div, Text } from "atomize";
const Footer = () => {

    return (
        <Div
            p = "1.25rem"
            bg = "#104a79"
            d = "flex"
            justify = "center"
            textColor = "#FFF"
        >
            <Text>
                Make with ❤️ by {' '} 
                <Div style = {{
                    textDecoration: 'none',
                    color: '#FFF'
                }}  tag = "a" href = "https://github.com/Luan2121" target = "_blank" > 
                    Luan2121
                </Div>
                {', '}
                <Div style = {{
                    textDecoration: 'none',
                    color: '#FFF'
                }}  tag = "a" href = "https://github.com/casikenegro" target = "_blank" > 
                    Jortiz
                </Div>
                {' & '}
                <Div style = {{
                    textDecoration: 'none',
                    color: '#FFF'
                }}  tag = "a" href = "https://github.com/yuss" target = "_blank" > 
                    Yuss
                </Div>
            </Text>
        </Div>
    )

}

export { Footer }