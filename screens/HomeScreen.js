import { useEffect, useState} from 'react';
import {
    Button,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    Linking,

  } from 'react-native';
  import { PermissionsAndroid, Platform } from 'react-native';
  import myImage from '../assets/images/placeholder.png';

const HomeScreen = (prop) => {
    const [locationPermission, setLocationPermission] = useState(false)

    useEffect(()=>{
      getLocationPermission()
    },[])

    async function getLocationPermission() {
      const permission = await requestLocationPermission();
      if(permission){
        setLocationPermission(permission)
      }
      else {
        Alert.alert(
          'Location access denied',
          'Please change your settings to allow to access your location.',
          [
            {text: 'Cancel'},
            {
              text: 'Go to Settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
          {cancelable: false},
        );
        return;
      }
    }

    async function requestLocationPermission() {
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return  result === RESULTS.GRANTED
      } else {
        try {
          const granted = await PermissionsAndroid.requestMultiple(
           [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
           ]
          );
        return granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        } catch (err) {
          console.warn(err);
        }
      }
    }

    const handleOnPress= ()=>{
      if(locationPermission){
        prop.navigation.navigate("Map")
      }
      else{
        getLocationPermission()
      }
    }

      return (
        <View style={styles.container}>
        <Text style={styles.headingTxt}>Track Your Feetprint</Text>

        <Image source={myImage} style={styles.bgImag}/>
        <View>
          <TouchableOpacity style={styles.button} onPress={handleOnPress}>
                <Text style={styles.BtnStyle}>Trackers</Text>
          </TouchableOpacity>
        </View>
      </View>
      )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor:"#82d1e2"
  },
  headingTxt:{
    marginTop: 50,
    color:"black", 
    fontWeight: 'bold',
    fontSize:24,
    color: 'black'
  },
  bgImag:{
    // marginTop: 100,
    width: 200,
     height: 200
  },
  BtnStyle:{
    backgroundColor:'#117A65',
    maxWidth: 270,
    // width: 250,
    // height: 40,
    paddingHorizontal:100,
    paddingVertical:12,
    borderRadius: 100,
  }

 });

export default HomeScreen;