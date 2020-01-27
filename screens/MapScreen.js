import React from 'react'

import {googleMapsApiKey} from'../secrets'

import {View, Text, TextInput} from 'react-native'

import {Button} from 'react-native-elements'

import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import polyline from '@mapbox/polyline';

import styles from '../styles'




export default class MapScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      polylineCoords: [],
      startCoord: {
        latitude: 40.705086,
        longitude: -74.009151},
      endCoord: {
        latitude: 40.705086,
        longitude: -74.009151},
      startText: "",
      endText: ""
    }
    this.handleClick = this.handleClick.bind(this)
  }

  encodeLocation(addressString) {
    const encodings = {
      " ": "+",
      "\"": "%22",
      ",": "%2C",
      "<": "%3C",
      ">": "%3E",
      "#": "%23",
      "%": "%25",
      "|": "%7C",
      "&": "%26",
      "?": "%3F"
    }
    return addressString.split("").map((char)=> {
      if(encodings[char]) {
        return encodings[char]
      } else {
        return char
      }
    }).join("")
  }

  async getDirections(startLoc, destinationLoc) {
    try {
        console.log("CALLING AGAIN!")
         const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.encodeLocation(startLoc)}&destination=${this.encodeLocation(destinationLoc)}&mode=transit&key=${googleMapsApiKey}`);
         const respJson = await resp.json();
         if (respJson.routes.length > 0) {
             const points = polyline.decode(respJson.routes[0].overview_polyline.points);
             const coords = points.map((point, index) => {
                 return {
                     latitude: point[0],
                     longitude: point[1],
                 };
             });
            this.setState({
              polylineCoords: coords,
              startCoord: coords[0],
              endCoord: coords[coords.length - 1]
             });
         }
         return;
     } catch (error) {
         alert(error);
     }
  }

  async componentDidMount() {
    try {
      // console.log(this.encodeLocation("Freddie & Pepper's"))
      // await this.getDirections("125+W+76th+St","Freddie+and+Peppers")
      // await this.getDirections("125 W 76th St","Grace Hopper Program")
    } catch (error) {
      alert(error)
    }
  }

  onMapLayout() {
    console.log("HERE")
    if (this.state.polylineCoords.length > 0) {
      this.mapRef.fitToCoordinates(
        [this.state.startCoord,this.state.endCoord],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true
        }
      )
    }
    return;
  }

  handleChange(event,name) {
    this.setState({
      [name]: event.nativeEvent.text
    })
  }

  async handleClick() {
    try {
      await this.getDirections(this.state.startText,this.state.endText)
      this.setState({
        startText: "",
        endText: ""
      })
    } catch (error) {
      alert(error)
    }
  }

  render() {
    //let directionsService = new google.maps.DirectionsService()
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 40.705086,
            longitude: -74.009151,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          ref={(ref) => { this.mapRef = ref }}
          onLayout={this.onMapLayout()}
          showsUserLocation={true}
        >
          { this.state.polylineCoords.length > 0 ?
          <>
          <Polyline coordinates = {this.state.polylineCoords}
          />
          <Marker coordinate={this.state.startCoord}/>
          <Marker coordinate={this.state.endCoord}/>
          </>:
          <Marker coordinate={{latitude: 40.705086,
            longitude: -74.009151}}/>
          }

          </MapView>
        {/* <AppNavigator /> */}
          <View style={{
          position: "absolute",
          top: 50,
          left: 50,
          }}>

        <TextInput style={{...styles.inputStyle,
          }}
          placeholder="Start"
          autoCorrect={false}
          onChange={(event) => this.handleChange(event,"startText")}
          ></TextInput>
        <TextInput style={{...styles.inputStyle,
          }}
          placeholder="End"
          autoCorrect={false}
          value={this.state.endText}
          onChange={(event) => this.handleChange(event,"endText")}
          ></TextInput>
          <Button
            title="Go"
            onPress={this.handleClick}
          />
          </View>

      </View>
      // <View style={styles.container}>
      //   {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        // <AppNavigator />
      // </View>
    );
  }
}
