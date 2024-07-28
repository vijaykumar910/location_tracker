import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
const Stack = createStackNavigator();

const Stack_Navigator = () => {

    return(
        <Stack.Navigator initialRouteName="Home" >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
    )
}

export default Stack_Navigator;