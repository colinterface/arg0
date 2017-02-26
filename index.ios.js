 // @flow

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';

export default class arg0 extends Component {
  constructor() {
    super();
    this.state = {
      region: {
        latitude: 37.708979,
        longitude: -122.376008,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  onRegionChange = (region) => {
    this.setState({ region });
  }

  getMarkerImage = () => {
    const { longitudeDelta } = this.state.region;
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
    return (
      <View style={styles.root}>
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          showsPointsOfInterest={false}
          followsUserLocation={true}
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
            {'ENTER THE PORTAL'}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 20,
    bottom: 0,
    left: 0,
    right: 0,
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
