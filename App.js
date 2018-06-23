import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Image,
  Text,
  View
} from 'react-native';
import Audio from 'react-native-video';

import Channel from './Channel';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    backgroundColor: '#000'
  },
  channels: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  logoContainer: {
    flex: 1,
    flexBasis: '50%',
    justifyContent: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 50
  },
  controls: {
    flex: 1
  }
});

export default class App extends Component {
  state = {
    buffering: false,
    muted: false,
    paused: true,
    channels: [
      { channel_name: '1', uri: 'https://stream-relay-geo.ntslive.net/stream' },
      { channel_name: '2', uri: 'https://stream-relay-geo.ntslive.net/stream2' }
    ],
    activeChannel: 0
  };

  componentDidMount() {
    fetch('https://www.nts.live/api/v2/live')
      .then(res => res.json())
      .then(({ results }) => {
        this.setState(state => ({
          ...state,
          channels: state.channels.map((channel, i) => ({
            ...channel,
            ...results[i]
          }))
        }));
      });
  }

  onBuffer = ({ isBuffering }) => {
    this.setState({ buffering: isBuffering });
  };

  onError = error => {
    console.error(error);
  };

  render() {
    const { buffering, activeChannel, muted, paused, channels } = this.state;
    const activeChannelURI = channels[activeChannel].uri;

    console.log(this.state);

    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('./nts-logo.png')} />
        </View>

        <View style={styles.channels}>
          {channels.map(channel => (
            <Channel key={channel.channel_name} {...channel} />
          ))}
          <Button
            title="Stream 1"
            onPress={() => {
              this.setState({ activeChannel: 0, paused: false });
            }}
          />
          <Button
            title="Stream 2"
            onPress={() => {
              this.setState({ activeChannel: 1, paused: false });
            }}
          />
        </View>

        <View style={styles.controls}>
          <Button
            title={paused ? 'Play' : 'Pause'}
            onPress={() => {
              this.setState(state => ({ paused: !state.paused }));
            }}
          />
          <Button
            title={muted ? 'Unmute' : ' Mute'}
            onPress={() => {
              this.setState(state => ({ muted: !state.muted }));
            }}
          />
          {buffering && <ActivityIndicator />}
        </View>

        <Audio
          source={{ uri: activeChannelURI }}
          paused={paused}
          muted={muted}
          onBuffer={this.onBuffer}
          onError={this.onError}
          playInBackground
          playWhenInactive
          ignoreSilentSwitch="ignore"
        />
      </View>
    );
  }
}
