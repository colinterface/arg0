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
} from 'react-native';
import MapView from 'react-native-maps';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');

const audio = new Sound('0.mp3', Sound.MAIN_BUNDLE);
const story = [{ audio }];

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
      playingAudio: false,
      audioTime: 0,
    };

    this.audioTimeInterval = null;
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
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

    this.audioTimeInterval = setInterval(() =>{
      story[0].audio.getCurrentTime((audioTime) =>{
        LayoutAnimation.easeInEaseOut();
        this.setState({ audioTime });
      });
    }, 1000);

    story[0].audio.play(() =>{
      // set playing to false when sound ends
      this.setState({ playingAudio: false})
      clearInterval(this.audioTimeInterval);
    });
  }

  pauseAudio = () => {
    this.setState({ playingAudio: false });
    story[0].audio.pause();
    clearInterval(this.audioTimeInterval);
  }

  jumpAudio = (deltaSeconds) => {
    const audioTime = Math.min(
      story[0].audio.getDuration(),
      this.state.audioTime + deltaSeconds
    );
    story[0].audio.setCurrentTime(audioTime);
    LayoutAnimation.easeInEaseOut();
    this.setState({ audioTime });
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
              latitude: 37.708979,
              longitude: -122.376008,
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
              {'Enter The Portal'}
            </Text>
          </TouchableOpacity>
          <View style={styles.audioProgressBar}>
            <View
              style={{
                alignSelf: 'stretch',
                flex: this.state.audioTime / story[0].audio.getDuration(),
                backgroundColor: 'darkgoldenrod',
              }}
            />
            <View
              style={{
                flex: 1 - this.state.audioTime / story[0].audio.getDuration(),
              }}
            />
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              {`${Math.round(this.state.audioTime)} / ${Math.round(story[0].audio.getDuration())}`}
            </Text>
          </View>


          </View>
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={() => {
                this.jumpAudio(-15);
              }}
            >
              <Text style={styles.footerText}>
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
              <Text style={styles.footerText}>
                {'15 >'}
              </Text>
            </TouchableOpacity>
          </View>

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
  audioProgressBar: {
    height: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('arg0', () => arg0);
