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

import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Geolocation from '@react-native-community/geolocation';

import Header from './Header';
import Menu from './Menu';

import api from '../../utils/api';

const { width } = Dimensions.get('window');

class Home extends Component {
  state = {
    menuOptions: ['Motorista', 'Caroneiro'],
    driverId: 1, // Adding hardcoded user ID to simulate logged user :)
    isDriverSharedLocation: false,
    isDriverSharedLocationMsg: '',
    datetime: Date.now(),
    isLoading: false
  };

  componentDidMount() {
    Geolocation.requestAuthorization();
  }

  onMenuChanged = (index) => {
    this.homeSlide.scrollTo({ x: width * index });
  }

  shareDriverLocation = () => {
    Geolocation.getCurrentPosition(async info => {
      if (info && info.coords) {
        const { latitude, longitude } = info.coords;
        const { driverId, datetime } = this.state;

        const options = {
          method: 'POST',
          headers: { 
            "Accept": "*/*",
            "content-type": "application/json; charset=UTF-8"
          },
          data: JSON.stringify({
            lat: latitude,
            lon: longitude,
            driverId,
            datetime,
            type: 'driver'
          }),
          url: '/share-ride-location'
        };

        this.setState({
          isLoading: true,
          isDriverSharedLocationMsg: 'Carregando...'
        });

        api(options).then(data => {
          this.setState({
            isDriverSharedLocation: true,
            isDriverSharedLocationMsg: 'Localização compartilhada com sucesso'
          });
        })
        .catch(err => {
          this.setState({
            isDriverSharedLocation: true,
            isDriverSharedLocationMsg: 'Ocorreu um problema ao compartilhar a localização'
          });
        });
      }
    });
  }

  renderDriverSlide = () => {
    const { driverId, datetime, isDriverSharedLocation, isDriverSharedLocationMsg, isLoading } = this.state;
    const qrCodeInfo = JSON.stringify({
      driverId,
      datetime
    });

    return (
      <View style={styles.sliderContent}>
        <View style={styles.qrCodeContent}>
          <QRCode
          value={qrCodeInfo}
          size={150}
          />
          <Text style={styles.qrCodeLabel}>Utilize este QR Code para validar a carona.</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={this.shareDriverLocation} style={[styles.button, { width: 190, alignItems: 'center' }]}>
            <Text>
              Compartilhar localização
            </Text>
          </TouchableOpacity>
          {(isDriverSharedLocation || isLoading) && <Text style={styles.driverMsg}>
            {isDriverSharedLocationMsg}
          </Text>}
        </View>
      </View>
    );
  }

  renderBottomContent = () => {
    return (
      <TouchableOpacity style={styles.button}>
        <Text>
          Compartilhar localização
        </Text>
      </TouchableOpacity>
    );
  }

  readQrCode = (response) => {
    const rideInfo = JSON.parse(response.data);
    console.log(rideInfo, navigator.geolocation);
  }

  renderPassengerSlide = () => {
    return (
      <View style={styles.sliderContent}>
        <View style={{ flex: 1, top: -(width / 4) }}>
          <QRCodeScanner
            onRead={this.readQrCode}
            bottomContent={this.renderBottomContent()}
          />
        </View>
      </View>
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
    backgroundColor: '#FFF',
    paddingTop: 10
  },
  menu: {
    marginTop: 10,
    marginBottom: 10
  },
  slide: {
    flex: 1, 
    width
  },
  sliderContent: {
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
    borderRadius: 5
  },
  driverMsg: {
    fontSize: 14,
    marginTop: 10
  }
});

export default Home;
