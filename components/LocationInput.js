import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Button, Overlay, Card } from 'react-native-elements'
import styles from '../styles'


import Colors from '../constants/Colors';

export default class LocationInput extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    return (
      <>
        <TextInput style={{
          ...styles.inputStyle,
        }}
          placeholder="Start"
          autoCorrect={false}
          value={this.props.startText}
          onChange={(event) => this.props.handleChange(event, "startText")}
        ></TextInput>
        <TextInput style={{
          ...styles.inputStyle,
        }}
          placeholder="End"
          autoCorrect={false}
          value={this.props.endText}
          onChange={(event) => this.props.handleChange(event, "endText")}
        ></TextInput>
        <Button
          title="Go"
          onPress={this.props.handleClick}
        />
      </>
    );
  }
}
