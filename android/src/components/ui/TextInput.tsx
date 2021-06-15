import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, TextInput, KeyboardTypeOptions, Text } from 'react-native';
import { colorList } from '../../styles/colors';

let createStyles = (padding: number, width: number | string, style?: any): any => {

    return StyleSheet.create({
        input: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            borderRadius: 5,
            paddingLeft: 5,
            backgroundColor: colorList.light,
            borderColor: colorList.gray,
            width
        },
        errorMessage: {
            fontSize: 16,
            fontWeight: 'bold',
            color: 'red',
            marginLeft: 20,
        },
        ...style,
    });
};

type Props = {
    value: string;
    onChangeText: any;
    placeholder?: string;
    secure?: boolean;
    keyboardType?: KeyboardTypeOptions;
    style?: StyleProp<ViewStyle>;
    padding?: number;
    width?: number | string;
    autoCorrect?: boolean;
    errorMessage?: string;
};

export default ({ value, onChangeText, secure, placeholder, keyboardType, style, padding, width, autoCorrect, errorMessage }: Props) => {
    padding = padding === undefined ? 10 : padding;

    const styles = createStyles(padding, width, style);

    return (
        <>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                keyboardType={keyboardType}
                secureTextEntry={secure}
                autoCorrect={autoCorrect}
            />
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        </>
    );
};
