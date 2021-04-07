import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle, StyleSheet, ScrollView, SafeAreaView, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { Theme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../../utils/const';

let createStyles = (selectedTheme: Theme, style?: any): any => {

    return StyleSheet.create({
        container: {
            backgroundColor: selectedTheme.colors.background,
            bottom: 0,
            height: "100%",
            flex: 1,
            padding: 5,
            ...style,
        },
        header: {
            height: 60,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: 'space-between',
        },
        title: {
            fontSize: 30,
            marginLeft: 10,
            color: selectedTheme.colors.text,
        },
        avatar: {
            marginRight: 25,
        },
    });
};

type Props = {
    children: any;
    theme: any;
    noHeader?: boolean;
    showUser?: boolean;
    title?: string;
    style?: StyleProp<ViewStyle>;
    onUserPress?: () => void
};

export default ({ children, noHeader, showUser, title, style, onUserPress }: Props) => {
    const theme = useTheme();

    showUser = showUser === undefined ? true : showUser;

    let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

    const styles = createStyles(selectedTheme, style);

    const [token, setToken] = useState("");

    useEffect(() => {
        AsyncStorage.getItem("token").then((data: any) => {
            setToken(data);
        });
    }, [])

    return (
        <>
            <SafeAreaView
                style={styles.container}>
                {
                    noHeader ? null : (
                        <View style={styles.header}>
                            {title !== undefined ?
                                <Text style={styles.title}>{title}</Text>
                                : null}
                            {showUser ?
                                <Avatar.Image
                                    style={styles.avatar}
                                    source={{
                                        uri: `${apiUrl}/users/avatar`,
                                        headers: {
                                            'Authorization': `Bearer ${token}`
                                        }
                                    }}
                                    size={36}
                                    onTouchEnd={onUserPress}
                                />
                                : null}
                        </View>
                    )
                }

                <ScrollView>
                    {children}
                </ScrollView>
            </SafeAreaView>
        </>
    );
};
