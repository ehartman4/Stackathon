import React from 'react'

import { googleMapsApiKey } from '../secrets'

import { Dimensions, View, Text, TouchableHighlight } from 'react-native'

import { Button, Overlay, Card } from 'react-native-elements'

import { Stopwatch } from 'react-native-stopwatch-timer'

import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import polyline from '@mapbox/polyline';

import styles from '../styles'
import LocationInput from '../components/LocationInput'




export default class MapScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      polylineCoords: [],
      startCoord: {
        latitude: 40.705086,
        longitude: -74.009151
      },
      endCoord: {
        latitude: 40.705086,
        longitude: -74.009151
      },
      startText: "",
      endText: "",
      timeEstimate: "",
      points: 0,
      isVisible: false,
      stopWatchVisible: false,
      stopwatchStart: false,
      stopwatchReset: false,
      currentTime: "",
      hasEnded: false
    }
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
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
    return addressString.split("").map((char) => {
      if (encodings[char]) {
        return encodings[char]
      } else {
        return char
      }
    }).join("")
  }

  convertGoogleTimeToStopwatch(time) {
    let timeArr = time.split(" ")
    if (timeArr[0].length === 1) {
      timeArr[0] = '0'.concat(timeArr[0])
    }
    if (time.includes("hr")) {
      if (timeArr[2].length === 1) {
        timeArr[2] = '0'.concat(timeArr[2])
      }
      return timeArr[0].concat(":", timeArr[2], ":00")
    } else {
      return "00".concat(":", timeArr[0], ":00")
    }
  }

  async getDirections(startLoc, destinationLoc) {
    try {
      // console.log("CALLING AGAIN!")

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
          endCoord: coords[coords.length - 1],
          timeEstimate: respJson.routes[0].legs[0].duration.text,
          isVisible: true
        });
      } else {
        alert("Locations not recognized")
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
    if (this.state.polylineCoords.length > 0) {
      //this.mapRef.fitToCoordinates(
      this.refs.map.fitToCoordinates(
        [this.state.startCoord, this.state.endCoord],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true
        }
      )
    }
    return;
  }

  async toggleStopwatch() {
    await this.setState({ stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false });
    if (!this.state.stopwatchStart) {
      const time = this.refs.stopwatch.formatTime()
      await this.setState({ currentTime: time })
      let googleTime = this.convertGoogleTimeToStopwatch(this.state.timeEstimate)
      if (this.state.currentTime <= googleTime) {
        alert("You beat Google!! \n You get 200 points!")
        await this.setState({ points: this.state.points + 200 })
      } else {
        alert("Google beat you :( \n Here's 50 points for trying!")
        await this.setState({ points: this.state.points + 50 })
      }
    }
  }

  resetStopwatch() {

    this.setState({ stopwatchStart: false, stopwatchReset: true, });
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
          // ref={(ref) => { this.mapRef = ref }}
          ref="map"
          onLayout={this.onMapLayout()}
          showsUserLocation={true}
        >
          {this.state.polylineCoords.length > 0 ?
            <>
              <Polyline coordinates={this.state.polylineCoords}
              />
              <Marker coordinate={this.state.startCoord} />
              <Marker coordinate={this.state.endCoord} />
            </> :
            <Marker coordinate={{
              latitude: 40.705086,
              longitude: -74.009151
            }} />
          }

        </MapView>
        {/* <AppNavigator /> */}
        <View style={{
          position: "absolute",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          top: 50,
          left: 40,
          right: 40
        }}>

          <View >
            <LocationInput />
          </View>
          <View style={{
            borderRadius: 10,
            backgroundColor: "rgba(70,130,180,0.8)",
            height: 40
          }}>
            <Text style={{
              fontSize: 25,
              padding: 5,
              color: "white"
            }}
            >{this.state.points} pts</Text>
          </View>
        </View>

        <Overlay
          isVisible={this.state.stopWatchVisible}
          height={Dimensions.get('window').height * .4}
          width={Dimensions.get('window').width * .6}
          overlayBackgroundColor="rgba(0,0,0,0)"
          windowBackgroundColor="rgba(0,0,0,0.2)"
          overlayStyle={{

          }}
          onBackdropPress={() => { this.setState({ stopWatchVisible: false, isVisible: false }) }}
        >
          <Stopwatch start={this.state.stopwatchStart}
            reset={this.state.stopwatchReset}
            options={options}
            msecs
            ref="stopwatch"
          />
          <TouchableHighlight onPress={this.toggleStopwatch}>
            <Text style={{ fontSize: 25 }}>{!this.state.stopwatchStart ? "Start" : "I've arrived!"}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.resetStopwatch}>
            <Text style={{ fontSize: 10 }}>Reset</Text>
          </TouchableHighlight>
        </Overlay>
        {this.state.isVisible ?
          <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'steelblue'
          }}>
            <Text style={{
              flex: 2,
              color: 'white',
              fontSize: 26,
              textAlign: "center"
            }}>
              The machine thinks this trip is going to take you {this.state.timeEstimate.split(" ").map(word => {
                if (word === "mins") {
                  return "minutes"
                } else if (word === "hrs") {
                  return "hours"
                } else { return word }
              }).join(" ")}.{'\n'}
              Think you can beat it?!?</Text>
            <TouchableHighlight
              onPress={() => {
                this.setState({ stopWatchVisible: true })
                this.toggleStopwatch()
              }}
              style={{
                flex: 1,
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                  borderColor: "white",
                  borderWidth: 1,
                  borderRadius: 10,
                  width: 150,
                  shadowOffset: { width: 3, height: 3 },
                  shadowOpacity: 1
                }}
              >LET'S GO!</Text>
            </TouchableHighlight>
          </View>
          : <></>}


      </View>
      // <View style={styles.container}>
      //   {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      // <AppNavigator />
      // </View>
    );
  }
}

const handleTimerComplete = () => alert("custom completion function");

const options = {
  container: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    width: 220,
  },
  text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 7,
  }
};
