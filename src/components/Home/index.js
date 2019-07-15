import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native';

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import QRCode from 'react-native-qrcode-svg';
import QRCodeScanner from 'react-native-qrcode-scanner';

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
    isPassengerSharedLocation: false,
    isPassengerSharedLocationMsg: '',
    datetime: Date.now(),
    isLoading: false
  };

  componentDidMount() {
    if (Platform.OS === 'ios') {
      navigator.geolocation.requestAuthorization();
    }
  }

  onMenuChanged = (index) => {
    this.homeSlide.scrollTo({ x: width * index });
  }

  shareDriverLocation = () => {
    navigator.geolocation.getCurrentPosition(info => {
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
            isLoading: false,
            isDriverSharedLocationMsg: 'Localização compartilhada com sucesso'
          });
        })
        .catch(err => {
          this.setState({
            isDriverSharedLocation: true,
            isLoading: false,
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

  validatePassenger = () => {
    const { rideInfo } = this.state;
    const { latitude, longitude, driverId, datetime } = rideInfo;
    
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
        type: 'passenger'
      }),
      url: '/share-ride-location',
      isValidStatus: () => {
        return true;
      }
    };

    this.setState({
      isLoading: true,
      isPassengerSharedLocationMsg: 'Carregando...'
    });

    api(options).then(res => {
      if (res && res.data) {
        const { distance, isConfirmed } = res.data;
        
        let message = `Carona não confirmada\nDistância do motorista: ${distance}m`
        if (isConfirmed) {
          message = `Carona confirmada\nDistância do motorista: ${distance}m`
        }

        this.setState({
          isPassengerSharedLocation: true,
          isLoading: false,
          isPassengerSharedLocationMsg: message
        });
      }
    })
    .catch(err => {
      this.setState({
        isDriverSharedLocation: true,
        isLoading: false,
        isPassengerSharedLocationMsg: 'Ocorreu um problema ao compartilhar a localização'
      });
    });
  }

  renderPassengerLocation = () => {
    const { isPassengerSharedLocation, isPassengerSharedLocationMsg, isLoading, rideInfo } = this.state;
    return (
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <MapView
          style={{
            height: width / 2,
            width: width,
            marginBottom: 16
          }}
          initialRegion={{
            latitude: rideInfo.latitude,
            longitude: rideInfo.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            coordinate={{ latitude: rideInfo.latitude, longitude: rideInfo.longitude }}
          />
        </MapView>
        <TouchableOpacity onPress={this.validatePassenger} style={[styles.button, { width: 190, alignItems: 'center' }]}>
          <Text>
            Compartilhar localização
          </Text>
        </TouchableOpacity>
        {(isPassengerSharedLocation || isLoading) && <Text style={[styles.driverMsg, { textAlign: 'center' }]}>
            {isPassengerSharedLocationMsg}
        </Text>}
      </View>
    );
  }

  readQrCode = (response) => {
    const rideInfo = JSON.parse(response.data);
    
    navigator.geolocation.getCurrentPosition(info => {
      if (info && info.coords) {
        const { latitude, longitude } = info.coords;
        rideInfo.latitude = latitude;
        rideInfo.longitude = longitude;
        
        this.setState({ rideInfo });
      }
    });
  }

  renderPassengerSlide = () => {
    const { rideInfo } = this.state;

    return (
      <View style={styles.sliderContent}>
        <View style={{ flex: 1, top: (rideInfo ? 0 : -(width / 4)) }}>
          {rideInfo ? this.renderPassengerLocation() : <QRCodeScanner
            onRead={this.readQrCode}
          />}
        </View>
      </View>
    );
  }

  render() {
    const { menuOptions, isLoading } = this.state;

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.body}>
          <Header text={isLoading ? "Validando geolocalização" : "Validar carona"} />
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
