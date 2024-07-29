import Stack_Navigator from './routes/HomeStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';


function App(){

  return (
    <SafeAreaProvider>
        <Stack_Navigator />
     </SafeAreaProvider>
  );
}

export default App;