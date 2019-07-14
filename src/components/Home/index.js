import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Dimensions
} from 'react-native';

import Header from './Header';
import Menu from './Menu';

const { width } = Dimensions.get('window');

class Home extends Component {
  state = {
    menuOptions: ['Motorista', 'Caroneiro']
  };

  onMenuChanged = (index) => {
    this.homeSlide.scrollTo({ x: width * index });
  }

  render() {
    const { menuOptions } = this.state;

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.body}>
          <Header text="Validar Carona" />
          <Menu options={menuOptions} style={styles.menu} onChanged={this.onMenuChanged} />
          <ScrollView 
            ref={s => this.homeSlide = s} 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.slide}>
              
            </View>
            <View style={styles.slide}>
              
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  menu: {
    marginTop: 10,
    marginBottom: 10
  },
  slide: {
    flex: 1, 
    width,
    padding: 16
  }
});

export default Home;
