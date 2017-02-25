/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    }
  }

  onRegionChange = (region) => {
    this.setState({ region });
  }

  render() {

    const markerImage = this.state.region.longitudeDelta > 0.02
      ? { uri: 'portal' }
      : { uri: 'portalBig' };
    return (
      <View
        style={styles.root}
      >
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          showsPointsOfInterest={false}
          followsUserLocation={true}
          mapType={'standard'}
        >
          <MapView.Marker
            coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
            }}
            image={markerImage}
            flat={true}
            rotation={0}
          />
        </MapView>
        <View style={styles.footer}>
          <Text>{this.state.region.longitudeDelta}</Text>
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
  }
});

AppRegistry.registerComponent('arg0', () => arg0);
