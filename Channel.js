import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#fff',
    width: '100%',
    padding: 10
  },
  text: {
    color: '#fff'
  },
  activeContainer: {
    backgroundColor: '#fff'
  },
  activeText: {
    color: '#000'
  }
});

class Channel extends Component {
  static displayName = 'Channel';
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    channel_name: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
    now: PropTypes.shape({
      broadcast_title: PropTypes.string.isRequired,
      start_timestamp: PropTypes.string.isRequired,
      end_timestamp: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string.isRequired,
          rel: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired
        })
      )
    }).isRequired
  };

  render() {
    const {
      isActive,
      channel_name,
      now: { broadcast_title },
      onSelect
    } = this.props;

    const containerStyle = [
      styles.container,
      isActive && styles.activeContainer
    ];
    const textStyle = [styles.text, isActive && styles.activeText];

    return (
      <TouchableOpacity onPress={() => onSelect(channel_name)}>
        <View style={containerStyle}>
          <Text style={textStyle}>
            {`${channel_name} - ${broadcast_title}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Channel;
