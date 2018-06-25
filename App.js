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
  backgroundArt: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    backgroundColor: '#000'
  },
  channels: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  logoContainer: {
    flex: 1,
    flexBasis: '30%',
    justifyContent: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 50
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

export default class App extends Component {
  state = {
    buffering: false,
    paused: true,
    channels: {
      '1': {
        channel_name: '1',
        uri: 'https://stream-relay-geo.ntslive.net/stream'
      },
      '2': {
        channel_name: '2',
        uri: 'https://stream-relay-geo.ntslive.net/stream2'
      }
    },
    activeChannel: null
  };

  componentDidMount() {
    fetch('https://www.nts.live/api/v2/live')
      .then(res => res.json())
      .then(({ results }) => {
        this.setState(state => {
          return {
            ...state,
            channelsDataLoaded: true,
            channels: results.reduce((result, channel) => {
              currentChannel = state.channels[channel.channel_name];

              return {
                ...result,
                [channel.channel_name]: {
                  ...currentChannel,
                  ...channel
                }
              };
            }, {})
          };
        });
      });
  }

  changeChannel = channel_name => {
    this.setState({ activeChannel: channel_name, paused: false });
  };

  onBuffer = ({ isBuffering }) => {
    this.setState({ buffering: isBuffering });
  };

  onError = error => {
    console.error(error);
  };

  render() {
    const { buffering, activeChannel, paused, channels } = this.state;
    const activeChannelObject = channels[activeChannel];
    const activeChannelURI = activeChannelObject && activeChannelObject.uri;
    const backgroundArt =
      activeChannelObject &&
      activeChannelObject.now.embeds.details.media.background_large;

    return (
      <View style={styles.container}>
        {backgroundArt && (
          <Image style={styles.backgroundArt} source={{ uri: backgroundArt }} />
        )}
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('./nts-logo.png')} />
        </View>

        {buffering && <ActivityIndicator />}

        {!!this.state.channelsDataLoaded && (
          <View style={styles.channels}>
            <Channel
              key={channels[1].channel_name}
              {...channels[1]}
              isActive={channels[1].channel_name === activeChannel}
              onSelect={this.changeChannel}
            />

            <Channel
              key={channels[2].channel_name}
              {...channels[2]}
              isActive={channels[2].channel_name === activeChannel}
              onSelect={this.changeChannel}
            />
          </View>
        )}

        {activeChannelURI && (
          <View style={styles.controls}>
            <Button
              title={paused ? 'Play' : 'Pause'}
              onPress={() => {
                this.setState(state => ({ paused: !state.paused }));
              }}
            />
          </View>
        )}

        {activeChannelURI && (
          <Audio
            source={{ uri: activeChannelURI }}
            paused={!activeChannelURI || paused}
            onBuffer={this.onBuffer}
            onError={this.onError}
            playInBackground
            playWhenInactive
            ignoreSilentSwitch="ignore"
          />
        )}
      </View>
    );
  }
}
