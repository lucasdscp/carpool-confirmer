import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

class Menu extends Component {
    renderOptions() {
        const { options, onChanged } = this.props;
        return options.map((option, index) => {
            const otherOptions = index !== 0 ? { marginLeft: 10 } : {};
            return (
                <View key={index} style={styles.button}>
                   <TouchableOpacity onPress={() => onChanged(index)} style={[styles.touchable, otherOptions]}>
                        <Text style={styles.text}>
                            {option}
                        </Text>
                    </TouchableOpacity>    
                </View>
            );
        })
    }

    render() {
        const { style } = this.props;
        return (
          <Fragment>
              <View style={[styles.content, style]}>
                  {this.renderOptions()}
              </View>
          </Fragment>
        );
    }
};

const styles = StyleSheet.create({
    content: {
        left: 0,
        right: 0,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16,
        marginRight: 16
    },
    button: {
        flex: 1
    },
    touchable: { 
        flex: 1,
        backgroundColor: '#DDD',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 1,
            height: 3
        },
        shadowRadius: 2,
        shadowOpacity: 0.3
    },
    text: {
        fontSize: 14
    }
});

export default  Menu;
