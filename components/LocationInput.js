import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Button, Overlay, Card } from 'react-native-elements'
import styles from '../styles'


import Colors from '../constants/Colors';

export default class LocationInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(event, name) {
    this.setState({
      [name]: event.nativeEvent.text
    })
  }

  async handleClick() {
    try {
      await this.getDirections(this.state.startText, this.state.endText)
      this.setState({
        startText: "",
        endText: "",
      })
    } catch (error) {
      alert(error)
    }
  }

  render() {

    return (
      <>
        <TextInput style={{
          ...styles.inputStyle,
        }}
          placeholder="Start"
          autoCorrect={false}
          value={this.state.startText}
          onChange={(event) => this.handleChange(event, "startText")}
        ></TextInput>
        <TextInput style={{
          ...styles.inputStyle,
        }}
          placeholder="End"
          autoCorrect={false}
          value={this.state.endText}
          onChange={(event) => this.handleChange(event, "endText")}
        ></TextInput>
        <Button
          title="Go"
          onPress={this.handleClick}
        />
      </>
    );
  }
}
