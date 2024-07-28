import { useEffect, useState, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_API_KEY} from '@env'
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

const MapScreen = () => {
    const [locationCoordinate, setLocationCoordinate] = useState([])
    const [currectLocation, setCurrectLocation] = useState(null)
    // const [initialLocation, setInitialLocation] = useState({latitude: 28.35621289845291, 
    //   longitude: 77.27596389671442,})
      const [initialLocation, setInitialLocation] = useState(null)
    const mapRef = useRef()
    const markerRef = useRef()
    

    useEffect(()=>{
      Geolocation.getCurrentPosition(
        (position) => {
            setInitialLocation({ 
              latitude: position.coords.latitude,
                longitude: position.coords.longitude})

            setLocationCoordinate([...locationCoordinate, { 
              latitude: position.coords.latitude,
                longitude: position.coords.longitude}])
        },
        (error) => {
          console.log("getCurrentPosition",error.code, "hh", error.message);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 30000 }
      );

      // getCurrentLocation()

      // const watchId = Geolocation.watchPosition(
      //   (position) => {
      //     // console.log("watchPosition position",position);
      //     updateState(position)
      //   },
      //   (error) => {
      //     console.log("watchPosition error",error);
      //   },
      //   {enableHighAccuracy: true, distanceFilter: 10, }
      // );


      return(()=>{
        // Geolocation.clearWatch(watchId);
      })
    },[])

    updateState = (position) =>{
      console.log("update post", position)
      setLocationCoordinate([...locationCoordinate, { 
        latitude: position.coords.latitude,
          longitude: position.coords.longitude}])
    }

    // const getCurrentLocation = () =>{
    //   Geolocation.getCurrentPosition(
    //     (position) => {
    //       console.log("cuurent position",position);
    //       if(initialLocation) {
    //         setLocationCoordinate([...locationCoordinate, { 
    //           latitude: position.coords.latitude,
    //             longitude: position.coords.longitude}])
    //       }
    //       else{
    //         setInitialLocation({ 
    //           latitude: position.coords.latitude,
    //             longitude: position.coords.longitude})
    //         }
    //     },
    //     (error) => {
    //       console.log("getCurrentPosition",error.code, error.message);
    //     },
    //     { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    //   );
    // }

    const fetchTime = (d, t) => {
      updateState({
          distance: d,
          time: t
      })
  }

  const onCenter = () => {
    mapRef.current.animateToRegion({
        latitude: locationCoordinate.latitude,
        longitude: locationCoordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    })
}
    

      return (
        <View style={styles.container}>
          {initialLocation ? 
          <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              initialRegion={{
                ...initialLocation,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
        >
           {/* {locationCoordinate.map((coordinate, index) =>
              <Marker key={`coordinate_${index}`} coordinate={coordinate} />
            )} */}

          {locationCoordinate.length > 1 && (
            <MapViewDirections
                        origin={initialLocation}
                        destination={locationCoordinate.at(-1)}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={5}
                        strokeColor="blue"
                        precision='high'
                        splitWaypoints={true}
                        optimizeWaypoints={false}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        // onReady={result => {
                        //   console.log("result", result)
                        //     console.log(`Distance: ${result.distance} km`)
                        //     console.log(`Duration: ${result.duration} min.`)
                        //     fetchTime(result.distance, result.duration),
                        //         mapRef.current.fitToCoordinates(result.coordinates, {
                        //             edgePadding: {
                        //                 // right: 30,
                        //                 // bottom: 300,
                        //                 // left: 30,
                        //                 // top: 100,
                        //             },
                        //         });
                        // }}
                        onError={(errorMessage) => {
                            console.log('GOT AN ERROR', errorMessage);
                        }}
                    />)}
        </MapView> : 
          <Text style={styles.headingTxt}>Loader</Text>
        }
      </View>
      )
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headingTxt:{
    marginTop: 50,
    color:"black", 
    fontWeight: 'bold',
    fontSize:24,
    color: 'black'
  },
 });

export default MapScreen;