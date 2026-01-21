import { useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Button } from "react-native";



const Final = () => {
    const [Product, setProduct] = useState([
        {
            id: "1",
            name: "Apple iPhone 14",
            price: "799",
            description: "Smartphone by Apple",
        },
        {
            id: "2",
            name: "Samsung Galaxy S23",
            price: "699",
            description: "Flagship phone by Samsung",
        },
        {
            id: "3",
            name: "Sony WH-1000XM5",
            price: "399",
            description: "Noise-canceling headphones",
        },
    ])
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const addProductHandler = () => {

        const newProduct = {
            name: name,
            price: price,
            description: description,
        };
        setProduct((currentProduct) => [
            ...currentProduct,
            newProduct,
        ]);

        setName("");
        setPrice("");
        setDescription("");


    };
    return (
        <View style={s.flex}>
            <FlatList
                data={Product}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text style={s.name}>{item.name}</Text>
                        <Text style={s.price}>${item.price}</Text>
                        <Text style={s.description}>{item.description}</Text>
                    </View>
                )}
            />


            <View>
                <TextInput placeholder="Enter the new item name:" value={name} onChangeText={setName}></TextInput>
                <TextInput placeholder="Enter the new item price:" value={price} onChangeText={setPrice}></TextInput>
                <TextInput placeholder="Enter the new item description" value={description} onChangeText={setDescription}></TextInput>

                <Button disabled={!name || !price} title="Add Product" onPress={addProductHandler} />


            </View>


        </View>
    );
}



const s = StyleSheet.create({
    flex: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    name: {
        fontSize: 18,
        fontWeight: "bold",
    },
    price: {
        fontSize: 16,
        color: "green",
        marginVertical: 4,
    },
    description: {
        fontSize: 14,
        color: "#666",
    },
}
)
export default Final;