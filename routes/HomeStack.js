import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import BatteryDataScreen from '../screens/BatteryDataScreen';
const Stack = createStackNavigator();

const Stack_Navigator = () => {

    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Map" component={MapScreen} /> 
          <Stack.Screen name="Battery Status" component={BatteryDataScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    )
}

export default Stack_Navigator;