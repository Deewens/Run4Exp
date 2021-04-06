import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Spacer } from './ui';

const NavLink = ({ text, routeName }) => {
    const { navigate } = useNavigation();

    return (
        <Spacer>
            <TouchableOpacity onPress={() => navigate(routeName)}>
                <Text style={styles.link}>{text}</Text>
            </TouchableOpacity>
        </Spacer>
    );
};

const styles = StyleSheet.create({
    link: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 20,
        textAlign: 'center',
    }
});

export default NavLink;