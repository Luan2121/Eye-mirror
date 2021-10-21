
const glasses = [
    {  
        id: 1,
        name: 'Lentes simples',
        path: '/glasses.jpg',
        modelPath: '/models/simple-glasses/scene.gltf',
        config: {
            rotationX:  1 / 6 * Math.PI,
            x: 255,
            z: 100,
            scaleX: 10,
            scaleY: 10,
            scaleZ: 10
        }
    },
    {  
        id: 2,
        name: 'Lentes Dolce & Gabanna',
        path: '/dolce-gabbana-glasses.jpg',
        modelPath: '/models/dolce-gabanna-glasses/scene.gltf',
        config: {
            rotationX:  1 / 6 * Math.PI,
            x: 230,
            z: 100,
            scaleX: 100,
            scaleY: 100,
            scaleZ: 100
        }
    },
    {  
        id: 3,
        name: "Lentes Taylor's version",
        path: '/taylor-glasses.jpg',
        modelPath: '/models/heart-glasses-2/scene.gltf',
        config: {
            rotationX:  1 / 6 * Math.PI,
            x: 250,
            z: 100,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1
        }
    }
]

export { glasses };