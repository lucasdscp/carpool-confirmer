import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

const Header = ({ text }) => {
  return (
    <Fragment>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {text}
          </Text>
        </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 6,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center'
  },
  headerText: {
    color: '#000',
    fontSize: 22
  }
});

export default Header;
