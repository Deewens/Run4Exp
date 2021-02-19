import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Spacer from'./Spacer';
import { withNavigation } from 'react-navigation';

const NavLink = ({navigation, text, routeName}) =>{
    return(
        <Spacer>
            <TouchableOpacity onPress={() => navigation.navigate(routeName)}>
                <Text style={styles.link}>{text}</Text>
            </TouchableOpacity>
        </Spacer>
    );
};

const styles = StyleSheet.create({
    link:{
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 20,
        textAlign: 'center',
    }
});

export default withNavigation(NavLink);