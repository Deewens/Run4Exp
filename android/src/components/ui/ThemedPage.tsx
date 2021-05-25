import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle, StyleSheet, ScrollView, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { Theme } from '@react-navigation/native';
import { Avatar } from '../ui'
import { ActivityIndicator } from 'react-native-paper';
import { Icon } from 'react-native-elements'

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
        headerReturn: {
            padding: 5,
            color: selectedTheme.colors.text
        },
        title: {
            fontSize: 30,
            marginLeft: 10,
            color: selectedTheme.colors.text,
        },
        avatar: {
            marginRight: 25,
        },
        loader: {
            height: '100%',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center'
        },
        loaderItem: {
            paddingBottom: 70
        },
        loaderText: {
            fontSize: 15,
            color: selectedTheme.colors.primary,
            marginBottom: 5
        }
    });
};

type Props = {
    children: any;
    theme: any;
    noHeader?: boolean;
    showUser?: boolean;
    title?: string;
    style?: StyleProp<ViewStyle>;
    onUserPress?: () => void;
    loader?: boolean;
    showReturn?: boolean;
    onReturnPress?: () => void;
    noNetwork?: boolean;
};

export default ({ children, noHeader, showUser, title, style, onUserPress, loader, showReturn, onReturnPress, noNetwork }: Props) => {
    const theme = useTheme();

    showUser = showUser === undefined ? true : showUser;
    loader = loader === undefined ? false : loader;
    showReturn = showReturn === undefined ? false : showReturn;
    noNetwork = noNetwork === undefined ? false : noNetwork;

    let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

    const styles = createStyles(selectedTheme, style);

    let getHeader = () => {
        return (
            noHeader ? null : (
                <View style={styles.header}>
                    <View>
                        {
                            showReturn ?
                                (<TouchableOpacity style={styles.headerReturn}>
                                    <Icon name="arrow-back-ios" size={20} color={styles.headerReturn.color} />
                                </TouchableOpacity>)
                                : null
                        }
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    {showUser ?
                        <Avatar
                            style={styles.avatar}
                            size={36}
                            onPress={onUserPress}
                        />
                        : null}
                </View>
            )
        );
    }

    let getSuccessPage = () => {
        return (<ScrollView>
            {children}
        </ScrollView>)
    }

    let getLoaderPage = () => {
        return (<View style={styles.loader}>
            <View style={styles.loaderItem}>
                <Text style={styles.loaderText}>
                    Chargment
        </Text>
                <ActivityIndicator color={selectedTheme.colors.primary} />
            </View>
        </View>)
    }

    let getNetworkErrorPage = () => {
        return (<View>
            <Text>Acun réseaux trouvé</Text>
        </View>)
    }

    return (
        <>
            <SafeAreaView
                style={styles.container}>
                {getHeader()}
                {
                    loader ?
                        (getLoaderPage()) :
                        noNetwork ?
                            (getNetworkErrorPage()) :
                            (getSuccessPage())
                }
            </SafeAreaView>
        </>
    );
};
