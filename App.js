import React, { Component } from 'react';
import { ActivityIndicator, Button, StyleSheet, Image, Text, View } from 'react-native';
import Audio from 'react-native-video';

export default class App extends Component {
  state = {
    buffering: true,
    muted: false,
    paused: false,
    streams: [
      'https://stream-relay-geo.ntslive.net/stream',
      'https://stream-relay-geo.ntslive.net/stream2',
    ],
    activeStream: 0,
  };

  onBuffer = () => {
    this.setState({buffering: true});
  }

  onEnd = () => {
    console.log('onEnd', arguments)
  }

  onError = () => {
    console.log('videoError', arguments)
  }

  setTime = () => {
    this.setState({buffering: false})
  }

  onTimedMetadata = () => {
    console.log('onTimedMetadata', arguments)
  }

  render() {
    const { buffering, activeStream, muted, paused, streams,  } = this.state;
    const activeStreamUrl = streams[activeStream];

    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('./nts-logo.png')}
        />


        <View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', height: 10}}>
            <Button title="Stream 1" onPress={() => {this.setState({ activeStream: 0 })}}/>
            <Button title="Stream 2" onPress={() => {this.setState({ activeStream: 1 })}}/>
          </View>
        </View>

        <View>
          { buffering ?
            <ActivityIndicator/> :
            (
              <View>
                <Button title={paused ? 'Play' : 'Pause'} onPress={() => {this.setState(state => ({ paused: !state.paused}))}} />
                <Button title={muted ? 'Unmute' : ' Mute'} onPress={() => {this.setState(state => ({muted: !state.muted}))}} />
              </View>
            )
          }
        </View>

        <Audio
          source={{ uri: activeStreamUrl }}
          paused={paused}
          muted={muted}
          onBuffer={this.onBuffer}
          onEnd={this.onEnd}
          onError={this.onError}
          onProgress={this.setTime}
          onTimedMetadata={this.onTimedMetadata}
          playInBackground
          playWhenInactive
          ignoreSilentSwitch="ignore"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 50
  }
});
