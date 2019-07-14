import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import QRCodeScanner from 'react-native-qrcode-scanner';

import Header from './Header';
import Menu from './Menu';

const { width } = Dimensions.get('window');

class Home extends Component {
  state = {
    menuOptions: ['Motorista', 'Caroneiro'],
    driverId: 1 // Adding hardcoded user ID to simulate logged user :)
  };

  onMenuChanged = (index) => {
    this.homeSlide.scrollTo({ x: width * index });
  }

  renderDriverSlide = () => {
    const { driverId } = this.state;
    const qrCodeInfo = JSON.stringify({
      driverId,
      datetime: Date.now()
    });

    return (
      <View style={styles.driverSlide}>
        <View style={styles.qrCodeContent}>
          <QRCode
          value={qrCodeInfo}
          size={150}
          />
          <Text style={styles.qrCodeLabel}>Utilize este QR Code para validar a carona.</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>
            Compartilhar localização
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderPassengerSlide = () => {
    return (
      <QRCodeScanner
        onRead={() => {
          alert('leu')
        }}
      />
    );
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
            <View style={[styles.slide]}>
              {this.renderDriverSlide()}
            </View>
            <View style={styles.slide}>
              {this.renderPassengerSlide()}
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
    width
  },
  driverSlide: {
    justifyContent: 'space-around',
    alignItems: 'center', 
    flex: 1
  },
  qrCodeLabel: {
    marginTop: 15
  },
  qrCodeContent: {
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#DDD',
    padding: 10,
    fontSize: 14,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowRadius: 2,
    shadowOpacity: 0.3
  }
});

export default Home;
