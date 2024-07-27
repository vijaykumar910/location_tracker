import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
  } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

const MapComponent = () => {
    const [location_permission, setLocation_permission] = useState(false)
    const [location, setLocation] = useState([])
    const [currectLocation, setCurrectLocation] = useState(null)

    useEffect(()=>{
      getLocationPermission()
    },[])

    const getCurrentLocation = () =>{
      Geolocation.getCurrentPosition(
        (position) => {
          console.log("cuurent position",position);
          if(currectLocation) {
          setLocation([...location, { 
            latitude: position.coords.latitude,
              longitude: position.coords.longitude}])
          }
          else{
            setCurrectLocation({ 
              latitude: position.coords.latitude,
                longitude: position.coords.longitude})
            }
        },
        (error) => {
          console.log("getCurrentPosition",error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }

    async function getLocationPermission() {
      const permission = await requestLocationPermission();
      console.log("permission", permission)
      setLocation_permission(permission)
      if(permission){
        getCurrentLocation()
      }
    }
    
    async function requestLocationPermission() {
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return RESULTS.GRANTED
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        return PermissionsAndroid.RESULTS.GRANTED
        } catch (err) {
          console.warn(err);
        }
      }
    }

    onMapPress = (e) => {
      console.log("e.nativeEvent", e.nativeEvent.coordinate)
      setLocation([
          ...location,
          e.nativeEvent.coordinate,
        ]);
    }
    

      return (
        <View style={styles.container}>
          {currectLocation ? <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={
            {
              ...currectLocation,
            // latitude: currectLocation.latitude,
            // longitude: currectLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          } }
          onPress={this.onMapPress}
        >
           {location.map((coordinate, index) =>
              <Marker key={`coordinate_${index}`} coordinate={coordinate} />
            )}
        </MapView> : null}


        {/* <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={
            {
            latitude: 28.356104569405982,
            longitude: 77.2758818107661,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          } }
          onPress={this.onMapPress}
        >
           {location.map((coordinate, index) =>
              <Marker key={`coordinate_${index}`} coordinate={coordinate} />
            )}
        </MapView> */}
        <View>
          {location_permission ? <Text>Permission Granded</Text>: <Text>Permission Denie</Text>}
        </View>
      </View>
      )
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });

export default MapComponent;