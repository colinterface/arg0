 // @flow

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';
import MapView from 'react-native-maps';

export default class arg0 extends Component {
  constructor() {
    super();
    this.state = {
      mapRegion: {
        latitude: 37.708979,
        longitude: -122.376008,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      userLocation: null,
    };
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(({ coords }) =>{
        console.log(coords);
        this.setState({ userLocation: coords });
      });
    }, 1000);

  }

  onRegionChange = (mapRegion) => {
    this.setState({ mapRegion });
  }

  getMarkerImage = () => {
    const { longitudeDelta } = this.state.mapRegion;
    let imageIndex;

    if (longitudeDelta < 0.01) {
      imageIndex = 2;
    } else if (longitudeDelta < 0.02) {
      imageIndex = 1;
    } else {
      imageIndex = 0;
    }

    return { uri: `portal${imageIndex}` };

  }

  render() {
    const { userLocation } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.header} />
        <MapView
          style={styles.map}
          region={this.state.mapRegion}
          onRegionChange={this.onRegionChange}
          showsPointsOfInterest={false}
          showsUserLocation={true}
          followsUserLocation={false}
          mapType={'hybrid'}
        >
          <MapView.Marker
            coordinate={{
              latitude: 37.708979,
              longitude: -122.376008,
            }}
            image={this.getMarkerImage()}
            flat={true}
            rotation={this.state.markerRotation}
          />
        </MapView>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {
              userLocation
              ? `${userLocation.latitude}, ${userLocation.longitude}`
              : ''
            }
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flex: 0,
    height: 20,
    backgroundColor: '#222',
  },
  map: {
    flex: 1,
  },
  footer: {
    flex: 0,
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 10,
  },
  footerText: {
    fontSize: 40,
    color: '#ddd'
  },
});

AppRegistry.registerComponent('arg0', () => arg0);
