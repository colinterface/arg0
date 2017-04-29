 // @flow

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  LayoutAnimation,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
const { RNLocation: Location } = NativeModules;
import MapView from 'react-native-maps';
import Sound from 'react-native-sound';
import { haversine } from 'node-geo-distance';

Sound.setCategory('Playback');

const audio = new Sound('0.mp3', Sound.MAIN_BUNDLE);
const story = [{ audio }];

var subscription = null;

const waypoints = [
  {
    title: 'chapter one',
    description: 'this is the beginning of the story',
    latitude: 37.708979,
    longitude: -122.376008,
    radius: 10,
    audio: new Sound('0.mp3', Sound.MAIN_BUNDLE),
  },
  {
    title: 'chapter two',
    description: 'this is the next part of the story',
    latitude: 37.708979,
    longitude: -122.37,
    radius: 10,
    audio: new Sound('0.mp3', Sound.MAIN_BUNDLE),
  },
]

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
      playingAudio: false,
      audioTime: 0,
      userLocation: null,
      distance: null,
      waypointIndex: 0,
    };

    this.audioTimeInterval = null;
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    Location.startUpdatingLocation();
    Location.setDistanceFilter(1);
    subscription = DeviceEventEmitter.addListener(
      'locationUpdated',
      ({ coords }) => {
        const { longitude, latitude } = coords;
        this.updateDistance(
          { longitude, latitude },
          { latitude: 37.708979, longitude: -122.376008 }
        );
      }
    );
  }

  updateDistance(coordsA, coordsB) {
    haversine(coordsA, coordsB, (distance) => {
      const { radius } = waypoints[this.state.waypointIndex];
      const roundedDistance = Math.round(distance);
      this.setState({ distance: roundedDistance });
      if (roundedDistance <= radius) {
        this.setState({ arrived: true });
        this.playAudio();
      }
    });
  }

  nextWaypoint() {
    const waypointIndex = this.state.waypointIndex + 1;
    this.stopAudio();
    this.setState({
      arrived: false,
      waypointIndex,
    });
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

  playAudio = () => {
    this.setState({ playingAudio: true });
    waypoints[this.state.waypointIndex].audio.play(this.stopAudio);
    this.updateAudioTime();
    this.audioTimeInterval = setInterval(this.updateAudioTime, 1000);
  }

  pauseAudio = () => {
    this.setState({ playingAudio: false });
    waypoints[this.state.waypointIndex].audio.pause();
    clearInterval(this.audioTimeInterval);
  }

  stopAudio = () => {
    this.setState({
      playingAudio: false,
      audioTime: 0,
    });
    waypoints[this.state.waypointIndex].audio.stop();
    clearInterval(this.audioTimeInterval);
  }

  jumpAudio = (deltaSeconds) => {
    const audioTime = this.state.audioTime + deltaSeconds;
    if (audioTime > waypoints[this.state.waypointIndex].audio.getDuration()) {
      this.stopAudio();
    } else {
      waypoints[this.state.waypointIndex].audio.setCurrentTime(audioTime);
      LayoutAnimation.easeInEaseOut();
      this.setState({ audioTime });
    }
  }

  updateAudioTime = () => {
    waypoints[this.state.waypointIndex].audio.getCurrentTime((audioTime) =>{
      LayoutAnimation.easeInEaseOut();
      this.setState({ audioTime });
    });
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
          mapType={'satellite'}
          legalLabelInsets={{
            left: -50,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: waypoints[this.state.waypointIndex].latitude,
              longitude: waypoints[this.state.waypointIndex].longitude,
            }}
            image={this.getMarkerImage()}
            flat={true}
            rotation={this.state.markerRotation}
          />
        </MapView>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() =>{
              this.setState({
                mapRegion: {
                  latitude: 37.708979,
                  longitude: -122.376008,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
              });
            }}
          >
            <Text style={styles.footerText}>
              {`${this.state.distance} M`}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>
            {waypoints[this.state.waypointIndex].title}
          </Text>
          <Text style={styles.footerTextSmall}>
            {waypoints[this.state.waypointIndex].description}
          </Text>

            <View style={styles.audioProgressBar}>
              <View
                style={{
                  alignSelf: 'stretch',
                  flex: this.state.audioTime / waypoints[this.state.waypointIndex].audio.getDuration(),
                  backgroundColor: 'blue',
                }}
              />
              <View
                style={{
                  flex: 1 - this.state.audioTime / waypoints[this.state.waypointIndex].audio.getDuration(),
                }}
              />
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>
                {`${Math.round(this.state.audioTime)} / ${Math.round(waypoints[this.state.waypointIndex].audio.getDuration())}`}
              </Text>
            </View>


            </View>
            <View style={styles.footerRow}>
              <TouchableOpacity
                onPress={() => {
                  this.jumpAudio(-15);
                }}
              >
                <Text style={styles.footerTextSmall}>
                  {'< 15'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.playingAudio) {
                    this.pauseAudio();
                  } else {
                    this.playAudio();
                  }
                }}
              >
                <Text style={styles.footerText}>
                  {this.state.playingAudio ? '| |' : '|>'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.jumpAudio(15);
                }}
              >
                <Text style={styles.footerTextSmall}>
                  {'15 >'}
                </Text>
              </TouchableOpacity>
            </View>
            {
              this.state.waypointIndex < waypoints.length - 1 && this.state.arrived ? (
                <TouchableOpacity
                  onPress={() => {
                    this.nextWaypoint();
                  }}
                >

                  <Text style={styles.footerTextSmall}>
                    {'next chapter'}
                  </Text>
                </TouchableOpacity>
              ) : null
            }

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
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
  },
  footerRow: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerText: {
    margin: 10,
    fontSize: 40,
    color: '#ddd'
  },
  footerTextSmall: {
    margin: 10,
    fontSize: 20,
    color: '#ddd'
  },
  audioProgressBar: {
    height: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('arg0', () => arg0);
