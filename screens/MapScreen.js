import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import SpinnerOverlay from "react-native-loading-spinner-overlay";

const Maps = () => {
  const [currentLocation, setCurrentLocation] = useState();
  const [coords, setCoords] = useState([]);
  const [locationHistory, setLocationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject);
        });

        const {coords} = position;

        setLocationHistory(prevHistory => [
          ...prevHistory,
          {
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: moment().format('MM/DD/YYYY HH:mm:ss'),
          },
        ]);
        setIsLoading(false)
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getLocation();

    const intervalId = setInterval(() => {
      getLocation();
    }, 600000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (locationHistory.length > 0) {
      setCurrentLocation(locationHistory[0]);
      const coordinatesWithoutTimestamp = locationHistory.map(coordinate => ({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }));
      setCoords(coordinatesWithoutTimestamp);
    }
  }, [locationHistory]);

  const getRotation = (coords, index) => {
    if (index < coords.length - 1) {
      const {latitude: lat1, longitude: lon1} = coords[index];
      const {latitude: lat2, longitude: lon2} = coords[index + 1];
      const angle = Math.atan2(lon2 - lon1, lat2 - lat1) * (180 / Math.PI);

      return angle;
    }

    return 0;
  };

  return (
    <View style={styles.container}>
        <SpinnerOverlay
        visible={isLoading}
        overlayColor=""
        color="gray"
        size="large"
        textContent={"loading..."}
        textStyle={{ color: "black" }}
      />
      <MapView
        provider={PROVIDER_GOOGLE}
        rotateEnabled={false}
        style={styles.map}
        region={{ 
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}>
        {coords.length > 1
          ? coords.map((coordinate, index) => (
              <React.Fragment key={index}>
                <Marker
                  coordinate={coordinate}
                  anchor={{x: 0.5, y: 0.5}}
                  rotation={getRotation(coords, index)}>
                  {index === coords.length - 1 ? (
                    <Marker coordinate={coordinate}>
                      <View
                        style={{
                          backgroundColor: '#17202A',
                          borderRadius: 90,
                          height: 35,
                          width: 35,
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text>stop</Text>
                      </View>
                    </Marker>
                  ) : index === 0 ? (
                    <Marker coordinate={coordinate}>
                      <View
                        style={{
                          backgroundColor: '#6495ED',
                          borderRadius: 90,
                          height: 35,
                          width: 35,
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text>start</Text>
                      </View>
                    </Marker>
                  ) : (
                    <Image
                      source={require('../assets/images/arrow.png')}
                      style={{
                        width: 20,
                        height: 20,
                        transform: [{rotate: `-${90}deg`}],
                      }}
                    />
                  )}
                </Marker>
                {index < coords.length - 1 && (
                  <Polyline
                    coordinates={[coordinate, coords[index + 1]]}
                    strokeWidth={6}
                    strokeColor="#6495ED"
                  />
                )}
              </React.Fragment>
            ))
          : coords.length === 1 && (
              <Marker coordinate={coords[0]} title="Current Location" />
            )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  arrow: {
    width: 30,
    height: 30,
  },
});

export default Maps;
