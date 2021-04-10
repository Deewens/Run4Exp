import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle, StyleSheet, ScrollView, SafeAreaView, Text, View } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { Theme } from '@react-navigation/native';
import { Avatar } from '../ui'

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
                                <Avatar
                                    style={styles.avatar}
                                    size={36}
                                    onPress={onUserPress}
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
