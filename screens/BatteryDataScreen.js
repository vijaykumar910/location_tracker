import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  faBatteryEmpty,
  faBatteryFull,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryThreeQuarters,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import {NativeModules} from 'react-native';
const {BatteryOptimizationCheck} = NativeModules;
import chargingImg from '../assets/images/charging.png';
import optimizationImg from '../assets/images/optimization.png';
import savingImg from '../assets/images/saving.png';

const BatteryDataScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [batteryData, setBatteryData] = useState({
    batteryLevel: 0,
    isPowerSaveMode: null,
    isPowerOptimization: null,
    location: null,
    isBatteryCharging: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (BatteryOptimizationCheck) {
          const isBatteryOptEnabled =
            await BatteryOptimizationCheck.isBatteryOptEnabled();
          const isPowerSaveModeEnabled =
            await BatteryOptimizationCheck.isPowerSaveModeEnabled();
          const batteryPercentage =
            await BatteryOptimizationCheck.getBatteryPercentage();
          const isbatteryCharing = await BatteryOptimizationCheck.isCharging();

          let data = {
            batteryLevel: batteryPercentage,
            isPowerSaveMode: isPowerSaveModeEnabled,
            isPowerOptimization: isBatteryOptEnabled,
            isBatteryCharging: isbatteryCharing,
          };

          setBatteryData(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching battery information:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusMessageStyle = () => {
    const {batteryLevel} = batteryData;
    let message, color;

    if (batteryLevel <= 20) {
      message = "Your device's battery is running low!";
      color = '#e74c3c';
    } else if (batteryLevel <= 50) {
      message = "Your device's battery is moderately charged.";
      color = '#f39c12';
    } else {
      message = "Your device's battery is in good condition.";
      color = '#2ecc71';
    }

    return {
      message,
      text: {...styles.statusMessage, color},
    };
  };

  return (
    <View style={styles.container}>
      <SpinnerOverlay
        visible={isLoading}
        overlayColor=""
        color="gray"
        size="large"
        textContent={'loading...'}
        textStyle={{color: 'black'}}
      />

      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <FontAwesomeIcon
            icon={
              batteryData.batteryLevel &&
              batteryData.batteryLevel >= 90 &&
              batteryData.batteryLevel <= 100
                ? faBatteryFull
                : batteryData.batteryLevel >= 60 &&
                  batteryData.batteryLevel <= 90
                ? faBatteryThreeQuarters
                : batteryData.batteryLevel >= 35 &&
                  batteryData.batteryLevel <= 60
                ? faBatteryHalf
                : batteryData.batteryLevel >= 8 &&
                  batteryData.batteryLevel <= 35
                ? faBatteryQuarter
                : faBatteryEmpty
            }
            size={40}
            color="#2ecc71"
          />
          <Text style={styles.infoText}>
            Battery Level:{' '}
            {batteryData.batteryLevel ? `${batteryData.batteryLevel}%` : '0'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Image source={savingImg} style={styles.Imag} />
          <Text style={styles.infoText}>
            Power Saving Mode:{' '}
            {batteryData.isPowerSaveMode ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Image source={optimizationImg} style={styles.Imag} />
          <Text style={styles.infoText}>
            Power Optimization:{' '}
            {batteryData.isPowerOptimization ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Image source={chargingImg} style={styles.Imag} />
          <Text style={styles.infoText}>
            Charging: {batteryData.isBatteryCharging ? 'ON' : 'OFF'}
          </Text>
        </View>

        <Text style={getStatusMessageStyle().text}>
          {getStatusMessageStyle().message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '100%',
    maxWidth: 400,
    color: 'black',
    marginVertical: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    paddingVertical: 40,
    marginVertical: 40,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black',
  },
  statusMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#e74c3c',
  },
  Imag: {
    width: 40,
    height: 40,
  },
});

export default BatteryDataScreen;
