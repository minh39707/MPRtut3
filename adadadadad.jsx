import { useState } from "react";
import { View, Text, FlatList, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, } from "react-native";

const abcabc = () => {
    const [products, setProducts] = useState([
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
    ]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const addProduct = () => {
        const newProduct = {
            name,
            price,
            description
        };
        setProducts(products.concat(newProduct))
        setName("");
        setPrice("");
        setDescription("");
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1,backgroundColor:"red" }}
            behavior={Platform.OS === "ios"|"android" ? "padding" : "height"}
        >
            <View style={styles.container}>

                <Text style={styles.title}>Product Management App</Text>
                <FlatList
                    data={products}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productPrice}>${item.price}</Text>
                            <Text style={styles.productDescription}>{item.description}</Text>
                        </View>
                    )}
                />

                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Product name" value={name} onChangeText={setName}
                    />
                    <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric"
                    />
                    <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} 
                    />

                    <View>
                        <Button  disabled={!(name&&price)} title="Add Product" onPress={addProduct} />
                    </View>
                </View>
            </View>
       </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },

    productName: {
        fontSize: 16,
        fontWeight: "bold",
    },

    productPrice: {
        fontSize: 14,
        color: "#555",
    },
    productDescription: {
        fontSize: 13,
        color: "#777",
        marginTop: 6,
        lineHeight: 18,
    },
    form: {
        marginTop: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
});

export default abcabc;
