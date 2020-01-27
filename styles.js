import {StyleSheet, Dimensions} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  inputStyle: {
    height: 40,
    width: 100,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    // position: "absolute",
    //       top: 50,
    //       left: 50,
  }
});

export default styles
