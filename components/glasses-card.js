import { Div, Text } from "atomize";
import Image from "next/image";

const GlassesCard = ({ item : glass, onClick }) => {
    
    return (
        <Div rounded = "lg" overflow = "hidden" shadow = "5" onClick = {onClick} >
            <Image 
                alt = {glass.nama}
                src = {glass.path}
                width = {220}
                height = {220}
                objectFit = "cover"
            />
            <Div bg = "#FFF" p = "1rem">
                <Text>
                    {glass.name}
                </Text>
            </Div>
        </Div>
    );
}

export { GlassesCard };