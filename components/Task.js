import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Task = (props) => {
    return (
        <View style={styles.item}>
            <Text style={styles.itemText}>{props.text}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    item:{
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    itemText: {
        maxWidth: '80%'
    }
});

export default Task;