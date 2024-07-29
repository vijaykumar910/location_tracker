import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import myImage from '../assets/images/placeholder.png';

const HomeScreen = prop => {
  const [locationPermission, setLocationPermission] = useState(false);
  useEffect(() => {
    getLocationPermission();
  }, []);

  async function getLocationPermission() {
    const permission = await requestLocationPermission();
    if (permission) {
      setLocationPermission(permission);
    } else {
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
      return result === RESULTS.GRANTED;
    } else {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        return (
          granted['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingTxt}>Welcome to LocationTracker</Text>
      <View style={[styles.bgImgContainer, styles.width80]}>
        <Image source={myImage} style={styles.bgImag} />
        <Text style={{color: 'black', marginTop: 10}}>
          Keep track and stay connected with Location Tracker. Get location
          updates every 10 minutes and check battery status.
        </Text>
      </View>
      <View style={styles.width80}>
        <TouchableOpacity
          style={styles.BtnStyle}
          onPress={() =>
            locationPermission
              ? prop.navigation.navigate('Map')
              : getLocationPermission()
          }>
          <Text style={styles.buttonText}>Track Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.BtnStyle}
          onPress={() => prop.navigation.navigate('Battery Status')}>
          <Text style={styles.buttonText}>Battery Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#82d1e2',
  },
  headingTxt: {
    marginTop: 50,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
  },
  bgImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  width80: {
    width: '80%',
  },
  bgImag: {
    width: 200,
    height: 200,
  },
  BtnStyle: {
    backgroundColor: '#117A65',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
