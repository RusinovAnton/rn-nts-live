import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  channelContainer: {},
});

class Channel extends Component {
  static displayName = 'Channel';
  static propTypes = {
    channel_name: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
    now: PropTypes.shape({}).isRequired
  };

  render() {
    const { channel_name } = this.props;
    return (
      <View style={styles.channelContainer}>
        <Text>{channel_name}</Text>
      </View>
    );
  }
}

export default Channel;
