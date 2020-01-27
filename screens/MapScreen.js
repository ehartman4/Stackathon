import React from 'react'

import {googleMapsApiKey} from'../secrets'

import {View} from 'react-native'

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Polyline from '@mapbox/polyline';

import styles from '../styles'


async function getDirections(startLoc, destinationLoc) {
  try {
       const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=transit&key=${googleMapsApiKey}`);
       const respJson = await resp.json();
       console.log(respJson)
       if (respJson.routes.length > 0) {
           const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
           const coords = points.map((point, index) => {
               return {
                   latitude: point[0],
                   longitude: point[1],
               };
           });
          //  this.setState({ coords });
          console.log(coords)
       }
       return;
   } catch (error) {
       alert(error);
   }
}

export default class MapScreen extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    getDirections("125+W+76th+St","Universal+Studios+Hollywood")
    //console.log(typeof PROVIDER_GOOGLE)
    //let directionsService = new google.maps.DirectionsService()
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: 40.705086,
            longitude: -74.009151,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        />
        {/* <AppNavigator /> */}
      </View>
      // <View style={styles.container}>
      //   {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        // <AppNavigator />
      // </View>
    );
  }
}
