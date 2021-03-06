import {StyleSheet, Dimensions} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapStyle: {
    flex: 4
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
  },
  inputStyle: {
    height: 40,
    width: 100,
    padding: 5,
    margin: 5,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
  }
});

export default styles
