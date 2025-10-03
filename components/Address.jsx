import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import styles from "../styles";

export default function Address() {
    console.log("Component rendering");
    const [address, setAddress] = useState({});
    const [loading, setLoading] = useState(false);
    const [cep, setCep] = useState("");
    const inputRef = useRef(null);

    // Estrutura de aplicação de foco
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (cep.length == 8) {
            setLoading(true)
            async function load() {
                debugger
                try {
                    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await res.json();

                    if (data.erro) {
                        setAddress({});
                        Alert.alert("CEP not found.");
                        alert("CEP not found.");
                        setCep("");
                        setTimeout(() => {
                            if (inputRef.current) inputRef.current.focus();
                        }, 100);
                    } else {
                        setAddress(data);
                    }
                } catch (error) {
                    console.error(error);
                    setAddress({});
                    Alert.alert("Service not available.");
                    alert("Service not available.");
                    setCep("");
                    setTimeout(() => {
                        if (inputRef.current) inputRef.current.focus();
                    }, 100);
                } finally {
                    setLoading(false);
                }
            }
            load();
        } else {
            setAddress({});
        }
    }, [cep])

    async function getAddress() {
        if (cep.length !== 8) {
            Alert.alert("Enter a valid CEP with 8 digits.");
            alert("Enter a valid CEP with 8 digits.");
            setCep("");
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();

            if (data.erro) {
                setAddress({});
                Alert.alert("CEP not found.");
                alert("CEP not found.");
                setCep("");
                setTimeout(() => {
                    if (inputRef.current) inputRef.current.focus();
                }, 100);
            } else {
                setAddress(data);
            }
        } catch (error) {
            console.error(error);
            setAddress({});
            Alert.alert("Service not available.");
            alert("Service not available.");
            setCep("");
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <ActivityIndicator size="large" />;

    // Máscara
    function formatCep(text) {
        const cleaned = text.replace(/\D/g, "");

        if (cleaned.length <= 5) return cleaned;
        return cleaned.slice(0, 5) + "-" + cleaned.slice(5, 8);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CEP Query</Text>
            <View style={styles.inputRow}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="_____-___"
                    placeholderTextColor="#b0b0b0"
                    value={formatCep(cep)}
                    onChangeText={text => setCep(text.replace(/\D/g, "").slice(0, 8))}
                    keyboardType="numeric"
                    maxLength={9}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={getAddress}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#2196F3" />}

            {Object.keys(address).length > 0 && (
                <View style={styles.resultContainer}>
                    {address.logradouro && (
                        <Text style={styles.resultText}>Logradouro: {address.logradouro}</Text>
                    )}
                    {address.complemento && (
                        <Text style={styles.resultText}>Complemento: {address.complemento}</Text>
                    )}
                    {address.unidade && (
                        <Text style={styles.resultText}>Unidade: {address.unidade}</Text>
                    )}
                    {address.bairro && (
                        <Text style={styles.resultText}>Bairro: {address.bairro}</Text>
                    )}
                    {address.localidade && (
                        <Text style={styles.resultText}>Localidade: {address.localidade}</Text>
                    )}
                    {address.uf && (
                        <Text style={styles.resultText}>UF: {address.uf}</Text>
                    )}
                    {address.estado && (
                        <Text style={styles.resultText}>Estado: {address.estado}</Text>
                    )}
                    {address.regiao && (
                        <Text style={styles.resultText}>Região: {address.regiao}</Text>
                    )}
                </View>
            )}

        </View>
    )
}