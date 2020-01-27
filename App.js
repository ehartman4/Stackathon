import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Dimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {googleMapsApiKey} from'./secrets'
// import google from ''

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Polyline from '@mapbox/polyline';

import AppNavigator from './navigation/AppNavigator';

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

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    getDirections("Disneyland","Universal+Studios+Hollywood")
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
        <AppNavigator />
      </View>
      // <View style={styles.container}>
      //   {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        // <AppNavigator />
      // </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
